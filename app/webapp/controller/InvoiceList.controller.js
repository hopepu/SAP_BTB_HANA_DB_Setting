sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "ui5/walkthrough/model/formatter",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, Fragment, formatter, MessageBox) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
        formatter: formatter,

        onInit: function () {
            const oRequestModel = this.getOwnerComponent().getModel("request");
             this.getView().setModel(oRequestModel, "request");
            console.log(oRequestModel);
            
        },
        onSearchFilter: function () {
            // 필터 변경을 트리거하는 onFilterChange 호출
            this.onFilterChange();
        },        

        onFilterChange: function () {
            const aFilter = [];
            const sRequestNumber = this.byId("requestNumberFilter").getValue();
            const sRequestProduct = this.byId("requestProductFilter").getValue();
            const sRequestor = this.byId("requestorFilter").getValue();
            const sRequestDate = this.byId("requestDateFilter").getDateValue();
            const sRequestState = this.byId("requestStateFilter").getSelectedKey();

            if (sRequestNumber) {
                console.log(sRequestNumber);
                aFilter.push(new Filter("request_number", FilterOperator.Eq, sRequestNumber));
            }
            if (sRequestProduct) {
                aFilter.push(new Filter("request_product", FilterOperator.Contains, sRequestProduct));
            }
            if (sRequestor) {
                aFilter.push(new Filter("requestor", FilterOperator.Contains, sRequestor));
            }
            if (sRequestDate) {// Date 객체를 문자열로 변환하여 비교
                const sFormattedDate = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}).format(sRequestDate);
                console.log("입력된 날짜 :" + sFormattedDate);
                aFilter.push(new Filter("request_date", FilterOperator.EQ, sFormattedDate));
            }
            if (sRequestState) {
                aFilter.push(new Filter("request_state", FilterOperator.EQ, sRequestState));
            }

            const oList = this.byId("RequestLists");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },

        onResetFilter: function () {
            this.byId("requestNumberFilter").setValue("");
            this.byId("requestProductFilter").setValue("");
            this.byId("requestorFilter").setValue("");
            this.byId("requestDateFilter").setValue(null);
            this.byId("requestStateFilter").setSelectedKey("");
            this.onFilterChange();
        },
        onPressAdd: function (oEvent) {
            console.log("물품신청서");

            const oRequestModel = this.getOwnerComponent().getModel("request");


            // 화면 전환
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("InvoiceAdd");
            console.log("네비게이션 성공");

        },
        onPress: function (oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("request");


            if (!oContext) {
                sap.m.MessageToast.show("선택된 데이터를 찾을 수 없습니다.");
                return;
            }

            if (this._oDialog) {
                this._setFieldsEditable(false); // 기본적으로 읽기 전용 설정
                this._oDialog.setBindingContext(oContext, "request");
                this._oDialog.open();
                return;
            }

            Fragment.load({
                id: this.createId("DetailFragment"),
                name: "ui5.walkthrough.view.Detail",
                controller: this
            }).then(function (oFragment) {
                this._oDialog = new sap.m.Dialog({
                    title: "신청서 상세보기",
                    content: oFragment,
                    buttons: [
                        new sap.m.Button({
                            text: "수정",
                            press: this.onEdit.bind(this)
                        }),
                        new sap.m.Button({
                            text: "닫기",
                            press: function () {
                                this._oDialog.close();
                            }.bind(this)
                        })
                    ]
                });
                this.getView().addDependent(this._oDialog);
                this._setFieldsEditable(false); // 팝업 열 때 기본 읽기 전용
                this._oDialog.setBindingContext(oContext, "request");
                this._oDialog.open();
            }.bind(this)).catch(function (error) {
                sap.m.MessageToast.show("Fragment 로딩에 실패했습니다.");
                console.error("Fragment 로딩 실패:", error);
            });
        },

        onSave: function () {
            const oBindingContext = this._oDialog.getBindingContext("request");

            if (!oBindingContext) {
                sap.m.MessageToast.show("저장할 데이터를 찾을 수 없습니다.");
                return;
            }

            const sPath = oBindingContext.getPath();
            const oModel = this.getView().getModel("request");

            // Fragment 내부의 UI 요소 접근
            const oRequestProductField = Fragment.byId(this.createId("DetailFragment"), "requestProductField");
            const oRequestQuantityField = Fragment.byId(this.createId("DetailFragment"), "requestQuantityField");
            const oRequestorField = Fragment.byId(this.createId("DetailFragment"), "requestorField");
            const oRequestDateField = Fragment.byId(this.createId("DetailFragment"), "requestDateField");
            const oRequestStateField = Fragment.byId(this.createId("DetailFragment"), "requestStateField");

            // 모델 업데이트 (ODataModel의 경우 update를 사용할 수 있음, JSONModel의 경우 setProperty를 사용)
            if (oModel instanceof sap.ui.model.json.JSONModel) {
                oModel.setProperty(sPath + "/request_product", oRequestProductField.getValue());
                oModel.setProperty(sPath + "/request_quantity", oRequestQuantityField.getValue());
                oModel.setProperty(sPath + "/requestor", oRequestorField.getValue());
                oModel.setProperty(sPath + "/request_date", oRequestDateField.getDateValue());
                oModel.setProperty(sPath + "/request_state", oRequestStateField.getSelectedKey());
            }

            // 저장 성공 메시지
            sap.m.MessageToast.show("데이터가 성공적으로 저장되었습니다.");
            // 수정 후 닫기 버튼 추가
            this._oDialog.addButton(new sap.m.Button({
                text: "닫기",
                press: function () {
                    this._oDialog.close();
                }.bind(this)
            }));
            // 수정 후 저장 버튼 제거
            const aButtons = this._oDialog.getButtons();
            aButtons.forEach(function (oButton) {
                if (oButton.getText() === "저장") {
                    this._oDialog.removeButton(oButton); // 저장 버튼 제거
                }
                if (oButton.getText() === "신청 취소") {
                    this._oDialog.removeButton(oButton); // 저장 버튼 제거
                }
            }.bind(this));

            this._oDialog.close(); // 변경 완료 후 Dialog 닫기
        },

        _setFieldsEditable: function (bEditable) {
            const oRequestProductField = Fragment.byId(this.createId("DetailFragment"), "requestProductField");
            const oRequestQuantityField = Fragment.byId(this.createId("DetailFragment"), "requestQuantityField");
            const oRequestorField = Fragment.byId(this.createId("DetailFragment"), "requestorField");
            const oRequestDateField = Fragment.byId(this.createId("DetailFragment"), "requestDateField");
            const oRequestStateField = Fragment.byId(this.createId("DetailFragment"), "requestStateField");

            // 각 필드의 editable 속성 설정
            oRequestProductField.setEditable(bEditable);
            oRequestQuantityField.setEditable(bEditable);
            oRequestorField.setEditable(bEditable);
            oRequestDateField.setEditable(bEditable);
            oRequestStateField.setEditable(bEditable);
        },
        onEdit: function () {
            this._setFieldsEditable(true);

            const oRequestStateField = Fragment.byId(this.createId("DetailFragment"), "requestStateField");
            const sRequestState = oRequestStateField.getSelectedKey();

            const aButtonsToAdd = [
                new sap.m.Button({
                    text: "저장",
                    press: this.onSave.bind(this)
                })
            ];

            if (sRequestState === "B") {
                aButtonsToAdd.push(new sap.m.Button({
                    text: "신청 취소",
                    press: this.onDelete.bind(this)
                }));
            }

            this._updateDialogButtons(aButtonsToAdd, ["닫기", "저장", "신청 취소"]);

        },

        onDelete: function () {
            const oBindingContext = this._oDialog.getBindingContext("request");

            if (!oBindingContext) {
                sap.m.MessageToast.show("삭제할 데이터를 찾을 수 없습니다.");
                return;
            }

            const aButtons = this._oDialog.getButtons();
            aButtons.forEach(function (oButton) {                
                if (oButton.getText() === "신청 취소") {
                    this._oDialog.removeButton(oButton); // 저장 버튼 제거
                }
            }.bind(this));
            

            oBindingContext.delete().then(() => {
                sap.m.MessageToast.show("데이터 삭제 성공");
                this._oDialog.close();
            }).catch((oError) => {
                MessageBox.error("데이터 삭제 실패");
                console.error(oError);
            });
        },

        _updateDialogButtons: function (aButtonsToAdd, aButtonsToRemove) {
            aButtonsToRemove.forEach((sText) => {
                const oButton = this._oDialog.getButtons().find(btn => btn.getText() === sText);
                if (oButton) this._oDialog.removeButton(oButton);
            });
            aButtonsToAdd.forEach((oButton) => this._oDialog.addButton(oButton));
        }


    });
});

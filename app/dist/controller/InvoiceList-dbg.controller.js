sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "ui5/walkthrough/model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, Fragment, formatter) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
        formatter: formatter,

        onInit: function () {
            const oViewModel = new JSONModel({
                currency: "EUR"
            });
            this.getView().setModel(oViewModel, "view");

            const oRequestModel = this.getOwnerComponent().getModel("request");
            this.getView().setModel(oRequestModel, "request");
        },

        onFilterChange: function () {
            const aFilter = [];
            const sRequestNumber = this.byId("requestNumberFilter").getValue();
            const sRequestProduct = this.byId("requestProductFilter").getValue();
            const sRequestor = this.byId("requestorFilter").getValue();
            const sRequestDate = this.byId("requestDateFilter").getDateValue();
            const sRequestState = this.byId("requestStateFilter").getSelectedKey();

            if (sRequestNumber) {
                aFilter.push(new Filter("request_number", FilterOperator.Contains, sRequestNumber));
            }
            if (sRequestProduct) {
                aFilter.push(new Filter("request_product", FilterOperator.Contains, sRequestProduct));
            }
            if (sRequestor) {
                aFilter.push(new Filter("requestor", FilterOperator.Contains, sRequestor));
            }
            if (sRequestDate) {
                aFilter.push(new Filter("request_date", FilterOperator.EQ, sRequestDate));
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
        onPress: function (oEvent) {
            const oItem = oEvent.getSource();
        
            // Dialog가 없으면 새로 생성
            if (!this._oDialog) {
                // Fragment를 로드합니다.
                Fragment.load({
                    name: "ui5.walkthrough.view.Detail",  // Fragment 경로
                    controller: this
                }).then(function(oFragment) {  // 화살표 함수 사용
                    this._oDialog = new sap.m.Dialog({
                        title: "상세 보기",
                        content: [oFragment],  // Fragment를 Dialog content로 추가
                        buttons: [
                            new sap.m.Button({
                                text: "수정",
                                press: this.onSave.bind(this)  // 'this'를 bind로 명시적으로 설정
                            }),
                            new sap.m.Button({
                                text: "닫기",
                                press: function () {  // 화살표 함수 대신 일반 function 사용
                                    this._oDialog.close();  // 팝업 닫기
                                }.bind(this)  // 이곳에서도 명시적으로 this를 바인딩
                            })
                        ]
                    });
        
                    this.getView().addDependent(this._oDialog);  // Dialog를 뷰에 추가
        
                    // 선택된 항목의 바인딩 컨텍스트 가져오기
                    const oBindingContext = oItem.getBindingContext("request");
                    this._oDialog.setBindingContext(oBindingContext, "request");
        
                    // 팝업 열기
                    this._oDialog.open();
                }.bind(this))  // 'this'를 bind로 명시적으로 설정
                .catch(function (error) {
                    console.error("Fragment loading failed:", error);  // 오류 발생시 출력
                });
            } else {
                // Dialog가 이미 존재하면 바인딩 컨텍스트만 설정
                const oBindingContext = oItem.getBindingContext("request");
                this._oDialog.setBindingContext(oBindingContext, "request");  // Dialog에 데이터 바인딩
                this._oDialog.open();
            }
        },
        
        onSave: function () {
            // Dialog에서 선택된 항목의 바인딩 컨텍스트 가져오기
            const oBindingContext = this._oDialog.getBindingContext("request");
            console.log("oBindingContext : " + oBindingContext )
        
            // 바인딩 컨텍스트가 없으면 종료
            if (!oBindingContext) {
                sap.m.MessageToast.show("저장할 데이터를 찾을 수 없습니다.");
                return;
            }
        
            const sPath = oBindingContext.getPath();
            console.log("sPath : " + sPath)
            const oModel = this.getView().getModel("request");
            console.log("oModel : " + oModel)
            console.log("this : " + this);
        
            // Fragment 내 UI 요소에 접근하기 전에 해당 ID가 올바르게 매핑되었는지 확인
            const oRequestProductField = this.byId("request_product");
            const oRequestQuantityField = this.byId("requestQuantityField");
            const oRequestorField = this.byId("requestorField");
            const oRequestDateField = this.byId("requestDateField");
            const oRequestStateField = this.byId("requestStateField");
        
            // 디버깅을 위한 로그 추가 (이 부분을 통해 어떤 필드가 undefined인지 확인)
            console.log("requestProductField:", oRequestProductField);
            console.log("requestQuantityField:", oRequestQuantityField);
            console.log("requestorField:", oRequestorField);
            console.log("requestDateField:", oRequestDateField);
            console.log("requestStateField:", oRequestStateField);
        
            // 필드가 존재하지 않으면 오류 메시지
            if (!oRequestProductField || !oRequestQuantityField || !oRequestorField || !oRequestDateField || !oRequestStateField) {
                sap.m.MessageToast.show("필드가 제대로 로드되지 않았습니다.");
                return;
            }
        
            // UI 요소에서 값을 가져와서 모델에 반영
            oModel.setProperty(sPath + "/request_product", oRequestProductField.getValue());
            oModel.setProperty(sPath + "/request_quantity", oRequestQuantityField.getValue());
            oModel.setProperty(sPath + "/requestor", oRequestorField.getValue());
            oModel.setProperty(sPath + "/request_date", oRequestDateField.getDateValue());
            oModel.setProperty(sPath + "/request_state", oRequestStateField.getSelectedKey());
        
            // 서버에 변경된 데이터를 제출
            oModel.submitChanges({
                success: function () {
                    sap.m.MessageToast.show("데이터가 성공적으로 저장되었습니다.");
                    this._oDialog.close();  // 변경 완료 후 Dialog 닫기
                }.bind(this),
                error: function () {
                    sap.m.MessageToast.show("데이터 저장 중 오류가 발생했습니다.");
                }
            });
        }
        
                        
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "ui5/walkthrough/model/formatter"
], function (Controller, Fragment, formatter) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {
        formatter:formatter,

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this._onDetailRouteMatched, this);
        },

        // 경로가 일치할 때마다 호출되는 메서드0
        _onDetailRouteMatched: function (oEvent) {
            const sRequestPath = decodeURIComponent(oEvent.getParameter("arguments").requestPath);
            const oRequestModel = this.getView().getModel("request");

            // 선택한 항목에 대한 컨텍스트 가져오기
            const oContext = oRequestModel.getContext("/Requests(" + sRequestPath + ")");

            // Dialog에서 사용할 바인딩
            const oDialog = this.getView().getParent()._oDialog;  // 부모 뷰의 Dialog 객체 가져오기
            oDialog.setBindingContext(oContext, "request");  // Dialog에 데이터 바인딩
        },

        // 항목 클릭 시 Dialog 열기
        onPress: function (oEvent) {
            const oItem = oEvent.getSource();

            // Fragment가 로드된 적이 없다면 로드
            if (!this._oDialog) {
                Fragment.load({
                    name: "ui5.walkthrough.view.Detail",  // Fragment 경로
                    controller: this  // 해당 Fragment의 컨트롤러
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog); // 현재 뷰에 종속되게 추가
                    const oBindingContext = oItem.getBindingContext("request");
                    this._oDialog.setBindingContext(oBindingContext, "request");  // Dialog에 데이터 바인딩
                    this._oDialog.open();  // Dialog 열기
                }.bind(this));
            } else {
                // 이미 로드된 Dialog를 재사용
                const oBindingContext = oItem.getBindingContext("request");
                this._oDialog.setBindingContext(oBindingContext, "request");  // Dialog에 데이터 바인딩
                this._oDialog.open();  // Dialog 열기
            }
        },

        // Dialog 닫기 처리
        onClose: function () {
            this._oDialog.close();
        },
        
        onSave: function () {
            const oModel = this.getView().getModel("request");
            const oData = oModel.getData();
            
            // 데이터 저장 로직 구현 (예: 백엔드 호출)
            console.log("저장된 데이터:", oData);
        
            // 사용자 알림
            sap.m.MessageToast.show("데이터가 저장되었습니다.");
        }
    });
});

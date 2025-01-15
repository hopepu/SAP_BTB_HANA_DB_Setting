sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.InvoiceAdd", {
        onInit: function () {
            // 현재 날짜를 DatePicker에 설정
            const oDatePicker = this.getView().byId("requestDate");
            oDatePicker.setDateValue(new Date());
            
        },

        onSave: function () {
            const oView = this.getView();
            const sProduct = oView.byId("requestProduct").getValue();
            const iQuantity = oView.byId("requestQuantity").getValue();
            const sRequestor = oView.byId("requestor").getValue();
            const sRequestReason = oView.byId("requestReason").getValue();
            const oRequestDate = oView.byId("requestDate").getDateValue();
            const sFormattedDate = oRequestDate ? oRequestDate.toISOString().split("T")[0] : null;
            const oNum = oView.byId("requestNum").getValue();
            const oStatus = "B";
        
            // 빈 값 체크
            if (!sProduct || !iQuantity || !sRequestor || !sRequestReason || !sFormattedDate) {
                MessageToast.show("모든 필드를 채워주세요.");
                return;
            }
        
            // OData 모델 가져오기
            const oModel = this.getView().getModel("request");
        
            if (!(oModel instanceof sap.ui.model.odata.v4.ODataModel)) {
                MessageToast.show("OData v4 모델이 아닙니다.");
                return;
            }
        
            // OData v4에서 항목 생성
            const oBinding = oModel.bindList("/Request");
        
            oBinding.create({
                request_product: sProduct,
                request_quantity: iQuantity,
                requestor: sRequestor,
                request_reason: sRequestReason,
                request_date: sFormattedDate,
                request_number: oNum,
                request_state: oStatus                           
            });

            MessageToast.show("신청이 완료되었습니다.");

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Overview"); // 상태 초기화를 위한 강제 리렌더링
        },

        onCancel: function () {
            // 메인 페이지로 이동
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Overview");
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"   
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.HelloPanel", {
        onShowHello: function () {
            // i18n 모델에서 리소스 번들을 가져옵니다.
            this.getView().getModel("i18n").getResourceBundle().then(oBundle => {
                console.log(oBundle);  // oBundle이 제대로 로드되었는지 확인
        
                // i18n 메시지 가져오기
                const sRecipient = this.getView().getModel().getProperty("/recipient/name");
                console.log(sRecipient);  // sRecipient 값이 제대로 가져와졌는지 확인
        
                const sMsg = oBundle.getText("helloMsg", [sRecipient]);
                console.log(sMsg);  // sMsg가 제대로 출력되는지 확인
        
                // 메시지 출력
                MessageToast.show(sMsg);
            }).catch(error => {
                console.error("Error loading i18n bundle:", error);
            });
        },

        onOpenDialog: async function () {
           // oDialog가 이미 존재하지 않으면 다이얼로그를 비동기적으로 로드
            if (!this.oDialog) {
            this.oDialog = await this.loadFragment({
                name: "ui5.walkthrough.view.HelloDialog"
                });
            }
            this.oDialog.open();  // 다이얼로그 열기
        },

        onCloseDialog: function () {
            this.byId("helloDialog").close();
        }
        
    });
});


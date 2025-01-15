sap.ui.define([], function() {
    "use strict";
  
    return {
      statusText: function(sStatus) {
        const oModel = this.getOwnerComponent().getModel("i18n");
        
        // 비동기적으로 리소스 번들 로딩
        return oModel.getResourceBundle().then(function(oResourceBundle) {
          switch (sStatus) {
            case "A":
              return oResourceBundle.getText("반려");
            case "B":
              return oResourceBundle.getText("신청 중");
            case "C":
              return oResourceBundle.getText("구매 진행 중");
            case "D":
              return oResourceBundle.getText("구매 완료");
            default:
              return sStatus;
          }
        }).catch(function(error) {
          console.error("Error loading resource bundle:", error);
          return sStatus;  // 오류 발생 시 기본 값 반환
        });
      }
    };
  });
  
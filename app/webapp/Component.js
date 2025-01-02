// sap.ui.define([
//     "sap/ui/core/UIComponent",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/resource/ResourceModel"
// ], (UIComponent, JSONModel, ResourceModel) => {
//     "use strict";

//     return UIComponent.extend("ui5.walkthrough.Component", {
//         metadata : {
//             "interfaces":["sap.ui.core.IAsyncContentCreation"],
//             "rootView": {
//                 "viewName":"ui5.walkthrough.view.App",
//                 "type":"XML",
//                 "id":"app"
//             }
//         },
//         // metadata section 
//         // 1. rootView에 대한 참조를 정의
//         // 2. 앱 뷰의 표시를 관리
//         // 3. 구성 요소를 완전히 비동기적으로 생성할 수 있는 인터페이스

//         init() {
//             UIComponent.prototype.init.apply(this, arguments);

//             const oData = {
//                 recipient : {
//                     name : "World"
//                 }
//             };

//             const i18nModel = new ResourceModel({
//                 bundleName:"ui5.walkthrough.i18n.i18n",
//                 async:true //비동기 설정
//             });
//             this.setModel(i18nModel, "i18n");
//         }
//         // init section
//         // 1. 인스턴스화시 SAPUI5에 의해 자동으로 호출
//         // 2. 구성요소는 기본 클래스에서 상속, 오버라이드된 메서드에서 호출을 실행
//     })
// })

//step10 Descriptor for Applications
// sap.ui.define([
//     "sap/ui/core/UIComponent",
//     "sap/ui/model/json/JSONModel"
// ], (UIComponent, JSONModel) => {
//     "use strict";

//     return UIComponent.extend("ui5.walkthrough.Component", {
//         metadata : {
//             interface:["sap.ui.core.IAsyncContentCreation"],
//             manifest:"json"
//         },

//         init(){
//              UIComponent.prototype.init.apply(this, arguments);

//             const oData = {
//                 recipient : {
//                     name : "World"
//                 }
//             };

//             const oModel = new JSONModel(oData);
//             this.setModel(oModel);          

//             this.getRouter().initialize();
            
//         }
//     });
// });

//step 35 device adaptation
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], (UIComponent, JSONModel, Device) => {
    "use strict";

    return UIComponent.extend("ui5.walkthrough.Component", {
        metadata : {
            interface:["sap.ui.core.IAsyncContentCreation"],
            manifest:"json"
        },

        init(){
             UIComponent.prototype.init.apply(this, arguments);

            const oData = {
                recipient : {
                    name : "World"
                }
            };

            const oModel = new JSONModel(oData);
            this.setModel(oModel);        
            
            const oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

            this.getRouter().initialize();
            
        },

        getContentDensityClass() {
			return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
		}
    });
});
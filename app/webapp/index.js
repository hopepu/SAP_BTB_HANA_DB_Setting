// sap.ui.define([], () => {
//     "use strict";
//     alert("UI5 is ready");
// })

// sap.ui.define([
//     "sap/m/Text"
// ], (Text) => {
//     "use strict";

//     new Text({
//         text: "Hello World"
//     }).placeAt("content");
// });

//XMLView
// sap.ui.define([
//     "sap/ui/core/mvc/XMLView"
//     // XMLnamespace : sap.ui.core.mvc 사용
// ], (XMLView) => {
//     "use strict";
//     XMLView.create({
//         viewName: "ui5.walkthrough.view.App"
//     }).then((oView) => oView.placeAt("content"));
// });

// 9step UI5 Component loading
sap.ui.define([
    "sap/ui/core/ComponentContainer"
], (ComponentContainer) => {
    "use strict";

    new ComponentContainer({
        name:"ui5.walkthrough",
        settings : {
            id:"walkthrough"
        },
        async:true
    }).placeAt("content");
});
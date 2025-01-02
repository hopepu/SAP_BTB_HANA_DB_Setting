sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"

], (Controller, History, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.Detail", {
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");

			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			this.byId("rating").reset(); 
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
				model: "invoice"
			});
		},

		onNavBack() {
			const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("overview", {}, true);
			}
		},

		onRatingChange(oEvent) {
			console.log("oEvent: ", oEvent);
		
			const fValue = oEvent.getParameter("value");
			console.log("fValue: " + fValue);
		
			
			const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		
			// 만약 oResourceBundle이 Promise인 경우 비동기적으로 처리
			if (oResourceBundle instanceof Promise) {
				oResourceBundle.then(function(bundle) {
					// 번들이 로드된 후에 getText() 호출
					MessageToast.show(bundle.getText("ratingConfirmation", [fValue]));
				}).catch(function(error) {
					console.error("Error loading resource bundle: ", error);
				});
			} else {
				// 만약 바로 사용할 수 있는 경우
				MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
			}
		}
		
	});
});
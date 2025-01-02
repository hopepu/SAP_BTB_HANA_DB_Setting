sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},

		onFilterInvoices(oEvent) {
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			const oList = this.byId("InvoiceList");
			if (oList) {
				const oBinding = oList.getBinding("items");
				if (oBinding) {
					oBinding.filter(aFilter);
				} else {
					console.error("Binding not found.");
				}
			} else {
				console.error("List control not found.");
			}
		},

		onPress(oEvent){
			const oItem = oEvent.getSource();
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail", {
				invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1))
			});
		}
	});
});
//데이터 모델에 속하지 앟는 통화 코드에 엑세스 하기 위해 뷰 모델의 정의가 필요
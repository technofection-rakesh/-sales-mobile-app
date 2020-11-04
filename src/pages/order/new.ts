import { Component } from '@angular/core';
import { ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { WS } from '../../app/app.services';

import { OrderItem } from '../../app/app.models';

import { CustomerSelectionPage } from './customer-selection';
import { ProductSelectionPage } from './product-selection';

@Component({
  selector: 'new-order-page',
  templateUrl: 'new.html'
})


export class NewOrderPage {
	private _CustomerId: number;
	public CustomerName: string;
	public OrderItems: Array<OrderItem>;
	public OrderTotal: number;
	public Products : Array <any>; 
	public ProductID:number=0;
	public Quantity:number;
	public Price:number=0;
	public MinPrice:number=0;
	public Tax:number = 0;
	public ProductName : string;
	
	constructor(public viewCtrl: ViewController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, public alertCtrl:AlertController, public ws: WS) {
		this._CustomerId = 0;
		this.OrderItems = [];
		this.OrderTotal = 0;
		this.CustomerName = "";
		this.ProductName = "";
	}
	
	ionViewDidEnter(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetProductList().subscribe(
			(data) => {
				loader.dismiss();
				this.Products = data;
				console.log(this.Products);
			},
			(error) => {
				loader.dismiss();
				//TODO: Error handling
				console.log(error);
			}
		);
	}
	
	private _error(message:string){
		let alert = this.alertCtrl.create({
			title: 'Error',
			subTitle: message,
			buttons: ['Dismiss']
		});
		alert.present();
	}
	
	public createOrder(){
		if(this._validateForm()){
			let loader = this.loadingCtrl.create({
				content: "Please wait..."
			});
			loader.present();
			this.ws.InsertOrder(this.OrderItems, this._CustomerId).subscribe(
				(result) => {
					loader.dismiss();
					if(result === true){
						let alert = this.alertCtrl.create({
							title: 'Success',
							subTitle: 'Order has been submitted successfully',
							buttons: [
								{
									text: "OK",
									handler: (function(_self){
										return function(){
											_self.dismiss(true);
										}
									})(this)
								}
							]
						});
						alert.present();
					} else {
						this._error("There was an error processing your request. You can try after sometime. If the problem persists then contact support.");
					}				
				},
				(error) => {
					console.log(error);
					loader.dismiss();
					this._error('There was an error communicating with the server. You can try after sometime. If the problem persists then contact support.');
				}
			);
		}
	}
	
	openCustomerSelectionModal(){
		console.log('openCustomerSelectionModal');
		let customerSelectionModal = this.modalCtrl.create(CustomerSelectionPage);
		customerSelectionModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("CustomerId")){
					this._CustomerId = data.CustomerId;
					this.CustomerName = data.CustomerName;
				}
			}
		});
		customerSelectionModal.present();
	}
	
	openProductSelectionModal(){
		console.log('openProductSelectionModal');
		let productSelectionModal = this.modalCtrl.create(ProductSelectionPage);
		productSelectionModal.onDidDismiss(data => {
			console.log(data);
			if(data){
				if(data.hasOwnProperty("ProductID")){
					this.Price = data.Price;
					this.MinPrice = data.MinPrice;
					this.ProductID = data.ProductID;
					this.Tax = data.Tax;
					this.ProductName = data.ProductName;
					this.Quantity=null;
				}
			}
		});
		productSelectionModal.present();
	}
	
	public onSelectProduct(selectedProduct){	
		var SelectedProductId = selectedProduct.value["ID"];
		var i;
		for(i=0; i<this.Products.length; i++){
			if(this.Products[i]["ID"] == SelectedProductId){
				this.Price = this.Products[i]["Price"];
				this.Quantity=null;
				this.MinPrice=this.Products[i]["MinPrice"];
				break;
			}
		}
	}
	
	public deleteItem(index){
		let alert = this.alertCtrl.create({
			title: 'Confirmation',
			subTitle: 'Do you really want to delete this item?',
			buttons: [
				{
					text: "OK",
					handler: (function(_self, _i){
						return function(){
							_self.OrderTotal-=(_self.OrderItems[_i].Price*_self.OrderItems[_i].Quantity)+(_self.OrderItems[_i].Price*(_self.OrderItems[_i].Quantity*_self.OrderItems[_i].Tax)/100)
							_self.OrderItems.splice(_i, 1);
						}
					})(this, index)
				},
				{
					text: "Cancel",
					role: "cancel"
				}
			]
		});
		alert.present();
	}
	
	public addItem(){
		if(this.ProductID==0){
			this._error('Please select a item.');
		} else if(this.Quantity==0 || this.Quantity==null){
			this._error('Quantity needs to be at least 1');
		} else if(this.Price==0){
			this._error('Please enter a valid price');
		}else if(this.Price<this.MinPrice){
			this._error('The price should not the less than the minimum price Rs. '+ this.MinPrice);
			this.Price=this.MinPrice;
		}
		else{
			// check if item already exists in order
			console.log(this.OrderItems);
			for(var k=0; k<this.OrderItems.length;k++){
				if(this.OrderItems[k].ProductID==this.ProductID){
					this._error('This item already exits in order');
					return;
				}
			}
			/*
			for (var i = 0; i < this.Products.length; i++) {
						
				var product = this.Products[i];

				if (product.ID == this.ProductID) {
					var _orderItem = new OrderItem();
					_orderItem.ProductID = product.ID;
					_orderItem.ProductName = product.ProductName;
					_orderItem.Price = +this.Price;
					_orderItem.Tax = product.Tax;
					_orderItem.Quantity = +this.Quantity;
						
					this.OrderItems.push(_orderItem);
					this.OrderTotal+=(_orderItem.Price * _orderItem.Quantity)+(_orderItem.Price * (_orderItem.Quantity*product.Tax)/100);
					break;
				}
			}
			*/
			
			var _orderItem = new OrderItem();
			_orderItem.ProductID = this.ProductID;
			_orderItem.ProductName = this.ProductName;
			_orderItem.Price = +this.Price;
			_orderItem.Tax = this.Tax;
			_orderItem.Quantity = +this.Quantity;
				
			this.OrderItems.push(_orderItem);
			this.OrderTotal+=(_orderItem.Price * _orderItem.Quantity)+(_orderItem.Price * (_orderItem.Quantity*_orderItem.Tax)/100);
		}
	}
	
	private _validateForm(){
		if(this._CustomerId == 0){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please select customer',
				buttons: [
					{
						text: "OK",
						role: "cancel"
					}
				]
			});
			alert.present();
			return false;
		} else if(this.OrderItems.length == 0) {
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'At least one item needs to be added into the order',
				buttons: [
					{
						text: "OK",
						role: "cancel"
					}
				]
			});
			alert.present();
			return false;
		}
		
		return true;
	}
	
	public dismiss(success:boolean = false){
		this.viewCtrl.dismiss({success: success});
	}
		
}
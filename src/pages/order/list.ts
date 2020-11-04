import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { WS } from '../../app/app.services';

import { OrderDetailsPage } from './details';
import { NewOrderPage } from './new';

@Component({
  selector: 'order-list-page',
  templateUrl: 'list.html'
})

export class OrderListPage {
	OrderList: Array<any>;
	
	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, public ws: WS) {
		this.OrderList = [];
	}

	ionViewDidEnter(){
		this._loadMyOrders();
	}
	
	reloadOrders(refresher){
		this._loadMyOrders(refresher);
	}
	
	private _loadMyOrders(refresher:any = null){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetOrders().subscribe(
			(data) => {
				loader.dismiss();
				if(refresher) refresher.complete();
				this.OrderList = data;
			},
			(error) => {
				loader.dismiss();
				console.log(error);
				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: 'There was an error communicating with the server. You can try after sometime. If the problem persists then contact support.',
					buttons: ['Dismiss']
				});
				alert.present();
			}
		);
	}
	
	showOrderDetails(Order){
		let OrderDetailsModal = this.modalCtrl.create(OrderDetailsPage, {OrderId: Order.ID});
		OrderDetailsModal.present();
	}
	
	openCreateOrderModal(){
		let newOrderModal = this.modalCtrl.create(NewOrderPage);
		newOrderModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						this._loadMyOrders();
					}
				}
			}
		});
		newOrderModal.present();
	}
}

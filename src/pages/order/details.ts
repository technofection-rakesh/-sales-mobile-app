import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { WS } from '../../app/app.services';

@Component({
  selector: 'order-details-page',
  templateUrl: 'details.html'
})

export class OrderDetailsPage {
	private _OrderId: number;
	Order:any = {};
	
	constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl:AlertController, public navParams: NavParams, public ws: WS) {
		this._OrderId = navParams.get("OrderId");
		this.Order["OrderItems"] = [];
	}
	
	ionViewDidEnter(){
		this._loadOrderDetails();
	}
	
	dismiss(){
		this.viewCtrl.dismiss();
	}
	
	private _loadOrderDetails(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetOrderDetails(this._OrderId).subscribe(
			(data) => {
				loader.dismiss();
				this.Order = data;
				console.log(this.Order);
			},
			(error) => {
				console.log(error);
				loader.dismiss();
				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: 'There was an error communicating with the server. You can try after sometime. If the problem persists then contact support.',
					buttons: ['Dismiss']
				});
				alert.present();
			}
		);
	}
	
}
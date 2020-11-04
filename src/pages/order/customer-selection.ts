import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';

import { WS } from '../../app/app.services';

@Component({
  selector: 'customer-selection-page',
  templateUrl: 'customer-selection.html'
})

export class CustomerSelectionPage {
	customers: Array<{}>;
	searchText: string = '';

	constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public ws: WS) {
		this.customers = [];
	}

	ionViewDidEnter(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetCustomerList().subscribe(
			(data) => {
				loader.dismiss();
				this.customers = data;
			},
			(error) => {
				loader.dismiss();
				console.log(error);
			}
		);
	}

	public selectCustomer(customer){
		this.viewCtrl.dismiss({CustomerId: customer.ID, CustomerName: customer.CompanyName});
	}
	
	public dismiss(){
		this.viewCtrl.dismiss();
	}
}

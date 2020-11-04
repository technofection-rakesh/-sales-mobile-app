import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { CustomerAddPage } from './add';
import { CustomerDetailsPage } from './details';

import { WS } from '../../app/app.services';

@Component({
  selector: 'customer-list-page',
  templateUrl: 'list.html'
})

export class CustomerListPage {
	customers: Array<{}>;
	searchText: string = '';

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public ws: WS) {
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

	openCustomerAddModal(){
		let customerAddModal = this.modalCtrl.create(CustomerAddPage);
		customerAddModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						let loader = this.loadingCtrl.create({
							content: "Please wait..."
						});
						loader.present();
						this.ws.GetCustomerList(true).subscribe(
							(data) => {
								loader.dismiss();
								this.customers = data;
							},
							(error) => {
								loader.dismiss();
								//TODO: Handle error
								console.log(error);
							}
						);
					}
				}
			}
		});
		customerAddModal.present();
	}

	itemTapped(customer){
		this.navCtrl.push(CustomerDetailsPage, {customer: customer});
	}
}

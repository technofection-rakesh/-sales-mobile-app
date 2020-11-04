import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { WS } from '../../app/app.services';
import "rxjs/add/operator/map";

import { AllowanceAddPage } from './add';

@Component({
  selector: 'allowance-list-page',
  templateUrl: 'list.html'
})

export class AllowanceListPage {
	AllowanceList: Array<any>;
	
	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, public ws: WS) {
		this.AllowanceList = [];
	}

	ionViewDidEnter(){
		this._loadAllowances();
	}
	
	private _loadAllowances(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetAllowanceList().map((response) => {
			 response.map(claim => {			  
				 claim['StatusIcon'] = claim.ClaimStatus == 0 ? "timer" : (claim.ClaimStatus == 1 ? "checkmark-circle" : (claim.ClaimStatus == 2 ? "close-circle" : "warning"));
				 claim['StatusIconColor'] = claim.ClaimStatus == 0 ? "warning" : (claim.ClaimStatus == 1 ? "secondary" : (claim.ClaimStatus == 2 ? "danger" : "danger"));
				 return claim;
			 });
			 return response;
		}).subscribe(
			(data) => {
				loader.dismiss();
				this.AllowanceList = data;
				console.log(data);
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

	openAllowanceClaimModal(){
		let allowanceClaimModal = this.modalCtrl.create(AllowanceAddPage);
		allowanceClaimModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						this._loadAllowances();
					}
				}
			}
		});
		allowanceClaimModal.present();
	}
}

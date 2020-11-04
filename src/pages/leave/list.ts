import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { WS } from '../../app/app.services';
import 'rxjs/add/operator/map';


import { LeaveRequestPage } from './request';

@Component({
  selector: 'leave-list-page',
  templateUrl: 'list.html'
})

export class LeaveListPage {
	LeaveList: Array<any>;
	Math: any;
	
	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, public ws: WS) {
		this.LeaveList = [];
		this.Math = Math;
	}

	ionViewDidEnter(){
		this._loadLeaves();
	}
	
	private _loadLeaves(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetLeaves().map((response) => {
			 response.map(leave => {			  
				 leave['StatusIcon'] = leave.Status == 0 ? "timer" : (leave.Status == 1 ? "checkmark-circle" : (leave.Status == 2 ? "close-circle" : "warning"));
				 leave['StatusIconColor'] = leave.Status == 0 ? "warning" : (leave.Status == 1 ? "secondary" : (leave.Status == 2 ? "danger" : "danger"));
				 return leave;
			 });
			 return response;
		}).subscribe(
			(data) => {
				loader.dismiss();
				this.LeaveList = data;
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

	openLeaveRequestModal(){
		let leaveRequestModal = this.modalCtrl.create(LeaveRequestPage);
		leaveRequestModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						this._loadLeaves();
					}
				}
			}
		});
		leaveRequestModal.present();
	}
}

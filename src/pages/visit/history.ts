import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { MeetingTimerPage } from './meeting-timer';

import { WS } from '../../app/app.services';

@Component({
  selector: 'visit-history-page',
  templateUrl: 'history.html'
})
export class VisitHistoryPage {
  private _CustomerId:number;
  visitHistory: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController, public alertCtrl:AlertController, public modalCtrl: ModalController, private ws: WS) {
    this._CustomerId = navParams.get("CustomerId");
  }
  
  ionViewDidEnter(){
	let loader = this.loadingCtrl.create({
		content: "Please wait..."
	});
	loader.present();
	this.ws.GetVisitHistory(this._CustomerId).subscribe(
		(data) => {
			loader.dismiss();
			this.visitHistory = data;
		},
		(error) => {
			loader.dismiss();
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'There was an error processing your request. You can try after sometime. If the problem persists then contact support',
				buttons: ['Dismiss']
			});
			alert.present();
		}
	);
  }
  
  openVisitAddModal(){
	let meetingTimerModal = this.modalCtrl.create(MeetingTimerPage, {CustomerId: this._CustomerId});
	meetingTimerModal.onDidDismiss(data => {
		if(data){
			if(data.hasOwnProperty("success")){
				if(data.success === true){
					let loader = this.loadingCtrl.create({
						content: "Please wait..."
					});
					loader.present();
					this.ws.GetVisitHistory(this._CustomerId).subscribe(
						(data) => {
							loader.dismiss();
							this.visitHistory = data;
						},
						(error) => {
							loader.dismiss();
							//TODO: Handle error
							console.error(error);
						}
					);
				}
			}
		}
	});
	meetingTimerModal.present();
  }
}

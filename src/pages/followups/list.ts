import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { MeetingTimerPage } from '../visit/meeting-timer';

import { WS } from '../../app/app.services';

@Component({
  selector: 'followup-list-page',
  templateUrl: 'list.html'
})
export class FollowupListPage {
	Followups: Array<any>;

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private ws:WS) {
		
	}
	
	ionViewDidEnter(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetFollowupList().subscribe(
			(data) => {
				loader.dismiss();
				this.Followups = data;
				console.log(this.Followups);
			},
			(error) => {
				loader.dismiss();
				//TODO: Error handling
				console.log(error);
			}
		);
	}
	
   
	itemTapped(event, item){
		let MeetingTimerPageModal = this.modalCtrl.create(MeetingTimerPage, {CustomerId: item.CustomerID, FollowupId: item.ID});
		MeetingTimerPageModal.onDidDismiss(data => {
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						let loader = this.loadingCtrl.create({
							content: "Please wait..."
						});
						loader.present();
						this.ws.GetFollowupList().subscribe(
							(data) => {
								loader.dismiss();
								this.Followups = data;
								console.log(this.Followups);
							},
							(error) => {
								loader.dismiss();
								//TODO: Error handling
								console.log(error);
							}
						);
					}
				}
			}
		});
		MeetingTimerPageModal.present();
	}
}

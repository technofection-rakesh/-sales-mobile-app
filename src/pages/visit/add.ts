import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { StrPadPipe } from '../../app/strpad.pipe';

import { WS } from '../../app/app.services';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'visit-add-page',
  templateUrl: 'add.html',
  providers: [StrPadPipe]
})

export class VisitAddPage {
	CustomerId: number;
	StartTime: any;
	EndTime: any;
	VisitDate: string;
	FollowupDate: string;
	Remarks: string;
	VisitType: number;
	Latitude:number = 0;
	Longitude: number = 0;
	FollowupId: number = 0;
	VisitTypeList: Array<any>;
	
	

	
	constructor(public viewCtrl: ViewController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public padPipe: StrPadPipe, public ws: WS) {
		this.Remarks = "";
		let today = new Date();
		this.CustomerId = this.navParams.get("CustomerId");
		this.StartTime = this.navParams.get("StartTime");
		this.EndTime = this.navParams.get("EndTime");
		this.FollowupId = this.navParams.get("FollowupId");
		this.Longitude = this.navParams.get("Longitude");
		this.Latitude = this.navParams.get("Latitude");
		this.FollowupId = (typeof this.FollowupId) == "undefined" ? 0 : this.FollowupId;
		this.VisitDate = today.getFullYear() + "-" + this.padPipe.transform((today.getMonth()+1).toString(), 2) + "-" + this.padPipe.transform(today.getDate().toString(), 2); 
		
		console.log(this.Longitude + " : " + this.Longitude);
	}
	
	ionViewDidEnter(){
		this.ws.GetPurposeList().subscribe(
			(data) => {
				this.VisitTypeList = data;
			}
		);
	}
	
	

	dismiss(){
		this.viewCtrl.dismiss();
	}
	
	validateForm():boolean{
		if(this.Remarks == ''){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please write a short remark on the visit, so that it can be re-called later.',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		return true;
	}
	
	saveVisitLog(){
		if(this.validateForm()){
			let loader = this.loadingCtrl.create({
				content: "Please wait..."
			});
			loader.present();
			this.ws.LogVisit({
				CustomerID: this.CustomerId,
				Purpose: this.VisitType,
				MeetingStartTime: this.StartTime.getTime(),
				MeetingEndTime: this.EndTime.getTime(),
				FollowupId: this.FollowupId,
				Latitude: this.Latitude,
				Longitude: this.Longitude,
				VisitDate: new Date(this.VisitDate).getTime(),
				NextVisitDate: this.FollowupDate ? new Date(this.FollowupDate).getTime() : 0,
				Remarks: this.Remarks 
			}).subscribe(
				(ret) => {
					loader.dismiss();
					if(ret){
						let alert = this.alertCtrl.create({
							title: 'Success',
							subTitle: 'The information has been saved successfully',
							buttons: [{
								text: 'OK', 
								handler: () => {
									this.viewCtrl.dismiss({success: true});
								}
							}]
						});
						alert.present();
					} else {
						let alert = this.alertCtrl.create({
							title: 'Error',
							subTitle: 'There was an error processing your request. You can try after sometime. If the problem persists then contact support',
							buttons: ['Dismiss']
						});
						alert.present();
					}
				},
				(error) => {
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
}

import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { WS } from '../../app/app.services';

@Component({
  selector: 'allowance-add-page',
  templateUrl: 'add.html'
})

export class AllowanceAddPage {
	AllowanceTypes: Array<any>;
	Form: any;
	
	constructor(public viewCtrl: ViewController, public navParams: NavParams, private alertCtrl: AlertController,  public loadingCtrl: LoadingController, private ws: WS) {
		this.Form = {};
	}
	
	ionViewDidEnter(){
		this.clearForm();
		this.ws.GetAllowanceTypes().subscribe(
			(response) => {
				this.AllowanceTypes = response;
			},
			error => {
				//TODO: Error handling
				console.log(error);
			}
		);
	}
	
	clearForm(){
		this.Form["AllowanceTypeID"] = 0;
		this.Form["Amount"] = "";
		this.Form["Note"] = "";
	}

	dismiss(){
		this.viewCtrl.dismiss();
	}
	
	submit(){
		if(this.validateForm()){
			let loader = this.loadingCtrl.create({
				content: "Please wait..."
			});
			loader.present();
			this.Form["ID"] = 0;
			this.ws.ClaimAllowance(this.Form).subscribe(
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
						subTitle: 'There was an error communicating with the server. You can try after sometime. If the problem persists then contact support',
						buttons: ['Dismiss']
					});
					alert.present();
				}
			);
			
		}
	}
	
	validateForm(){
		if(this.Form.AllowanceTypeID == ''){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please select allowance type',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		if(this.Form.Amount == ''){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please enter allowance amount',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		if(this.Form.Amount == 0){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Allowance amount should be greater than 0',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		return true;
	}
}

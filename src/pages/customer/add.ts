import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { WS } from '../../app/app.services';

@Component({
  selector: 'customer-add-page',
  templateUrl: 'add.html'
})

export class CustomerAddPage {
	StateList: Array<any>;
	Form: any;
	customer:any;
	buttonText:string="Save";
	title:string="Add Customer";
	OffDays = {
				Monday : true,
				Tuesday : true,
				Wednesday : true,
				Thursday : true,
				Friday : true,
				Saturday : true,
				Sunday : true
			}
	
	constructor(public viewCtrl: ViewController, public navParams: NavParams, private alertCtrl: AlertController,  public loadingCtrl: LoadingController, private ws: WS) {
		this.Form = {};
		this.customer = navParams.get("customer");
		if(this.customer!=undefined){
			this.Form=this.customer;
			this.title="Edit Customer";
			this.buttonText="Update";
			var OffDays=this.customer.OffDays.padStart(7, '0');
			this.OffDays.Monday=this._getBool(OffDays.substring(0, 1));
			this.OffDays.Tuesday=this._getBool(OffDays.substring(1, 2));
			this.OffDays.Wednesday=this._getBool(OffDays.substring(2, 3));
			this.OffDays.Thursday=this._getBool(OffDays.substring(3, 4));
			this.OffDays.Friday=this._getBool(OffDays.substring(4, 5));
			this.OffDays.Saturday=this._getBool(OffDays.substring(5,6));
			this.OffDays.Sunday=this._getBool(OffDays.substring(6,7));
		}
	}

	private _getBool(val) {
		return !!JSON.parse(String(val).toLowerCase());
	}
	
	ionViewDidEnter(){
		if(this.customer==undefined){
			this.clearForm();
		}

		this.ws.GetStateList().subscribe(
			stateList => {
				this.StateList = stateList;
			},
			error => {
				//TODO: Error handling
				console.log(error);
			}
		);
	}
	
	clearForm(){
		this.title="Add Customer";
		this.buttonText="Save";
		this.Form["StateID"] = 0;
		this.Form["CompanyName"] = "";
		this.Form["Address"] = "";
		this.Form["City"] = "";
		this.Form["PinCode"] = "";
		this.Form["Name"] = "";
		this.Form["PhoneNo"] = "";
		this.Form["AlternatePhoneNo"] = "";
		this.Form["EmailID"] = "";
		this.Form["Landmark"] ="";
		this.Form["GST"] = "";
		this.Form["OffDays"]="";
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
			if(this.Form["ID"]==undefined || this.Form["ID"]==null){
				this.Form["ID"] = 0;
			}
			
			this.Form["OffDays"]= this.boolToString(this.OffDays.Monday)+ this.boolToString(this.OffDays.Tuesday)+ this.boolToString(this.OffDays.Wednesday)+ this.boolToString(this.OffDays.Thursday)+ this.boolToString(this.OffDays.Friday)+ this.boolToString(this.OffDays.Saturday)+ this.boolToString(this.OffDays.Sunday);
			this.ws.CreateCustomer(this.Form).subscribe(
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
		if(this.Form.CompanyName == ''){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please enter company name',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		return true;
	}
	boolToString(value:boolean){
		if(value==true){
			return "1";
		}
		else{
			return "0";
		}
	}
}

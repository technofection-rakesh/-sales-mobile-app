import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { StrPadPipe } from '../../app/strpad.pipe';
import { WS } from '../../app/app.services';

@Component({
  selector: 'leave-request-page',
  templateUrl: 'request.html',
  providers: [StrPadPipe]
})

export class LeaveRequestPage {
	AllowanceTypes: Array<any>;
	Form: any;
	
	constructor(public viewCtrl: ViewController, public navParams: NavParams, private alertCtrl: AlertController,  public loadingCtrl: LoadingController, private ws: WS, public padPipe: StrPadPipe) {
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
		var today = new Date();
		var tomorrow = new Date(today.getTime() + (60 * 60 * 24 * 1000));
		this.Form["ID"] = 0;
		this.Form["FromDate"] = today.getFullYear() + "-" + this.padPipe.transform((today.getMonth()+1).toString(), 2) + "-" + this.padPipe.transform(today.getDate().toString(), 2); 
		this.Form["ToDate"] = tomorrow.getFullYear() + "-" + this.padPipe.transform((tomorrow.getMonth()+1).toString(), 2) + "-" + this.padPipe.transform(tomorrow.getDate().toString(), 2); 
		this.Form["Note"] = "";
	}

	dismiss(){
		this.viewCtrl.dismiss();
	}
	
	submit(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		var data: any = {
			ID: this.Form.ID, 
			Note: this.Form.Note, 
			FromDate: new Date(this.Form.FromDate + " 0:0:0 AM GMT").getTime(), 
			ToDate: new Date(this.Form.ToDate + " 11:59:59 PM GMT").getTime()
		};
		this.ws.RequestLeave(data).subscribe(
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

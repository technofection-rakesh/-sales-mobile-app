import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { WS } from '../../app/app.services';

import { CustomerListPage } from '../customer/list';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	Username : string = '';
	Password : string = '';
	loader:any=null;
	
	constructor(public navCtrl: NavController, 
		private alertCtrl: AlertController, 
		private ws: WS,
		private loadingCtrl: LoadingController,
		private androidPermissions: AndroidPermissions,
	) { }

	ionViewDidEnter(){
	}
	
	login(){
		if(this.validateForm()){
			let loader = this.loadingCtrl.create({
				content: "Please wait..."
			});
			loader.present();
			this.ws.Login(this.Username, this.Password).subscribe(
				(ret) => {
					loader.dismiss();
					if(ret){
						this.goToCustomerList();

						/*if(this.ws.TrackingInterval>0){   // if trackingInterval >0
							this._checkPermission(); 
						}
						else{	
							this.goToCustomerList();
						}*/
						
					} else {
						let alert = this.alertCtrl.create({
							title: 'Error',
							subTitle: 'Invalid Username or Password. Try again.',
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

	goToCustomerList(){
				
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();

		this.ws.GetPurposeList().subscribe(
			(data) => {
				loader.dismiss();
				this.navCtrl.setRoot(CustomerListPage);		
			},
			(error) => {
				loader.dismiss();
				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: 'There was an error processing your request. You can try after sometime. If the problem persists then contact support.',
					buttons: ['Dismiss']
				});
				alert.present();
			}
		);
	}
	
	validateForm(){
		if(this.Username == '' || this.Password == ''){
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please enter your username and password',
				buttons: ['Dismiss']
			});
			alert.present();
			return false;
		}
		return true;
	}

	private _checkPermission(){

		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();

		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION).then(
			(result) => {
				if(!result.hasPermission){
					console.log("Location permission is not granted");
					this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.LOCATION]).then(
						(success) => {
							console.log("LOCATION permission granted");
							this.loader.dismiss();
							this.goToCustomerList();
						},
						(failure) => {
							console.log("LOCATION permission is not granted");
							let alert = this.alertCtrl.create({
								title: 'Location Error',
								subTitle: 'You must grant access to Location Service.',
								buttons: [{
									text: 'OK'
								}]
							});
							alert.present();
							this.loader.dismiss();
						}
					);
				} else {
					console.log("Location permission is already granted.");
					this.loader.dismiss();
					this.goToCustomerList();
				}
			},
			(err) => {
				console.log("Error while checking LOCATION permission"+JSON.stringify(err));
				let alert = this.alertCtrl.create({
					title: 'Location Error',
					subTitle: 'We could not retreive your location information.',
					buttons: [{
						text: 'OK'
					}]
				});
				this.loader.dismiss();
				alert.present();
			}
		);
	}
}

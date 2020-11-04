import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ViewController,LoadingController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { CustomerListPage } from '../../pages/customer/list';
import moment from 'moment';
import { WS } from '../../app/app.services';

@Component({
  selector: 'attendance-page',
  templateUrl: 'attendance.html'
})

export class AttendancePage {
	private _CustomerId:number;
	private _Latitude: number;
	private _Longitude: number;
	public currentDateTime:string=moment.utc(new Date()).add(330,'minute').format('lll');
	
	public IsGPSGood: boolean;
	
	private _geolocationWatcher;
	loader:any=null;

	constructor(
		public viewCtrl: ViewController, 
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public alertCtrl:AlertController, 
		public modalCtrl: ModalController,
		public geolocation: Geolocation, 
		public loadingCtrl: LoadingController,
		public locationAccuracy: LocationAccuracy,
		private androidPermissions: AndroidPermissions,
		public ws: WS) 
		{		
		this._geolocationWatcher = null;
		this._CustomerId = navParams.get("CustomerId");
		
		this._Latitude = 0;
		this._Longitude = 0;
		this.IsGPSGood = false;
	}
	
	ionViewDidEnter(){

		this._checkPermission();
	}
	
	private _checkPermission(){

		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION).then(
			(result) => {
				if(!result.hasPermission){
					console.log("Location permission is not turned on");
					this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.LOCATION]).then(
						(success) => {
							console.log("LOCATION permission granted");
							//this._requestLocation();
							this.getLocation();
						},
						(failure) => {
							console.log("Error while requesting LOCATION permission");
							let alert = this.alertCtrl.create({
								title: 'Location Error',
								subTitle: 'You must grant access to Location Service.',
								buttons: [{
									text: 'OK', 
									handler: () => {
										this.viewCtrl.dismiss({success: true});
									}
								}]
							});
							alert.present();
							this.loader.dismiss();
						}
					);
				} else {
					console.log("Location permission is authorized. Going to capture location.");
					//this._requestLocation();
					this.getLocation();
				}
			},
			(err) => {
				console.log("Error while checking LOCATION permission"+JSON.stringify(err));
				let alert = this.alertCtrl.create({
					title: 'Location Error',
					subTitle: 'You must grant access to Location Service.',
					buttons: [{
						text: 'OK', 
						handler: () => {
							this.viewCtrl.dismiss({success: true});
						}
					}]
				});
				this.loader.dismiss();
				alert.present();
			}
		);
	}
	
	/*private _requestLocation(){
		this.locationAccuracy.canRequest().then((canRequest: boolean) => {
			if(canRequest) {
				// the accuracy option will be ignored by iOS
				this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(
					() => {
						console.log('Request successful');
						this.getLocation();
					},
					(error) => {
						console.error('Error requesting location accuracy', JSON.stringify(error));
						let alert = this.alertCtrl.create({
							title: 'Location Error',
							subTitle: 'You must turn on GPS service to log visit report',
							buttons: [{
								text: 'OK', 
								handler: () => {
									this.viewCtrl.dismiss({success: false});
								}
							}]
						});
						alert.present();
					}
				);
			} else {
				console.error('Location permission is turned off');
				let alert = this.alertCtrl.create({
					title: 'Location Error',
					subTitle: 'You must grant access to Location Service.',
					buttons: [{
						text: 'OK', 
						handler: () => {
							this.viewCtrl.dismiss({success: true});
						}
					}]
				});
				alert.present();
			}
		});
	}*/
	
	getLocation(){
		this.geolocation.getCurrentPosition({maximumAge: 30000, timeout: 60000, enableHighAccuracy: false}).then((resp) => {
			if(resp.coords !== undefined){
				this._Latitude = resp.coords.latitude;
				this._Longitude = resp.coords.longitude;
				console.log(this._Latitude + " : " + this._Longitude);
				this.IsGPSGood = true;
				this.loader.dismiss();
			}
		}).catch((error) => {
			console.log('Error getting location' + error.code + " " + error.message);
			let alert = this.alertCtrl.create({
				title: 'Location Error',
				subTitle: 'Could not retrieve your location information. Make sure GPS is ON.',
				buttons: [{
					text: 'OK', 
					handler: () => {
						this.return();
					}
				}]
			});
			this.loader.dismiss();
			alert.present();
		});
		this._geolocationWatcher = this.geolocation.watchPosition().filter((p) => p.coords !== undefined).subscribe((resp) => {
			this._Latitude = resp.coords.latitude;
			this._Longitude = resp.coords.longitude;
			this.loader.dismiss();
		});
	}
	

	ionViewWillLeave(){
		if(this._geolocationWatcher){
			this._geolocationWatcher.unsubscribe();
		}
	}

	registerAttendance(){
			let loader = this.loadingCtrl.create({
					content: "Please wait..."
			});
			loader.present();
			this.ws.RegisteredAttendance(
				this._Latitude,
				this._Longitude				
			).subscribe(
				(ret) => {
					loader.dismiss();				
					if(ret===1){
						let alert = this.alertCtrl.create({
							title: 'Success',
							subTitle: 'The attendance for the day is processed already',
							buttons: [{
								text: 'OK', 
								handler: () => {
									this.return();
								}
							}]
						});
						alert.present();
					} 
					else if(ret===2){
						let alert = this.alertCtrl.create({
							title: 'Success',
							subTitle: 'The attendance is processed successfully',
							buttons: [{
								text: 'OK', 
								handler: () => {
									this.return();
								}
							}]
						});
						alert.present();
					}
					else {
						let alert = this.alertCtrl.create({
							title: 'Error',
							subTitle: 'There was an error processing your request. You can try after sometime. If the problem persists then contact support',
							buttons: [{
								text: 'DISMISS', 
								handler: () => {
									this.return();
								}
							}]
						});
						alert.present();
					}
				},
				(error) => {
					loader.dismiss();
					let alert = this.alertCtrl.create({
						title: 'Error',
						subTitle: 'There was an error communicating with the server. You can try after sometime. If the problem persists then contact support.',
						buttons: [{
								text: 'DISMISS', 
								handler: () => {
									this.return();
								}
							}]
					});
					alert.present();
				}
			);
	}

	return(){
		this.navCtrl.popToRoot();
		this.navCtrl.setRoot(CustomerListPage);
	}

}

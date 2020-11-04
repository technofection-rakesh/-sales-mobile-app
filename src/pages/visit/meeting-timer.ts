import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { timer } from 'rxjs/Observable/timer';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { VisitAddPage } from './add';

@Component({
  selector: 'meeting-timer-page',
  templateUrl: 'meeting-timer.html'
})

export class MeetingTimerPage {
	private _CustomerId:number;
	private _FollowupId: number;
	private _timer: any;
	private _timerSubscriber: any; 
	private _startTime: Date;
	private _stopTime: Date;
	private _Latitude: number;
	private _Longitude: number;
	
	
	public IsMeetingOn: boolean;
	public Timer: {Hours: number, Minutes: number, Seconds: number};
	public IsGPSGood: boolean;
	
	private _geolocationWatcher;

	constructor(
		public viewCtrl: ViewController, 
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public alertCtrl:AlertController, 
		public modalCtrl: ModalController,
		public geolocation: Geolocation, 
		public locationAccuracy: LocationAccuracy,
		private androidPermissions: AndroidPermissions) 
		{		
		this._geolocationWatcher = null;
		this._CustomerId = navParams.get("CustomerId");
		this._FollowupId = this.navParams.get("FollowupId");
		this._FollowupId = (typeof this._FollowupId) == "undefined" ? 0 : this._FollowupId;
		this.Timer = {
			Hours: 0,
			Minutes: 0,
			Seconds: 0
		}
		this._Latitude = 0;
		this._Longitude = 0;
		this.IsMeetingOn = false;
		this.IsGPSGood = false;
	}
	
	ionViewDidEnter(){
		this._checkPermission();
	}
	
	private _checkPermission(){
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
				alert.present();
			}
		);
	}
	
	private _requestLocation(){
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
	}
	
	getLocation(){
		this.geolocation.getCurrentPosition({maximumAge: 30000, timeout: 60000, enableHighAccuracy: true}).then((resp) => {
			if(resp.coords !== undefined){
				this._Latitude = resp.coords.latitude;
				this._Longitude = resp.coords.longitude;
				console.log(this._Latitude + " : " + this._Longitude);
				this.IsGPSGood = true;
			}
		}).catch((error) => {
			console.log('Error getting location' + error.code + " " + error.message);
			let alert = this.alertCtrl.create({
				title: 'Location Error',
				subTitle: 'Could not retrieve your location information. Make sure GPS is ON.',
				buttons: [{
					text: 'OK', 
					handler: () => {
						this.viewCtrl.dismiss({success: false});
					}
				}]
			});
			alert.present();
		});
		this._geolocationWatcher = this.geolocation.watchPosition().filter((p) => p.coords !== undefined).subscribe((resp) => {
			this._Latitude = resp.coords.latitude;
			this._Longitude = resp.coords.longitude;
			console.log(this._Latitude + " : " + this._Longitude);
		});
	}
	

	ionViewWillLeave(){
		if(this._geolocationWatcher){
			this._geolocationWatcher.unsubscribe();
		}
		this._stopMeeting();
	}

	startMeeting(){
		this._timer = timer(1000, 1000);
		this._timerSubscriber = this._timer.subscribe(
			(t) => {
				this.Timer.Hours = Math.floor(t / 60 / 60);
				this.Timer.Minutes = Math.floor(t / 60) % 60;
				this.Timer.Seconds = t % 60;
			}
		);
		this.IsMeetingOn = true;
		this._startTime = new Date();
		this._stopTime = null;
	}
	
	stopMeeting(){
		let alert = this.alertCtrl.create({
				title: 'Confirm',
				subTitle: 'Are you sure to stop the meeting?',
				buttons: [{
					text: "Yes",
					handler: () => {
						this._stopMeeting();
						this._openVisitAddModal();
					}
				}, {
					text: "No",
					role: "cancel",
					handler: () => {
						//Do nothing
					}
				}]
			});
		alert.present();
	}
	
	private _stopMeeting(){
		if(!this._timer) return;
		this._timerSubscriber.unsubscribe();
		this._timer = null;
		this.IsMeetingOn = false;
		this._stopTime = new Date();
	}

	private _openVisitAddModal(){
		let visitAddModal = this.modalCtrl.create(VisitAddPage, {CustomerId: this._CustomerId, FollowupId: this._FollowupId, StartTime: this._startTime, EndTime: this._stopTime, Latitude: this._Latitude, Longitude: this._Longitude});
		visitAddModal.onDidDismiss(data => {
			let success: boolean = false;
			if(data){
				if(data.hasOwnProperty("success")){
					if(data.success === true){
						success = true;
					}
				}
			}
			this.viewCtrl.dismiss({success : success});
		});
		visitAddModal.present();
	}
}

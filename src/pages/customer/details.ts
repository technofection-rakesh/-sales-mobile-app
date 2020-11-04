import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
import { VisitHistoryPage } from '../visit/history';
import { MeetingTimerPage } from '../visit/meeting-timer';
import { CustomerAddPage } from '../customer/add';
import { CustomerListPage } from '../customer/list';

@Component({
  selector: 'customer-details-page',
  templateUrl: 'details.html'
})

export class CustomerDetailsPage {

	customer:any;
	offDays:string="";
  
	constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
		this.customer = navParams.get("customer");
		console.log(this.customer);
		console.log(this.customer.OffDays);
		var OffDays=this.customer.OffDays.padStart(7, '0');

		if(OffDays.substring(0, 1)=="0"){
			this.offDays+="Monday";
		}
		if(OffDays.substring(1, 2)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Tuesday ";
		}
		if(OffDays.substring(2, 3)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Wednesday";
		}
		if(OffDays.substring(3, 4)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Thursday";
		}
		if(OffDays.substring(4, 5)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Friday";
		}
		if(OffDays.substring(5, 6)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Saturday";
		}
		if(OffDays.substring(6, 7)=="0"){
			if(this.offDays!=""){
				this.offDays+=" , ";
			}
			this.offDays+="Sunday";
		}
	}

	mail(){
		location.href = this.customer.EmailID;
	}

	showVisitHistory(){
		this.navCtrl.push(VisitHistoryPage, {CustomerId: this.customer.ID});
	}

	openVisitAddModal(){
		let meetingTimerModal = this.modalCtrl.create(MeetingTimerPage, {CustomerId: this.customer.ID});
		meetingTimerModal.present();
	}

	openCustomerEditModal(){
		let editCustomerModal = this.modalCtrl.create(CustomerAddPage,{customer:this.customer});
		var _self=this;
		editCustomerModal.onDidDismiss(data => {
		   _self.navCtrl.popToRoot();
		   _self.navCtrl.setRoot(CustomerListPage);
   		});
		editCustomerModal.present();
	}
 
}

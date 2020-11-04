import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { CustomerListPage } from '../pages/customer/list';
import { FollowupListPage } from '../pages/followups/list';
import { AllowanceListPage } from '../pages/allowance/list';
import { LeaveListPage } from '../pages/leave/list';
import { OrderListPage } from '../pages/order/list';
import { AttendancePage } from '../pages/attendance/attendance';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = LoginPage;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.overlaysWebView(false);
			this.statusBar.styleLightContent();
			this.splashScreen.hide();	  
		});
	}

	logout(){
		this.nav.popToRoot();
		this.nav.setRoot(this.rootPage);
	}

	customers(){
		this.nav.popToRoot();
		this.nav.setRoot(CustomerListPage);
	}

	followups(){
		this.nav.popToRoot();
		this.nav.setRoot(FollowupListPage);
	}
	
	allowance(){
		this.nav.popToRoot();
		this.nav.setRoot(AllowanceListPage);
	}
	
	leave(){
		this.nav.popToRoot();
		this.nav.setRoot(LeaveListPage);
	}

	attendance(){

		
		this.nav.popToRoot();
		this.nav.setRoot(AttendancePage);
	}
	
	order(){
		this.nav.popToRoot();
		this.nav.setRoot(OrderListPage);
	}
}

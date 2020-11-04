import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';

import { AttendancePage } from '../pages/attendance/attendance';

import { VisitHistoryPage } from '../pages/visit/history';
import { VisitAddPage } from '../pages/visit/add';
import { MeetingTimerPage } from '../pages/visit/meeting-timer';

import { CustomerAddPage } from '../pages/customer/add';
import { CustomerListPage } from '../pages/customer/list';
import { CustomerDetailsPage } from '../pages/customer/details';

import { FollowupListPage } from '../pages/followups/list';

import { AllowanceListPage } from '../pages/allowance/list';
import { AllowanceAddPage }  from '../pages/allowance/add';

import { LeaveListPage } from '../pages/leave/list';
import { LeaveRequestPage } from '../pages/leave/request';

import { OrderListPage } from '../pages/order/list';
import { OrderDetailsPage } from '../pages/order/details';
import { NewOrderPage } from '../pages/order/new';
import { CustomerSelectionPage } from '../pages/order/customer-selection';

import { ProductSelectionPage } from '../pages/order/product-selection';

import { FilterPipe } from './filter.pipe';
import { StrPadPipe } from './strpad.pipe';

import { WS } from './app.services';
import { AuthInjectorHttpInterceptor } from './http.interceptor';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    MyApp,
	FilterPipe,
	StrPadPipe,
    LoginPage,
    VisitHistoryPage,
	VisitAddPage,
	MeetingTimerPage,
	CustomerAddPage,
	CustomerListPage,
	CustomerDetailsPage,
	FollowupListPage,
	AllowanceListPage,
	AllowanceAddPage,
	LeaveListPage,
	LeaveRequestPage,
	OrderListPage,
	OrderDetailsPage,
	NewOrderPage,
	CustomerSelectionPage,
	ProductSelectionPage,
	AttendancePage
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    IonicModule.forRoot(MyApp),
	SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    VisitHistoryPage,
	VisitAddPage,
	CustomerAddPage,
	CustomerListPage,
	CustomerDetailsPage,
	FollowupListPage,
	MeetingTimerPage,
	AllowanceListPage,
	AllowanceAddPage,
	LeaveListPage,
	LeaveRequestPage,
	OrderListPage,
	OrderDetailsPage,
	NewOrderPage,
	CustomerSelectionPage,
	ProductSelectionPage,
	AttendancePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	WS,
	LocationAccuracy,
	Geolocation,
	AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
	{provide: HTTP_INTERCEPTORS, useClass: AuthInjectorHttpInterceptor, multi: true},
  ]
})

export class AppModule {}

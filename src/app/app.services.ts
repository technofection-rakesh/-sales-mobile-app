import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WS{
	APIBaseUrl:string = 'http://ws.sales.trakomatic.in/TrakomaticSales_WS.svc';
	//APIBaseUrl:string = 'http://localhost:2343/TrakomaticSales_WS.svc';
	UserToken: string;
	UserId: number;
	TrackingInterval: number;
	
	private _CustomerListLoaded: boolean;
	private _CustomerList: Array<any>;
	private _StateListLoaded: boolean;
	private _StateList: Array<any>;
	private _PurposeList: Array<any>;
	private _AllowanceTypes: Array<any>;
	private _ProductList: Array<any>;
	
	constructor(private http: HttpClient){
		this._CustomerListLoaded = false;
		this._StateListLoaded = false;
		this.UserToken = null;
		this.UserId = null;
		this._PurposeList = null;
		this._AllowanceTypes = null;
		this._ProductList = null;
	}
	
	Login(username: string, password: string) : Observable<any> {
		return Observable.create(observer => {
			this.http.post<any>(this.APIBaseUrl + "/Login", {Username: username, Password: password}).subscribe(
				data => {
					if(data.hasOwnProperty("Status")){
						if(data.Status === true){
							this.UserToken = data.Token;
							this.UserId = data.UserID;
							this.TrackingInterval = data.TrackingInterval;
							observer.next(true);
						} else {
							observer.next(false);
						}
					} else {
						observer.next(false);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}

	
	CreateCustomer(Data:any) : Observable<any> {
		return Observable.create(observer => {
			this.http.post<{Result:boolean}>(this.APIBaseUrl + "/InsertCustomer", {data: Data}).subscribe(
				data => {
					console.log(data);
					if(data.hasOwnProperty("Result")){
						if(data.Result === true){
							observer.next(true);
						} else {
							observer.next(false);
						}
					} else {
						observer.next(false);
					}
					observer.complete();
				}
				,
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetCustomerList(forceReload: boolean = false):Observable<any>{
		if(!this._CustomerListLoaded || forceReload){
			return Observable.create(observer => {
				this.http.get<Array<any>>(this.APIBaseUrl + "/GetCustomerList?IsAll=false").subscribe(
					data => {
						this._CustomerList = data;
						observer.next(data);
						observer.complete();
					},
					(err:HttpErrorResponse) => {
						observer.error(err);
					}
				);
			});
		} else {
			return Observable.create(observer => {
				observer.next(this._CustomerList);
				observer.complete();
			});
		}
	}
	
	GetStateList(forceReload: boolean = false):Observable<any>{
		if(!this._StateListLoaded || forceReload){
			return Observable.create(observer => {
				this.http.get<Array<any>>(this.APIBaseUrl + "/GetStateList").subscribe(
					data => {
						this._StateList = data;
						observer.next(data);
						observer.complete();
					},
					(err:HttpErrorResponse) => {
						observer.error(err);
					}
				);
			});
		} else {
			return Observable.create(observer => {
				observer.next(this._StateList);
				observer.complete();
			});
		}
	}
	
	
	GetVisitHistory(CustomerId: number):Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetVisitHistory?CustomerID="+CustomerId).subscribe(
				data => {
					observer.next(data);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetPurposeList():Observable<any>{
		if(this._PurposeList != null){
			return Observable.create(observer => {
				observer.next(this._PurposeList);
				observer.complete();				
			});
		} else {
			return Observable.create(observer => {
				this.http.get<Array<any>>(this.APIBaseUrl + "/GetPurposeList").subscribe(
					data => {
						this._PurposeList = data;
						observer.next(this._PurposeList);
						observer.complete();
					},
					(err:HttpErrorResponse) => {
						observer.error(err);
					}
				);
			});
		}
	}
	
	LogVisit(data:any):Observable<any>{
		return Observable.create(observer => {
			this.http.post<{Result:boolean}>(this.APIBaseUrl + "/InsertVisitLog", {data: data}).subscribe(
				(response) => {
					if(response.Result === true){
						observer.next(true);
					} else {
						observer.next(false);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetFollowupList():Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetUpcomingFollowUp?Type=3").subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetAllowanceTypes():Observable<any>{
		if(this._AllowanceTypes == null){
			return Observable.create(observer => {
				this.http.get<Array<any>>(this.APIBaseUrl + "/GetAllowanceTypes").subscribe(
					(response) => {
						this._AllowanceTypes = response;
						observer.next(this._AllowanceTypes);
						observer.complete();
					},
					(err:HttpErrorResponse) => {
						observer.error(err);
					}
				);
			});
		} else {
			return Observable.create(observer => {
				observer.next(this._AllowanceTypes);
				observer.complete();
			});

		}
	}
	
	GetAllowanceList():Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetAllowanceList").subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	ClaimAllowance(data: any):Observable<any>{
		return Observable.create(observer => {
			this.http.post<{Result:boolean}>(this.APIBaseUrl + "/InsertAllowance", {data: data}).subscribe(
				(response) => {
					if(response.Result === true){
						observer.next(true);
					} else {
						observer.next(false);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetLeaves():Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetLeaveList").subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}	
	
	RequestLeave(data: any):Observable<any>{
		return Observable.create(observer => {
			this.http.post<{Result:boolean}>(this.APIBaseUrl + "/InsertLeave", {data: data}).subscribe(
				(response) => {
					if(response.Result === true){
						observer.next(true);
					} else {
						observer.next(false);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetProductList():Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetProductList").subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetOrders():Observable<any>{
		return Observable.create(observer => {
			this.http.get<Array<any>>(this.APIBaseUrl + "/GetOrderList").subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	GetOrderDetails(OrderId: number):Observable<any>{
		return Observable.create(observer => {
			this.http.get<any>(this.APIBaseUrl + "/GetOrderDetail?OrderID=" + OrderId.toString()).map((res:any) => {
				var _orderTotal = 0;
				var i;
				for(i=0; i<res.OrderItems.length; i++){
					_orderTotal += (res.OrderItems[i].Price + (res.OrderItems[i].Price * (res.OrderItems[i].Tax / 100))) * res.OrderItems[i].Quantity;
				}
				res["OrderTotal"] = _orderTotal;
				return res;
			}).subscribe(
				(response) => {
					observer.next(response);
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}
	
	InsertOrder(OrderItems: Array<any>, CustomerId:number):Observable<any>{
		return Observable.create(observer => {
			this.http.post<{Result:boolean}>(this.APIBaseUrl + "/InsertOrder", {data: {CompanyID: CustomerId, OrderItems: OrderItems}}).subscribe(
				(response) => {
					if(response.Result === true){
						observer.next(true);
					} else {
						observer.next(false);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}

	RegisteredAttendance(lat:number,lng:number):Observable<any>{	
		
		return Observable.create(observer => {
			this.http.get<any>(this.APIBaseUrl + "/ProcessAttendance?Latitude=" +lat+"&Longitude="+lng).subscribe(
				(response) => {
					if(response.Result === true){
						// status code 1=> already done, 2 => succesfull, 0=> error
						observer.next(response.StatusCode);
					} else {
						observer.next(-1);
					}
					observer.complete();
				},
				(err:HttpErrorResponse) => {
					observer.error(err);
				}
			);
		});
	}

	UpdateUserLocation(lat:number,lng:number){	
		
			this.http.get<any>(this.APIBaseUrl + "/UpdateUserLocation?Latitude=" +lat+"&Longitude="+lng).subscribe(
				(response) => {
					if(response.Result === true){
						// status code 1=> already done, 2 => succesfull, 0=> error
						
					} else {
						console.log(response.StatusCode)
					}
					
				},
				(err:HttpErrorResponse) => {
					
				}
			);
		
	}
	
}
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { WS } from './app.services';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInjectorHttpInterceptor implements HttpInterceptor {

	constructor(public inj: Injector) {
		
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const ws = this.inj.get(WS);
		if(ws.UserToken != null){
			const changedReq = req.clone({
			  setHeaders: {
				Authorization: ws.UserToken + ":" + ws.UserId
			  }
			});
			return next.handle(changedReq);
		} else {
			return next.handle(req);
		}
	}
  
}
import {Injectable, NgModule} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppConfig} from "../constants/app-config";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let headers = null;
    if(token) {
      headers = req.headers.set('token', token);
    }else {
      headers = req.headers;
    }
    const dupReq = req.clone({
      url: AppConfig.API_BASE_URL + req.url,
      headers
    });
    return next.handle(dupReq);
    // return next.handle(req);
  }
}

@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true}
  ]
})
export class InterceptorModule {
}

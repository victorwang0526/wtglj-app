import {Injectable, NgModule} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppConfig} from "../constants/app-config";
import {tap} from "rxjs/operators";
import {Events} from "ionic-angular";
import {HttpHeaders} from "@angular/common/http/src/headers";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(
    public event: Events,){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let headers: HttpHeaders = null;
    if(token) {
      headers = req.headers.set('token', token);
    }else {
      headers = req.headers;
    }

    // // headers.set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    // // headers.set('Accept', 'application/json, text/plain');
    // headers.set("cache-control", "no-cache");
    // headers.set("Access-Control-Allow-Origin", "*");
    // headers.set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers");
    // headers.set("Access-Control-Allow-Credentials" , "true");
    // headers.set("Access-Control-Allow-Methods" , "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT");
    const dupReq = req.clone({
      url: AppConfig.API_BASE_URL + req.url,
      headers
    });
    return next.handle(dupReq)
      .pipe(tap(evt => {
        if(evt instanceof HttpResponse) {
          if(evt.body) {
            if(evt.body.code == 401) {
              this.event.publish('401');
            }else if(evt.body.code != 0) {
              this.event.publish('400', evt.body);
            }
          }
        }
      }));
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

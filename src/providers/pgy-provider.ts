import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class PgyProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PgyProvider Provider');
  }
  checkUpdate(mobile: string): Observable<any> {
    return this.http.get(`/app/version/` + mobile);
  }
}

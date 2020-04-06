import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  login(username, password): Observable<any> {
    let data = `loginName=${username}&loginPsw=${password}`;
    return this.http.post('http://116.62.120.169/api/login', data);
  }
}

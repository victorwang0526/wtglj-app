import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  login(username, password, deviceId): Observable<any> {
    return this.http.post('/login', {
      username, password, deviceId
    });
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/sys/user/info');
  }

  getEnterprise(key: string): Observable<any> {
    return this.http.get('/sys/sysenterprise/page?key=' + key);
  }
}

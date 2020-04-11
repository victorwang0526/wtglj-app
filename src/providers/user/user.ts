import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  login(username, password): Observable<any> {
    return this.http.post('/login', {
      username, password
    });
  }

  getUserInfo() {
    return this.http.get('/sys/user/info');
  }
}

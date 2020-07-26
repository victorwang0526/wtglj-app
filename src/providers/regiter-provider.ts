import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../models/register-vo';
import { Observable } from 'rxjs';

/*
  Generated class for the RegiterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegiterProvider {
  constructor(public http: HttpClient) {
    console.log('Hello RegiterProvider Provider');
  }

  register(entry: Register) {
    return this.http.post('/mobile/exampractice/registered', entry);
  }

  getCode(username: string) {
    return this.http.get(`/mobile/exampractice/getVerificationCode/${username}`);
  }

  forgot(entry) {
    return this.http.post('/mobile/exampractice/retrievePassword', entry);
  }
}

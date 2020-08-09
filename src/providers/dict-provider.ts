import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DictProvider {
  constructor(public http: HttpClient) {
    console.log('Hello DictProvider Provider');
  }

  getDicts(dictTypes: string): Observable<any> {
    return this.http.get(`/sys/dict/type/list?dictTypes=${dictTypes}`);
  }
}

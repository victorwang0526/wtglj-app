import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class SuggestionProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  submit(remark): Observable<any> {
    return this.http.post('/sys/syssuggestion', {
      remark
    });
  }
}

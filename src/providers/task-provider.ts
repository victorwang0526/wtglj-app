import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {TaskGroupVo} from "../models/task-group-vo";

@Injectable()
export class TaskProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TaskProvider Provider');
  }

  getTaskGroup(): Observable<any> {
    return this.http.get('/sys/sysinspecttaskcheck/group');
  }
}

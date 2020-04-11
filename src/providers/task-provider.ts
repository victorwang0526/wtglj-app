import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class TaskProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TaskProvider Provider');
  }

  getTaskGroup(inspectType: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/group?inspectType=${inspectType}`);
  }

  getTaskUnfinishCnt(): Observable<any> {
    return this.http.get('/sys/sysinspecttaskcheck/taskUnfinishCnt');
  }

  getTaskChecks(inspectId: number, taskId: number, areas: string, industries: string): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/page?page=1&limit=999&inspectId=${inspectId}&taskId=${taskId}&areas=${areas}&industries=${industries}`);
  }
}

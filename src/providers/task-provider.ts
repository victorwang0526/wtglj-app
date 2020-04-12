import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import {InspectVo} from "../models/inspect-vo";
import {TaskCheckVo} from "../models/task-check-vo";
import {TaskCheckItemVo} from "../models/task-check-item-vo";

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

  getInspectDetail(inspectId: number): Observable<InspectVo> {
    return this.http.get(`/sys/sysinspect/${inspectId}`).map((res: any) => res.data);
  }

  submitTaskCheck(taskCheck: TaskCheckVo): Observable<any> {
    return this.http.put('/sys/sysinspecttaskcheck', taskCheck);
  }

  getTaskCheckItems(taskCheckId: number): Observable<Array<TaskCheckItemVo>> {
    return this.http.get(`/sys/sysinspecttaskcheckitem/page?taskCheckId=${taskCheckId}&page=1&size=999`)
      .map((res: any) => res.data.list);
  }
}

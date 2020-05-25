import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import {InspectVo} from "../models/inspect-vo";
import {TaskCheckVo} from "../models/task-check-vo";
import {TaskCheckItemVo} from "../models/task-check-item-vo";
import {DictDataVo} from "../models/dict-data-vo";

@Injectable()
export class TaskProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TaskProvider Provider');
  }

  getTaskGroup(userId: number, inspectType: string, dateRange: number): Observable<any> {
    let dr = dateRange > 0 ? dateRange : '';
    return this.http.get(`/sys/sysinspecttaskcheck/group?userId=${userId}&inspectType=${inspectType}&dateRange=${dr}`);
  }

  getTaskUnfinishCnt(userId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/${userId}/taskUnfinishCnt`);
  }

  getTaskChecks(inspectId: number, taskId: number, taskTitle: string, areas: string, industries: string): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/page?page=1&limit=999&inspectId=${inspectId}&taskId=${taskId}&taskTitle=${taskTitle}&areas=${areas}&industries=${industries}`);
  }

  getTaskCheck(taskCheckId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/${taskCheckId}`);
  }

  getInspectDetail(inspectId: number): Observable<InspectVo> {
    return this.http.get(`/sys/sysinspect/${inspectId}`).map((res: any) => res.data);
  }

  getApproveDanger(userId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/getAuditTaskItemList/${userId}`).map((res: any) => res.data);
  }

  approveDanger(id: number, userId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/auditPunishes/${id}/${userId}`).map((res: any) => res.data);
  }

  submitTaskCheck(taskCheck: TaskCheckVo): Observable<any> {
    return this.http.put('/sys/sysinspecttaskcheck', taskCheck);
  }

  getTaskCheckItems(taskCheckId: number): Observable<Array<TaskCheckItemVo>> {
    return this.http.get(`/sys/sysinspecttaskcheckitem/page?taskCheckId=${taskCheckId}&page=1&size=999`)
      .map((res: any) => res.data.list);
  }

  getDangerTypes(): Observable<Array<DictDataVo>> {
    return this.http.get(`/sys/dict/data/page?page=1&limit=20&dictTypeId=1006000`)
      .map((res: any) => res.data.list);
  }

  getPunishTypes(): Observable<Array<DictDataVo>> {
    return this.http.get(`/sys/dict/data/page?page=1&limit=20&dictTypeId=1005000`)
      .map((res: any) => res.data.list);
  }


}

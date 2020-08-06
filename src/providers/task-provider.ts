import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { InspectVo } from '../models/inspect-vo';
import { TaskCheckVo } from '../models/task-check-vo';
import { TaskCheckItemVo } from '../models/task-check-item-vo';
import { DictDataVo } from '../models/dict-data-vo';
import { IndustryEnterpriseVo } from '../models/industry-enterprise-vo';

@Injectable()
export class TaskProvider {
  constructor(public http: HttpClient) {
    console.log('Hello TaskProvider Provider');
  }

  getTaskGroup(userId: number, inspectType: string, dateRange: number): Observable<any> {
    let dr = dateRange > 0 ? dateRange : '';
    return this.http.get(
      `/sys/sysinspecttaskcheck/group?userId=${userId}&inspectType=${inspectType}&dateRange=${dr}`,
    );
  }

  getTaskUnfinishCnt(userId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/${userId}/taskUnfinishCnt`);
  }

  getTaskChecks(
    userId: string,
    key: string,
    inspectId: number,
    taskId: number,
    taskTitle: string,
    areas: string,
    industries: string,
    page: number,
  ): Observable<any> {
    return this.http.get(
      `/sys/sysinspecttaskcheck/page2?page=${page}&limit=20&userId=${userId}&key=${key}&inspectId=${inspectId}&taskId=${taskId}&taskTitle=${taskTitle}&areas=${areas}&industries=${industries}`,
    );
  }

  getTaskCheck(taskCheckId: number): Observable<any> {
    return this.http.get(`/sys/sysinspecttaskcheck/${taskCheckId}`);
  }

  getXunChaTaskCheck(userId: number): Observable<any> {
    return this.http
      .get(`/sys/sysinspecttaskcheck/xuncha?userId=${userId}`)
      .map((res: any) => res.data);
  }

  getInspectDetail(inspectId: number): Promise<InspectVo> {
    return this.http
      .get(`/sys/sysinspect/${inspectId}`)
      .map((res: any) => res.data)
      .toPromise();
  }

  getInspects(): Observable<InspectVo> {
    return this.http.get(`/sys/sysinspect/page?limit=99`).map((res: any) => res.data.list);
  }

  getApproveDanger(userId: number): Observable<any> {
    return this.http
      .get(`/sys/sysinspecttaskcheck/getAuditTaskItemList/${userId}`)
      .map((res: any) => res.data);
  }

  approveDanger(id: number, userId: number, remark: string): Observable<any> {
    return this.http
      .get(`/sys/sysinspecttaskcheck/auditPunishes/${id}/${userId}?remark=${remark}`)
      .map((res: any) => res.data);
  }

  submitTaskCheck(taskCheck: TaskCheckVo): Observable<any> {
    return this.http.put('/sys/sysinspecttaskcheck', taskCheck);
  }

  getTaskCheckItems(taskCheckId: number): Promise<Array<TaskCheckItemVo>> {
    return this.http
      .get(`/sys/sysinspecttaskcheckitem/page?taskCheckId=${taskCheckId}&page=1&limit=999`)
      .map((res: any) => res.data.list)
      .toPromise();
  }

  getDangerTypes(): Observable<Array<DictDataVo>> {
    return this.http
      .get(`/sys/dict/data/page?page=1&limit=20&dictTypeId=1006000`)
      .map((res: any) => res.data.list);
  }

  getPunishTypes(): Observable<Array<DictDataVo>> {
    return this.http
      .get(`/sys/dict/data/page?page=1&limit=20&dictTypeId=1005000`)
      .map((res: any) => res.data.list);
  }

  getIndustryEnterprise(areas: string): Observable<Array<IndustryEnterpriseVo>> {
    if (!areas || areas == 'null') {
      areas = '';
    }
    return this.http
      .get(`/sys/sysenterprise/industries?areas=` + areas)
      .map((res: any) => res.data);
  }

  getGroupUsers(deptId: string): Observable<any[]> {
    return this.http
      .get(`/mobile/exampractice/getGroupUserByUserId/${deptId}`)
      .map((res: any) => res.data);
  }

  getUserPunish(operatorId: number): Observable<any[]> {
    return this.http
      .get(`/sys/sysinspecttaskpunish/getUserPunishEntity?operatorId=${operatorId}`)
      .map((res: any) => res.data);
  }
}

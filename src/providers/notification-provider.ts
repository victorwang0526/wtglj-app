import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification, Notice } from '../models/notification-vo';
import { Observable } from 'rxjs';
import { Utils } from '../utils';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
  constructor(public http: HttpClient, private utils: Utils) {
    console.log('Hello NotificationProvider Provider');
  }

  getNotice(query: any): Observable<Notification[]> {
    const url = this.utils.buildQueryUrl('/sys/noticerecord/page', query);
    return this.http.get<Notification>(url).map((res: any) => res.data.list);
  }

  getNoticeDetail(id: string): Observable<Notice> {
    return this.http.get<Notice>(`/sys/noticerecord/${id}`).map((res: any) => res.data);
  }

  changeStatus(id: any): Observable<Notice> {
    return this.http.get<Notice>(`/sys/noticerecord/changeType/${id}`).map((res: any) => res.data);
  }
}

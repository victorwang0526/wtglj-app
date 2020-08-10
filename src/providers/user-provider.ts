import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserVo } from '../models/user-vo';
import { EnterpriseVo } from '../models/enterprise-vo';

@Injectable()
export class UserProvider {
  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  login(username, password, deviceId): Observable<any> {
    return this.http.post('/login', {
      username,
      password,
      deviceId,
    });
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/sys/user/info');
  }

  getEnterprise(key: string, userId): Observable<any> {
    return this.http.get(`/sys/sysenterprise/page?key=${key}&userId=${userId}`);
  }

  getEnterpriseById(id: number): Promise<EnterpriseVo> {
    return this.http
      .get('/sys/sysenterprise/' + id)
      .map((res: any) => res.data)
      .toPromise();
  }

  updateUser(user: UserVo): Observable<any> {
    return this.http.put('/sys/user', user);
  }
}

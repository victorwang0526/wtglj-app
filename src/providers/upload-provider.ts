import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class UploadProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UploadProvider Provider');
  }

  upload(file: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, this.createFileName());
    let headers = new HttpHeaders();

    // headers.set('Accept', 'application/json');
    headers.append("Content-Type", "multipart/form-data");

    return this.http.post('/sys/oss/upload', formData, {headers})
      .map((res:any) => res.data.src);
  }


  createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}

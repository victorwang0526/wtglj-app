import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exam, Achievement, Question, Answer, Practice } from '../models/exam-vo';
import { Observable } from 'rxjs';

/*
  Generated class for the ExamProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExamProvider {
  constructor(public http: HttpClient) {
    console.log('Hello ExamProvider Provider');
  }

  getExam(userId: number): Observable<Exam[]> {
    return this.http
      .get<Exam[]>(`/mobile/exampractice/getExam/${userId}`)
      .map((res: any) => res.data);
  }

  getQuestions(examPracticeId: string): Observable<Question[]> {
    return this.http
      .get<Question[]>(`/mobile/exampractice/getExamMaster/${examPracticeId}`)
      .map((res: any) => res.data);
  }

  achievementSave(query: Answer): Observable<any> {
    return this.http
      .post(`/mobile/exampractice/achievementSave`, query)
      .map((res: any) => res.data);
  }

  getPracticeStatus(userId: number) {
    return this.http
      .get<Practice[]>(`/mobile/exampractice/dailyPractice/${userId}`)
      .map((res: any) => res.data);
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ExamDetailPage } from '../exam-detail/exam-detail';
import { ExamProvider } from '../../providers/exam-provider';
import { UserVo } from '../../models/user-vo';
import { Exam } from '../../models/exam-vo';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-exam-list',
  templateUrl: 'exam-list.html',
})
export class ExamListPage {
  user: UserVo;
  questions: Exam[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public examService: ExamProvider,
    private storage: Storage,
    public loadingController: LoadingController,
  ) {
    this.storage.get('user').then((u) => {
      this.user = u;

      this.getData(this.user.id);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExamListPage');
  }

  openExamDetail(examId) {
    this.navCtrl.push(ExamDetailPage, { examId });
  }

  async getData(userid: number) {
    const loading = this.loadingController.create({});
    await loading.present();

    this.examService.getExam(userid).subscribe(
      (data) => (this.questions = data),
      null,
      () => loading.dismiss(),
    );
  }
}

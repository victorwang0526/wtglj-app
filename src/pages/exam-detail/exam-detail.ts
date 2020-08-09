import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ExamProvider } from '../../providers/exam-provider';
import { Storage } from '@ionic/storage';
import { UserVo } from '../../models/user-vo';
import { Question } from '../../models/exam-vo';
import { ExamFinishPage } from '../exam-finish/exam-finish';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'page-exam-detail',
  templateUrl: 'exam-detail.html',
})
export class ExamDetailPage {
  user: UserVo;
  examId: string;
  title: string;
  questions: Question[] = [];
  startTime: Date;
  examType = {
    0: '判断题',
    1: '单选题',
    2: '多选题',
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public examService: ExamProvider,
    private storage: Storage,
    public loadingController: LoadingController,
  ) {
    this.examId = navParams.get('examId');
    this.title = navParams.get('title');
    this.storage.get('user').then((u) => {
      this.user = u;
    });
    this.getData(this.examId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExamDetailPage');
  }

  onSubmit() {
    const itemList = this.questions.map((item) => ({
      answer: item.answer + '',
      examMasterId: item.examMasterId,
    }));
    const data = {
      endTime: new Date(), //结束时间
      examPracticeId: this.examId, //考试Id
      respondentId: this.user.id, //答题用户Id
      startTime: this.startTime, //开始时间
      itemList,
    };
    this.examService
      .achievementSave(data)
      .subscribe((examResult) => this.navCtrl.push(ExamFinishPage, { examResult }));
  }

  async getData(id: string) {
    const loading = this.loadingController.create({});
    await loading.present();
    this.examService.getQuestions(id).subscribe(
      (data) => {
        this.startTime = new Date();
        this.questions = data;
        this.questions = data.map((item) => ({
          ...item,
          itemList: item.itemList.map((i) => ({ ...i, checked: false })),
          answer: [],
          examMasterId: item.id,
        }));
      },
      null,
      () => loading.dismiss(),
    );
  }

  choose(item: Question, option: string) {
    const checked = item.itemList.find((i) => i.options === option).checked;
    item.itemList.find((i) => i.options === option).checked =
      checked && item.examType !== 2 ? checked : !checked;
    const state = item.itemList.find((i) => i.options === option).checked;
    if (state === true) {
      if (item.examType === 2) {
        item.answer = Array.from(new Set([...item.answer, option]));
      } else {
        item.answer = [option];
      }
    } else {
      item.answer.splice(item.answer.indexOf(option), 1);
    }
  }
}

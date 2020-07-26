import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserVo } from '../../models/user-vo';
import { ExamProvider } from '../../providers/exam-provider';
import { Question } from '../../models/exam-vo';

/**
 * Generated class for the ExerciseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exercise-detail',
  templateUrl: 'exercise-detail.html',
})
export class ExerciseDetailPage {
  items = ['A', 'B', 'C', 'D'];
  questionNo = 0;
  questions: Question[] = [];
  user: UserVo;
  examId: string;
  isShowAnswer = false;
  startTime: Date = new Date();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public examService: ExamProvider,
    private storage: Storage,
    public loadingController: LoadingController,
  ) {
    this.examId = navParams.get('examId');

    this.getData(this.examId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExerciseDetailPage');
  }

  next() {
    this.questionNo += 1;
    this.isShowAnswer = false;
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
    this.examService.achievementSave(data).subscribe(() => this.navCtrl.popToRoot());
  }

  async getData(examId: string) {
    const loading = this.loadingController.create({});
    await loading.present();
    this.examService.getQuestions(examId).subscribe(
      (data) => (this.questions = data),
      null,
      () => loading.dismiss(),
    );
  }

  choose(event: any, item: Question, option) {
    if (event.target.checked) {
      if (item.examType === 2) {
        item.answer = Array.from(new Set([...item.answer, option]));
      } else {
        item.answer = [option];
      }
    } else {
      item.answer.splice(item.answer.indexOf(option), 1);
    }
  }

  showAnswer() {
    this.isShowAnswer = true;
  }
}

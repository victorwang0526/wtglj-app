import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ExerciseDetailPage } from '../exercise-detail/exercise-detail';

@Component({
  selector: 'page-exam-finish',
  templateUrl: 'exam-finish.html',
})
export class ExamFinishPage {
  data: any;
  isTourist: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
  ) {
    this.data = navParams.get('examResult');
    this.storage.get('user').then((u) => {
      this.isTourist = u.dept === '1287033692479021057';
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExamFinishPage');
  }

  goBack() {
    if (this.isTourist) {
      this.navCtrl.setRoot(ExerciseDetailPage);
    } else {
      this.navCtrl.popToRoot();
    }
  }
}

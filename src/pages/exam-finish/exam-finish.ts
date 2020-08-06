import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ExamListPage } from '../exam-list/exam-list';

@Component({
  selector: 'page-exam-finish',
  templateUrl: 'exam-finish.html',
})
export class ExamFinishPage {
  data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.get('examResult');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExamFinishPage');
  }

  goBack() {
    this.navCtrl.popToRoot();
  }
}

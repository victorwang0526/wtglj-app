import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inspect-task-check-detail',
  templateUrl: 'inspect-task-check-detail.html',
})
export class InspectTaskCheckDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckDetailPage');
  }

}

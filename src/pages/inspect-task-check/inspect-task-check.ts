import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inspect-task-check',
  templateUrl: 'inspect-task-check.html',
})
export class InspectTaskCheckPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckPage');
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inspect-task-check-group',
  templateUrl: 'inspect-task-check-group.html',
})
export class InspectTaskCheckGroupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckGroupPage');
  }

}

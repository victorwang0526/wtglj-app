import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InspectTaskCheckGroupPage} from "../inspect-task-check-group/inspect-task-check-group";
import {LoginPage} from "../login/login";
import {InspectTaskCheckDetailPage} from "../inspect-task-check-detail/inspect-task-check-detail";
import {InspectTaskCheckPage} from "../inspect-task-check/inspect-task-check";
import {AdvicePage} from "../advice/advice";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  openLogin() {
    this.navCtrl.push(LoginPage, {});
  }

  openInspectCheckGroup() {
    this.navCtrl.push(InspectTaskCheckGroupPage, {});
  }

  openInspectCheck() {
    this.navCtrl.push(InspectTaskCheckPage, {});
  }

  openInspectCheckDetail() {
    this.navCtrl.push(InspectTaskCheckDetailPage, {});
  }

  openSelfCheckGroup() {
    this.navCtrl.push(InspectTaskCheckGroupPage, {});
  }

  openExam() {
    this.navCtrl.push(InspectTaskCheckGroupPage, {});
  }

  openAdvice() {
    this.navCtrl.push(AdvicePage, {});
  }
}

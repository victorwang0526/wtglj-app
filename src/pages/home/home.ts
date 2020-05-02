import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InspectTaskCheckGroupPage} from "../inspect-task-check-group/inspect-task-check-group";
import {LoginPage} from "../login/login";
import {AdvicePage} from "../advice/advice";
import {Storage} from "@ionic/storage";
import {UserVo} from "../../models/user-vo";
import {TaskProvider} from "../../providers/task-provider";
import {ExamListPage} from "../exam-list/exam-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: UserVo = null;

  taskUnfinishedCnt1: number = 0; // 检查
  taskUnfinishedCnt2: number = 0; // 自检

  constructor(public navCtrl: NavController,
              private storage: Storage,
              public taskProvider: TaskProvider) {
    this.storage.get('user').then(u => {
      this.user = u;
    });
  }

  ionViewDidEnter() {
    this.getTaskUnfinishedCnt();
  }

  logout() {
    this.storage.clear();
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage, {});
  }

  getTaskUnfinishedCnt() {
    this.taskProvider.getTaskUnfinishCnt().subscribe((res: any) => {
      if(res.code != 0) {
        return;
      }
      const cnts = res.data;
      for(let i = 0; i < cnts.length; i++) {
        if(cnts[i].inspectType == 1) {
          this.taskUnfinishedCnt1 = cnts[i].count;
        }else if(cnts[i].inspectType == 2) {
          this.taskUnfinishedCnt2 = cnts[i].count;
        }
      }
    });
  }

  openInspectCheckGroup() {
    this.navCtrl.push(InspectTaskCheckGroupPage, {inspectType: 1});
  }

  openSelfCheckGroup() {
    this.navCtrl.push(InspectTaskCheckGroupPage, {inspectType: 2});
  }

  openExam() {
    this.navCtrl.push(ExamListPage, {});
  }

  openAdvice() {
    this.navCtrl.push(AdvicePage, {});
  }
}

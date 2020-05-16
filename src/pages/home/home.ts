import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {InspectTaskCheckGroupPage} from "../inspect-task-check-group/inspect-task-check-group";
import {LoginPage} from "../login/login";
import {AdvicePage} from "../advice/advice";
import {Storage} from "@ionic/storage";
import {UserVo} from "../../models/user-vo";
import {TaskProvider} from "../../providers/task-provider";
import {ExamListPage} from "../exam-list/exam-list";
import {JPush} from "@jiguang-ionic/jpush";

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
              public alertCtrl: AlertController,
              public jpush: JPush,
              public taskProvider: TaskProvider) {
    this.storage.get('user').then(u => {
      this.user = u;
      setTimeout(this.initJPush(), 1000);
    });
  }


  alert(msg) {
    this.alertCtrl.create({
      title: msg
    }).present({});
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
    this.taskProvider.getTaskUnfinishCnt(this.user.id).subscribe((res: any) => {
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



  //****************************************************
  //******************   JPUSH   ***********************
  //****************************************************

  initJPush(){
    this.jpush.getRegistrationID().then((res) => {
      console.log('=====JPUSH: ' + res);
      this.setAlias(res);
    });
    this.jpush.setBadge(0);
    this.jpush.setApplicationIconBadgeNumber(0);
  }

  setAlias(alias) {
    this.jpush.setAlias({ sequence: (new Date()).getMilliseconds(), alias: alias })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  tagResultHandler = function(result) {
    console.log(JSON.stringify(result))
    // var sequence: number = result.sequence;
    // var tags: Array<string> = result.tags == null ? [] : result.tags;
    // alert('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());
  };

  aliasResultHandler = function(result) {
    console.log(JSON.stringify(result))
    // var sequence: number = result.sequence;
    // var alias: string = result.alias;
    // alert('Success!'setAlias(alias) {
    //     this.jpush.setAlias({ sequence: (new Date()).getMilliseconds(), alias: alias })
    //       .then(this.aliasResultHandler)
    //       .catch(this.errorHandler);
    //   } + '\nSequence: ' + sequence + '\nAlias: ' + alias);
  };

  errorHandler = function(err) {
    console.log(JSON.stringify(err))
    // var sequence: number = err.sequence;
    // var code = err.code;
    // alert('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  };
  //****************************************************
  //******************   JPUSH   ***********************
  //****************************************************
}

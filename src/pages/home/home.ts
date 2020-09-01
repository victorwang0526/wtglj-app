import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { InspectTaskCheckGroupPage } from '../inspect-task-check-group/inspect-task-check-group';
import { LoginPage } from '../login/login';
import { AdvicePage } from '../advice/advice';
import { Storage } from '@ionic/storage';
import { UserVo } from '../../models/user-vo';
import { TaskProvider } from '../../providers/task-provider';
import { ExamListPage } from '../exam-list/exam-list';
import { JPush } from '@jiguang-ionic/jpush';
import { UserCenterPage } from '../user-center/user-center';
import { DangerVo } from '../../models/danger-vo';
import { DangerApprovePage } from '../danger-approve/danger-approve';
import { TaskGroupVo } from '../../models/task-group-vo';
import { InspectTaskCheckPage } from '../inspect-task-check/inspect-task-check';
import { EnterpriseListPage } from '../enterprise-list/enterprise-list';
import { XunChaPage } from '../xun-cha/xun-cha';
import { TaskCheckVo } from '../../models/task-check-vo';
import { DailyTaskPage } from '../daily-task/daily-task';
import { NotificationPage } from '../notification/notification';
import { ExerciseDetailPage } from '../exercise-detail/exercise-detail';
import { ExamProvider } from '../../providers/exam-provider';
import { Exam } from '../../models/exam-vo';
import { ExamDetailPage } from '../exam-detail/exam-detail';
import { PunishListPage } from '../punish-list/punish-list';
import { take } from 'rxjs/operator/take';
import { NotificationProvider } from '../../providers/notification-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user: UserVo = null;

  taskUnfinishedCnt1: number = 0; // 检查
  taskUnfinishedCnt2: number = 0; // 自检
  dangerCnt = 0; // 隐患
  noticeCnt = 0; // 消息

  p = 100;

  dangers: Array<DangerVo> = [];
  groups: Array<TaskGroupVo> = [];
  exams: Array<Exam> = [];
  loading: boolean = false;

  tasks: Array<TaskCheckVo> = [];

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public alertCtrl: AlertController,
    public alertController: AlertController,
    public jpush: JPush,
    public taskProvider: TaskProvider,
    public examProvider: ExamProvider,
    public notificationProvider: NotificationProvider,
  ) {}

  ionViewDidLoad() {
    setTimeout(this.initJPush, 1000);
  }

  async openInspectDetail(taskCheck: TaskCheckVo) {
    this.navCtrl.push(DailyTaskPage, { taskCheck });
  }

  getXunChas() {
    this.taskProvider.getXunChaTaskCheck(this.user.id).subscribe((data: any) => {
      this.tasks = data;
    });
  }

  getExam() {
    if (!this.user) {
      return;
    }
    this.examProvider.getExam(this.user.id).subscribe((res: any) => {
      this.exams = res;
    });
  }

  getApproveDangers() {
    if (!this.user) {
      return;
    }
    this.taskProvider.getApproveDanger(this.user.id).subscribe((res: any) => {
      this.dangers = res;
    });
  }

  getTaskGroups() {
    this.loading = true;
    this.taskProvider.getTaskGroup(this.user.id, '1', 1).subscribe(
      (res: any) => {
        let gs = [];
        for (let g of res.data) {
          if (g.total - g.finished > 0) {
            gs.push(g);
          }
        }
        this.groups = gs;
      },
      () => {},
      () => {
        this.loading = false;
      },
    );
  }

  getNotice() {
    this.notificationProvider
      .getNotice({
        userId: this.user.id,
        page: 1,
        limit: 30,
      })
      .take(1)
      .subscribe((data) => (this.noticeCnt = data.filter((item) => item.status === 0).length));
  }

  addTaskCheck() {
    this.navCtrl.push(XunChaPage, {});
  }

  openTaskChecks(group) {
    this.navCtrl.push(InspectTaskCheckPage, { group });
  }

  alert(msg) {
    this.alertCtrl
      .create({
        title: msg,
      })
      .present({});
  }

  ionViewDidEnter() {
    this.storage.get('user').then((u) => {
      this.user = u;
      this.getTaskUnfinishedCnt();
      this.getApproveDangers();
      this.getTaskGroups();
      this.getXunChas();
      this.getExam();
      this.getDanger();
      this.getNotice();
    });
  }

  logout() {
    this.storage.clear();
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage, {});
  }

  getTaskUnfinishedCnt() {
    if (!this.user) {
      return;
    }
    this.taskProvider.getTaskUnfinishCnt(this.user.id).subscribe((res: any) => {
      if (res.code != 0) {
        return;
      }
      const cnts = res.data;
      for (let i = 0; i < cnts.length; i++) {
        if (cnts[i].inspectType == 1) {
          this.taskUnfinishedCnt1 = cnts[i].count;
        } else if (cnts[i].inspectType == 2) {
          this.taskUnfinishedCnt2 = cnts[i].count;
        }
      }
    });
  }

  getDanger() {
    this.taskProvider
      .getUserPunish(this.user.id)
      .take(1)
      .subscribe((data) => (this.dangerCnt = data.total));
  }

  openDanger() {
    this.navCtrl.push(PunishListPage);
  }

  openDangerApprove(danger) {
    this.navCtrl.push(DangerApprovePage, { danger });
  }

  openInspectCheckGroup() {
    this.navCtrl.push(InspectTaskCheckGroupPage, { inspectType: '1,3,4' });
  }

  async openSelfCheckGroup() {
    const alert = await this.alertController.create({
      message: '功能开发中...',
      buttons: ['OK'],
    });

    await alert.present();
    // this.navCtrl.push(InspectTaskCheckGroupPage, { inspectType: '2' });
  }

  openExercise() {
    this.examProvider
      .getPracticeStatus(this.user.id)
      .take(1)
      .subscribe(async (data) => {
        if (data && data.length) {
          this.navCtrl.push(ExerciseDetailPage, { examId: data[0].id });
        } else {
          const alert = await this.alertController.create({
            message: '今日练习已完成',
            buttons: ['OK'],
          });

          await alert.present();
        }
      });
  }

  openExam() {
    this.navCtrl.push(ExamListPage, {});
  }

  openExamDetail(exam: Exam) {
    this.navCtrl.push(ExamDetailPage, { examId: exam.id, title: exam.name });
  }

  openEnterprise() {
    this.navCtrl.push(EnterpriseListPage, {});
  }

  openAdvice() {
    this.navCtrl.push(AdvicePage, {});
  }

  openUserCenter() {
    this.navCtrl.push(UserCenterPage, {});
  }

  openNotification() {
    this.navCtrl.push(NotificationPage, {});
  }

  getFP(g) {
    return Math.floor((g.finished * 100) / g.total);
  }

  //****************************************************
  //******************   JPUSH   ***********************
  //****************************************************

  initJPush() {
    this.jpush.getRegistrationID().then((res) => {
      console.log('=====JPUSH: ' + res);
      this.setAlias(res);
    });
    this.jpush.setBadge(0);
    this.jpush.setApplicationIconBadgeNumber(0);
  }

  setAlias(alias) {
    this.jpush
      .setAlias({ sequence: new Date().getMilliseconds(), alias: alias })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  tagResultHandler = function (result) {
    console.log(JSON.stringify(result));
    // var sequence: number = result.sequence;
    // var tags: Array<string> = result.tags == null ? [] : result.tags;
    // alert('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());
  };

  aliasResultHandler = function (result) {
    console.log(JSON.stringify(result));
    // var sequence: number = result.sequence;
    // var alias: string = result.alias;
    // alert('Success!'setAlias(alias) {
    //     this.jpush.setAlias({ sequence: (new Date()).getMilliseconds(), alias: alias })
    //       .then(this.aliasResultHandler)
    //       .catch(this.errorHandler);
    //   } + '\nSequence: ' + sequence + '\nAlias: ' + alias);
  };

  errorHandler = function (err) {
    console.log(JSON.stringify(err));
    // var sequence: number = err.sequence;
    // var code = err.code;
    // alert('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  };
  //****************************************************
  //******************   JPUSH   ***********************
  //****************************************************
}

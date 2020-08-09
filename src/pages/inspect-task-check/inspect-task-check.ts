import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { TaskGroupVo } from '../../models/task-group-vo';
import { TaskProvider } from '../../providers/task-provider';
import { Storage } from '@ionic/storage';
import { TaskCheckVo } from '../../models/task-check-vo';
import { InspectTaskCheckDetailPage } from '../inspect-task-check-detail/inspect-task-check-detail';
import { UserVo } from '../../models/user-vo';
import { DictProvider } from '../../providers/dict-provider';
import { DailyTaskPage } from '../daily-task/daily-task';

@Component({
  selector: 'page-inspect-task-check',
  templateUrl: 'inspect-task-check.html',
})
export class InspectTaskCheckPage {
  loading: boolean = false;
  group: TaskGroupVo;
  tasks: Array<TaskCheckVo> = [];
  user: UserVo = null;
  areas: Array<any> = [];
  selectedArea: string;
  industries: Array<any> = [];
  selectedIndustry: string;
  key: string = '';
  page: number = 1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private dictProvider: DictProvider,
    public alertController: AlertController,
    public storage: Storage,
  ) {
    this.group = navParams.get('group');
    this.storage.get('user').then((u) => {
      this.user = u;
      this.getDict();
    });
  }

  keyChange(e: any) {
    this.key = e.target.value;
    this.page = 1;
    this.getTaskChecks();
  }

  getDict() {
    this.dictProvider.getDicts('area,industry', this.user.dept).subscribe((data) => {
      console.log(data);
      for (let item of data.data) {
        if (item.dictType == 'area') {
          if (
            this.user.deptDTO.areasName == null ||
            this.user.deptDTO.areasName == '' ||
            this.user.deptDTO.areasName.indexOf('全部') > -1
          ) {
            this.areas.push({ dictLabel: '全部', dictValue: '' });
            this.areas.push(...item.dataList);
          } else {
            let a = [];
            let as = this.user.deptDTO.areasName.split(',');
            a.push({ dictLabel: '全部', dictValue: '' });
            for (let aa of as) {
              a.push({ dictLabel: aa, dictValue: aa });
            }
            this.areas.push(...a);
          }
        } else if (item.dictType == 'industry') {
          if (
            this.user.deptDTO.industryNames == null ||
            this.user.deptDTO.industryNames == '' ||
            this.user.deptDTO.industryNames.indexOf('全部') > -1
          ) {
            this.industries.push({ dictLabel: '全部', dictValue: '' });
            this.industries.push(...item.dataList);
          } else {
            let a = [];
            let is = this.user.deptDTO.industryNames.split(',');
            a.push({ dictLabel: '全部', dictValue: '' });
            for (let aa of is) {
              a.push({ dictLabel: aa, dictValue: aa });
            }
            this.industries.push(...a);
          }
        }
      }
    });
  }

  ionViewDidEnter() {
    this.page = 1;
    this.getTaskChecks();
  }

  doRefresh(event) {
    this.page = 1;
    this.getTaskChecks(null, event);
  }

  areaChange(event) {
    this.page = 1;
    this.getTaskChecks();
  }

  inChange(event) {
    this.page = 1;
    this.getTaskChecks();
  }

  async getTaskChecks(event?, re?) {
    this.loading = true;
    // const user = await this.storage.get('user');
    this.taskProvider
      .getTaskChecks(
        this.user.id + '',
        this.key,
        this.group.inspectId,
        this.group.taskId,
        this.group.taskTitle,
        this.selectedArea || '',
        this.selectedIndustry || '',
        this.page,
      )
      .subscribe(
        (res: any) => {
          if (res.data.list.length == 0) {
            if (event) {
              event.enabled = false;
            }
          }
          if (this.page == 1) {
            this.tasks = res.data.list;
          } else {
            this.tasks.push(...res.data.list);
          }

          this.page = this.page + 1;
        },
        () => {},
        () => {
          if (event) {
            event.complete();
          }
          if (re) {
            re.complete();
          }
          this.loading = false;
        },
      );
  }

  async openInspectDetail(taskCheck: TaskCheckVo) {
    if (taskCheck.inspectType == 2 && !taskCheck.operateDate) {
      const alert = await this.alertController.create({
        message: '未自检.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }
    if (!taskCheck.inspectId) {
      this.navCtrl.push(DailyTaskPage, { taskCheck });
    } else {
      this.navCtrl.push(InspectTaskCheckDetailPage, {
        taskCheck,
        group: this.group,
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckPage');
  }
}

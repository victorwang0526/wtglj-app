import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {TaskGroupVo} from "../../models/task-group-vo";
import {TaskProvider} from "../../providers/task-provider";
import {Storage} from "@ionic/storage";
import {TaskCheckVo} from "../../models/task-check-vo";
import {InspectTaskCheckDetailPage} from "../inspect-task-check-detail/inspect-task-check-detail";
import {UserVo} from "../../models/user-vo";
import {DictProvider} from "../../providers/dict-provider";
import {DailyTaskPage} from "../daily-task/daily-task";

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
  selectedArea: string = '';
  industries: Array<any> = [];
  selectedIndustry: string = '';
  key: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public taskProvider: TaskProvider,
              private dictProvider: DictProvider,
              public alertController: AlertController,
              public storage: Storage) {
    this.group = navParams.get('group');
    this.storage.get('user').then(u => {
      this.user = u;
      this.getDict();
    });
  }

  keyChange(e: any) {
    this.key = e.target.value;
  }

  getDict() {
    this.dictProvider.getDicts('area,industry').subscribe((data) => {
      console.log(data);
      for(let item of data.data) {
        if(item.dictType == 'area') {
          if(this.user.areas == null || this.user.areas == '') {

          } else if(this.user.areas.indexOf('全部') > -1) {
            this.areas.push({dictLabel: "全部", dictValue: ""});
            this.areas.push(...item.dataList);
          }else {
            let a = [];
            let as = this.user.areas.split(',');
            a.push({dictLabel: "全部", dictValue: ""});
            for(let aa of as) {
              a.push({dictLabel: aa, dictValue: aa});
            }
            this.areas.push(...a);
          }
        }else if(item.dictType == 'industry') {
          if(this.user.industries == null || this.user.industries == '') {
          }else if(this.user.industries.indexOf('全部') > -1){
            this.industries.push({dictLabel: "全部", dictValue: ""});
            this.industries.push(...item.dataList);
          }else {
            let a = [];
            let is = this.user.industries.split(',');
            a.push({dictLabel: "全部", dictValue: ""});
            for(let aa of is) {
              a.push({dictLabel: aa, dictValue: aa});
            }
            this.industries.push(...a);
          }
        }
      }
    })
  }

  ionViewDidEnter() {
    this.getTaskChecks();
  }

  async getTaskChecks() {
    this.loading = true;
    const user = await this.storage.get('user');
    this.taskProvider.getTaskChecks(this.user.id+'', this.group.inspectId, this.group.taskId, this.group.taskTitle, this.selectedArea, this.selectedIndustry).subscribe((res: any) => {
      this.tasks = res.data.list;
    }, () => {},
      () => {
      this.loading = false;
      });
  }

  async openInspectDetail(taskCheck: TaskCheckVo) {
    if(taskCheck.inspectType == 2 && !taskCheck.operateDate) {
      const alert = await this.alertController.create({
        message: '未自检.',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    if(!taskCheck.inspectId) {
      this.navCtrl.push(DailyTaskPage, {taskCheck});
    }else {
      this.navCtrl.push(InspectTaskCheckDetailPage, {taskCheck});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckPage');
  }

}

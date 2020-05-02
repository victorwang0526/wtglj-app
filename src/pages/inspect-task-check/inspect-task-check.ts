import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {TaskGroupVo} from "../../models/task-group-vo";
import {TaskProvider} from "../../providers/task-provider";
import {Storage} from "@ionic/storage";
import {TaskCheckVo} from "../../models/task-check-vo";
import {InspectTaskCheckDetailPage} from "../inspect-task-check-detail/inspect-task-check-detail";

@Component({
  selector: 'page-inspect-task-check',
  templateUrl: 'inspect-task-check.html',
})
export class InspectTaskCheckPage {

  loading: boolean = false;
  group: TaskGroupVo;
  tasks: Array<TaskCheckVo> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public taskProvider: TaskProvider,
              public alertController: AlertController,
              public storage: Storage) {
    this.group = navParams.get('group');
  }

  ionViewDidEnter() {
    this.getTaskChecks();
  }

  async getTaskChecks() {
    this.loading = true;
    const user = await this.storage.get('user');
    this.taskProvider.getTaskChecks(this.group.inspectId, this.group.taskId, user.areas, user.industries).subscribe((res: any) => {
      this.tasks = res.data.list;
    }, () => {},
      () => {
      this.loading = false;
      });
  }

  async openInspectDetail(task: TaskCheckVo) {
    if(task.inspectType == 2 && !task.operateDate) {
      const alert = await this.alertController.create({
        message: '未自检.',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    this.navCtrl.push(InspectTaskCheckDetailPage, {task});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckPage');
  }

}

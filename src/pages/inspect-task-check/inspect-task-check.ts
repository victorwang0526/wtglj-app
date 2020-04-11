import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
              public storage: Storage) {
    this.group = navParams.get('group');
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

  openInspectDetail(task) {
    this.navCtrl.push(InspectTaskCheckDetailPage, {task});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckPage');
  }

}

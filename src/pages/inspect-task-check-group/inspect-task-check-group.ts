import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TaskProvider} from "../../providers/task-provider";
import {TaskGroupVo} from "../../models/task-group-vo";
import {InspectTaskCheckPage} from "../inspect-task-check/inspect-task-check";
import {UserVo} from "../../models/user-vo";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-inspect-task-check-group',
  templateUrl: 'inspect-task-check-group.html',
})
export class InspectTaskCheckGroupPage {

  groups: Array<TaskGroupVo> = [];
  loading: boolean = false;
  inspectType: number = 1;
  user: UserVo = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public taskProvider: TaskProvider) {
    this.inspectType = navParams.get('inspectType');
    this.storage.get('user').then(u => {
      this.user = u;
    });
  }

  ionViewDidEnter() {
    this.getTaskGroups();
  }

  getTaskGroups() {
    this.loading = true;
    this.taskProvider.getTaskGroup(this.user.id, this.inspectType).subscribe((res: any) => {
      this.groups = res.data;
    }, () => {},
      () => {
      this.loading = false;
      });
  }

  openTaskChecks(group) {
    this.navCtrl.push(InspectTaskCheckPage, {group});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckGroupPage');
  }

}

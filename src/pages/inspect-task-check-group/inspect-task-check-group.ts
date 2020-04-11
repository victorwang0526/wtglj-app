import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TaskProvider} from "../../providers/task-provider";
import {TaskGroupVo} from "../../models/task-group-vo";

@Component({
  selector: 'page-inspect-task-check-group',
  templateUrl: 'inspect-task-check-group.html',
})
export class InspectTaskCheckGroupPage {

  groups: Array<TaskGroupVo>;
  loading: boolean = false;
  inspectType: number = 1;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public taskProvider: TaskProvider) {
    this.inspectType = navParams.get('inspectType');
    this.getTaskGroups();
  }

  getTaskGroups() {
    this.loading = true;
    this.taskProvider.getTaskGroup(this.inspectType).subscribe((res: any) => {
      this.groups = res.data;
    }, () => {},
      () => {
      this.loading = false;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckGroupPage');
  }

}

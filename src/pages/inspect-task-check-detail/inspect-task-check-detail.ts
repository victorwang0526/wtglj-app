import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TaskCheckVo} from "../../models/task-check-vo";
import {TaskProvider} from "../../providers/task-provider";
import {InspectVo} from "../../models/inspect-vo";

@Component({
  selector: 'page-inspect-task-check-detail',
  templateUrl: 'inspect-task-check-detail.html',
})
export class InspectTaskCheckDetailPage {

  task: TaskCheckVo;
  inspect: InspectVo;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public taskProvider: TaskProvider) {
    this.task = navParams.get('task');

    taskProvider.getInspectDetail(this.task.inspectId)
      .subscribe((inspectVo: InspectVo) => {
        this.inspect = inspectVo;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckDetailPage');
  }

}

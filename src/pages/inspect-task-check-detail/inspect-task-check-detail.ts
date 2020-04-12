import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TaskCheckVo} from "../../models/task-check-vo";
import {TaskProvider} from "../../providers/task-provider";
import {InspectVo} from "../../models/inspect-vo";
import {InspectSubItemVo} from "../../models/inspect-sub-item-vo";

@Component({
  selector: 'page-inspect-task-check-detail',
  templateUrl: 'inspect-task-check-detail.html',
})
export class InspectTaskCheckDetailPage {

  task: TaskCheckVo;
  inspect: InspectVo;
  loading: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public taskProvider: TaskProvider) {
    this.task = navParams.get('task');

    this.loading = true;
    taskProvider.getInspectDetail(this.task.inspectId)
      .subscribe((inspectVo: InspectVo) => {
        this.inspect = inspectVo;
      }, ()=> {}, () => {
        this.loading = false;
      });
  }

  getItems(items: string) {
    let titems = [];
    // [xxxx(1,2,3)][yyyy(1,3,5)]
    let x = items.split('】')
    // [xxxx(1,2,3)
    // [yyyy(1,3,5)
    for(let i = 0; i < x.length; i++) {
      let x1 = x[i].replace('【', '');
      if(!x1 || x1.trim() == '') {
        continue;
      }
      let x2 = x1.replace('）', '');
      //xxx(1,2,3
      let y = x2.split('（');
      // xxx
      // 1,2,3
      titems.push({title: y[0], items: y[1].split('，')});
    }
    return titems;
  }

  checkItem(subItem: InspectSubItemVo, checkedValue: any) {
    subItem.checked = checkedValue;
  }

  checkItemM(subItem: InspectSubItemVo, checkedValue: any) {
    if(!subItem.checked) {
      subItem.checked = '';
    }
    if(subItem.checked.indexOf(checkedValue) > -1) {
      subItem.checked = subItem.checked.replace(checkedValue + ',', '');
    }else {
      subItem.checked = subItem.checked + checkedValue + ',';
    }
  }

  isChecked(subItem: InspectSubItemVo, currentValue: any): boolean {
    if(!subItem.checked) {
      return false;
    }
    return subItem.checked.indexOf(currentValue) > -1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckDetailPage');
  }

}

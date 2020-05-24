import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EnterpriseVo} from "../../models/enterprise-vo";
import {UserProvider} from "../../providers/user-provider";
import {TaskCheckVo} from "../../models/task-check-vo";

@Component({
  selector: 'page-enterprise-search',
  templateUrl: 'enterprise-search.html',
})
export class EnterpriseSearchPage {

  loading: boolean = false;
  key: string = '';
  shouldShowCancel: boolean = true;
  enterprises: Array<EnterpriseVo> = [];
  taskCheck: TaskCheckVo;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userProvider: UserProvider) {
    this.taskCheck = navParams.get('taskCheck');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnterpriseSearchPage');
  }

  onInput(event) {
    if(this.key === '') {
      return;
    }
    this.userProvider.getEnterprise(this.key).subscribe((data) => {
      this.enterprises = data.data.list;
    })
  }

  choose(enterprise) {
    this.taskCheck.enterpriseName = enterprise.name;
    this.taskCheck.enterpriseId = enterprise.id;
    this.navCtrl.pop({});
  }

  onCancel(event) {

  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from '../../providers/task-provider';
import { UserVo } from '../../models/user-vo';
import { Storage } from '@ionic/storage';
import { HiddenDangerPage } from '../hidden-danger/hidden-danger';
import { DangerVo } from '../../models/danger-vo';

@Component({
  selector: 'page-punish-list',
  templateUrl: 'punish-list.html',
})
export class PunishListPage {
  dangers: any[] = [1, 2, 3];
  user: UserVo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private storage: Storage,
  ) {
    this.storage.get('user').then((u) => {
      this.user = u;
      this.getData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PunishListPage');
  }

  getData() {
    this.taskProvider
      .getUserPunish(this.user.id)
      .take(1)
      .subscribe((data) => (this.dangers = data));
  }

  openDangerDetail(danger: DangerVo) {
    this.navCtrl.push(HiddenDangerPage, danger);
  }
}

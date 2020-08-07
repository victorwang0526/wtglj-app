import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  dangers: any[] = [];
  user: UserVo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private storage: Storage,
    public loadingController: LoadingController,
  ) {
    this.storage.get('user').then((u) => {
      this.user = u;
      this.getData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PunishListPage');
  }

  async getData() {
    const loading = this.loadingController.create({});
    await loading.present();
    this.taskProvider
      .getUserPunish(this.user.id)
      .take(1)
      .subscribe(
        (data) => (this.dangers = data.records),
        null,
        () => loading.dismiss(),
      );
  }

  openDangerDetail(danger: DangerVo) {
    console.log(danger);
    this.navCtrl.push(HiddenDangerPage, { danger });
  }
}

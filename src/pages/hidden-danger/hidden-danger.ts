import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from '../../providers/task-provider';
import { UserVo } from '../../models/user-vo';
import { Storage } from '@ionic/storage';
import { DangerVo } from '../../models/danger-vo';
import { ImagePreviewPage } from '../image-preview/image-preview';

/**
 * Generated class for the HiddenDangerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hidden-danger',
  templateUrl: 'hidden-danger.html',
})
export class HiddenDangerPage {
  danger: DangerVo;
  user: UserVo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private storage: Storage,
  ) {
    this.danger = this.navParams.get('danger');

    this.storage.get('user').then((u) => {
      this.user = u;
      // this.getData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiddenDangerPage');
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }

  finshPunish() {}
}

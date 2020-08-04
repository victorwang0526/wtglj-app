import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DangerVo } from '../../models/danger-vo';
import { ImagePreviewPage } from '../image-preview/image-preview';
import { DictDataVo } from '../../models/dict-data-vo';
import { TaskProvider } from '../../providers/task-provider';
import { Storage } from '@ionic/storage';
import { UserVo } from '../../models/user-vo';

@Component({
  selector: 'page-danger-approve',
  templateUrl: 'danger-approve.html',
})
export class DangerApprovePage {
  danger: DangerVo;
  dangerTypes: Array<DictDataVo> = [];
  punishTypes: Array<DictDataVo> = [];
  user: UserVo = null;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public taskProvider: TaskProvider,
    public navParams: NavParams,
  ) {
    this.storage.get('user').then((u) => {
      this.user = u;
    });
    this.danger = this.navParams.get('danger');

    this.getDangerTypes();
    this.getPunishTypes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DangerApprovePage');
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }

  approvePunish(p) {
    if (!this.user) {
      return;
    }
    this.taskProvider.approveDanger(p.id, this.user.id, p.remark).subscribe((res: any) => {
      p.reviewDate = res.reviewDate;
      p.reviewer = res.reviewer;
      p.reviewerName = res.reviewerName;
      console.log(res);
    });
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes().subscribe((datas: Array<DictDataVo>) => {
      this.dangerTypes = datas;
      for (let dt of datas) {
        if (dt.dictValue == this.danger.problemLevel) {
          this.danger.problemLevelLabel = dt.dictLabel;
          break;
        }
      }
    });
  }
  getPunishTypes() {
    this.taskProvider.getPunishTypes().subscribe((datas: Array<DictDataVo>) => {
      this.punishTypes = datas;
      for (let p of this.danger.punishesList) {
        for (let dt of datas) {
          if (dt.dictValue == p.punishType + '') {
            p.punishTypeLabel = dt.dictLabel;
            break;
          }
        }
      }
    });
  }
}

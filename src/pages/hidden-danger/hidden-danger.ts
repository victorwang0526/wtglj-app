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
  danger: any;
  user: UserVo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private storage: Storage,
  ) {
    this.danger = this.navParams.get('danger');
    // this.danger = {
    //   taskSubItemId: '',
    //   problemDesc: '',
    //   problemLevel: '',
    //   problemLevelLabel: '',
    //   problemImageUrls: '',
    //   imgLoading: false,
    //   remark: '',
    //   punishesList: [
    //     {
    //       id: 0,

    //       dangerId: 0,

    //       /**
    //        * 处罚类型,{0:关闭或取缔},{1,处罚金额,}{2:责令限期修改}{3:责令暂时停产}{4:立案处罚}{5:暂扣吊销证照}{6:追究刑事责任}
    //        */
    //       punishType: 1,
    //       punishTypeLabel: '',

    //       taskCheckId: 0,

    //       taskCheckItemId: 0,

    //       /**
    //        * 处罚缘由
    //        */
    //       punishReason: '',

    //       /**
    //        * 处罚金额
    //        */
    //       punishPrice: 0,

    //       /**
    //        * 处罚依据
    //        */
    //       punishBasis: '',

    //       /**
    //        * 整改标准
    //        */
    //       rectifyStandard: '',

    //       /**
    //        * 整改计划完成时间
    //        */
    //       rectifyPlanFinishDate: new Date(),

    //       /**
    //        * 企业整改完成时间
    //        */
    //       rectifyCompleteDate: new Date(),

    //       /**
    //        * 企业整改后照片
    //        */
    //       rectifyCompleteImagesUrls: '',

    //       /**
    //        * 整改描述
    //        */
    //       rectifyCompleteDesc: '',

    //       /** 整改结果 */
    //       remark: '',

    //       /**
    //        * 审核人
    //        */
    //       reviewer: 0,

    //       /**
    //        * 审核时间
    //        */
    //       reviewDate: new Date(),
    //     },
    //   ],
    // };
    this.storage.get('user').then((u) => {
      this.user = u;
      // this.getData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiddenDangerPage');
  }

  openPreview(imgUrl: '') {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }

  finshPunish() {}
}

import { Component, Input } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { PunishListPage } from '../punish-list/punish-list';
import { DangerVo } from '../../models/danger-vo';
import { DictDataVo } from '../../models/dict-data-vo';
import { TaskProvider } from '../../providers/task-provider';
import { UploadProvider } from '../../providers/upload-provider';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { PunishVo } from '../../models/punish-vo';
import { InspectSubItemVo } from '../../models/inspect-sub-item-vo';
import { TaskCheckVo } from '../../models/task-check-vo';
import { ImagePreviewPage } from '../image-preview/image-preview';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'page-danger-list',
  templateUrl: 'danger-list.html',
})
export class DangerListPage {
  taskCheck: TaskCheckVo;
  subItem: InspectSubItemVo;
  dangerTypes: Array<DictDataVo> = [];
  punishTypes: Array<DictDataVo> = [];

  dangers: Array<DangerVo> = [];

  constructor(
    public navCtrl: NavController,
    public taskProvider: TaskProvider,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public uploadProvider: UploadProvider,
    public datePipe: DatePipe,
    public loadingController: LoadingController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
  ) {
    this.subItem = navParams.get('subItem');
    this.taskCheck = navParams.get('taskCheck');
    if (!this.subItem.dangers || this.subItem.dangers.length == 0) {
      this.dangers = [];
      this.addDanger();
    } else {
      this.dangers = [...this.subItem.dangers];
    }
    this.getDangerTypes();
    this.getPunishTypes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DangerListPage');
  }

  openPunishPage() {
    this.navCtrl.push(PunishListPage, {});
  }

  async cameraChoose(danger: DangerVo) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            this.cameraOpen(PictureSourceType.CAMERA, danger);
          },
        },
        {
          text: '相册',
          icon: 'folder',
          handler: () => {
            this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM, danger);
          },
          // }, {
          //   text: 'test',
          //   handler: () => {
          //     const imageData = 'iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAzCDPIMRgycCRmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsgsEY19jWyvZ9bp5ZtP558v8QBTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwCETV0AEc4kCwAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAANaADAAQAAAABAAAANAAAAAD50QR6AAABA0lEQVRoBe2YMQ6EQAhFR2Np9gaWWtjZ7f0PsY23MPa7cRMbowkDOCD5NsYMDMN/CMaqG8ZvCnbVwfL5p4OknkIVpEDKUAGUn6H4WaFBKksuQ+Pmrtivtk1j319uv6xr+szz5bpkAeUnUa+kbyX5Sj8rsdyy0tjjKFjI8lNvFJvy72k6ilf0OSQpJFW0hgTBQEogXlFX1e6XO6P2TM9m1b7GuYcsP1VSHmbURjYkKSTFeWktfEDKQnVOTNXuhznFQUD0USWFOUVUnWOG7sdRzcInJCnRLzILCpSYIUkhKQp6DzYg5YEC5QwgRVHJgw1IeaBAOQNIUVTyYANSHihQzhCS1A9sAiT2ApsH7wAAAABJRU5ErkJggg==';
          //     this.uploadImg(imageData, subItem);
          //   }
        },
        {
          text: '取消',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  uploadImg(imageData: any, danger: DangerVo) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then((res) => res.blob())
      .then((blob) => {
        danger.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe(
          (src) => {
            if (!danger.problemImageUrls) {
              danger.problemImageUrls = src;
            } else {
              danger.problemImageUrls = danger.problemImageUrls + ',' + src;
            }
          },
          () => {},
          () => {
            danger.imgLoading = false;
          },
        );
      });
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }
  removeImg(danger: DangerVo, imgUrl: string) {
    danger.problemImageUrls = danger.problemImageUrls.replace(imgUrl + ',', '');
    danger.problemImageUrls = danger.problemImageUrls.replace(imgUrl, '');
  }

  cameraOpen(sourceType: number, danger: DangerVo) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.uploadImg(imageData, danger);
      },
      (err) => {
        // Handle error
      },
    );
  }

  addDanger() {
    let d = new DangerVo();
    d.taskSubItemId = this.subItem.id;
    this.addPunish(d);
    this.dangers.push(d);
  }

  removeDanger(d) {
    this.dangers.splice(this.dangers.indexOf(d), 1);
  }

  addPunish(d) {
    let p = new PunishVo();
    d.punishesList.push(p);
  }

  removePunish(d: DangerVo, p: PunishVo) {
    d.punishesList.splice(d.punishesList.indexOf(p), 1);
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes().subscribe((datas: Array<DictDataVo>) => {
      this.dangerTypes = datas;
      for (let dt of datas) {
        for (let d of this.dangers) {
          if (d.problemLevel == dt.dictValue) {
            d.problemLevelLabel = dt.dictLabel;
          }
        }
      }
    });
  }
  getPunishTypes() {
    this.taskProvider.getPunishTypes().subscribe((datas: Array<DictDataVo>) => {
      this.punishTypes = datas;
      for (let d of this.dangers) {
        for (let p of d.punishesList) {
          for (let pt of datas) {
            if (pt.dictValue == p.punishType + '') {
              p.punishTypeLabel = pt.dictLabel;
              break;
            }
          }
        }
      }
    });
  }

  getMin() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  submit() {
    if (this.dangers && this.dangers.length > 0) {
      for (let d of this.dangers) {
        if (!d.problemDesc) {
          this.alertCtrl
            .create({
              title: '请输入',
            })
            .present({});
          return;
        }
        if (!d.problemLevel) {
          this.alertCtrl
            .create({
              title: '请选择隐患等级',
            })
            .present({});
          return;
        }
        if (!d.punishesList || d.punishesList.length == 0) {
          this.alertCtrl
            .create({
              title: '请添加相关处罚',
            })
            .present({});
          return;
        }
        for (let p of d.punishesList) {
          if (!p.punishType) {
            this.alertCtrl
              .create({
                title: '请选择处罚类型',
              })
              .present({});
            return;
          }
        }
      }
    }
    this.subItem.dangers = this.dangers.map((item) => {
      item.problemDesc = item.remark;
      return item;
    });
    this.navCtrl.pop({});
  }

  async choosePunishLevel(p: PunishVo) {
    if (this.taskCheck.operatorId) {
      return;
    }
    let buttons = [];
    buttons.push({
      text: '无',
      handler: () => {
        p.punishType = null;
        p.punishTypeLabel = '';
      },
    });
    this.punishTypes.forEach((punishType) => {
      buttons.push({
        text: punishType.dictLabel,
        handler: () => {
          p.punishType = Number.parseInt(punishType.dictValue);
          p.punishTypeLabel = punishType.dictLabel;
        },
      });
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });
    const actionSheet = await this.actionSheetController.create({ buttons });
    await actionSheet.present();
  }
  async chooseLevel(danger: DangerVo) {
    if (this.taskCheck.operatorId) {
      return;
    }
    let buttons = [];
    this.dangerTypes.forEach((dangerType) => {
      buttons.push({
        text: dangerType.dictLabel,
        handler: () => {
          danger.problemLevel = dangerType.dictValue;
          danger.problemLevelLabel = dangerType.dictLabel;
        },
      });
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });
    const actionSheet = await this.actionSheetController.create({ buttons });
    await actionSheet.present();
  }
}

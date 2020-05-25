import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  Events,
  LoadingController,
  NavController,
  NavParams
} from 'ionic-angular';
import {EnterpriseSearchPage} from "../enterprise-search/enterprise-search";
import {TaskCheckVo} from "../../models/task-check-vo";
import {UserVo} from "../../models/user-vo";
import {MessageEvent} from "../../events/message-event";
import {Storage} from "@ionic/storage";
import {TaskProvider} from "../../providers/task-provider";
import {DictProvider} from "../../providers/dict-provider";
import {DictDataVo} from "../../models/dict-data-vo";
import {Camera, CameraOptions, PictureSourceType} from "@ionic-native/camera";
import {DangerVo} from "../../models/danger-vo";
import {ImagePreviewPage} from "../image-preview/image-preview";
import {UploadProvider} from "../../providers/upload-provider";
import {PunishVo} from "../../models/punish-vo";
import {DatePipe} from "@angular/common";
@Component({
  selector: 'page-daily-task',
  templateUrl: 'daily-task.html',
})
export class DailyTaskPage {
  taskCheck: TaskCheckVo = new TaskCheckVo();
  inspectTypes: Array<DictDataVo> = [];
  dangerTypes: Array<DictDataVo> = [];
  punishTypes: Array<DictDataVo> = [];
  editable: boolean = true;
  loading: boolean = false;

  dictFinish: boolean = false;
  dangerTypeFinish: boolean = false;
  punishTypeFinish: boolean = false;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              public taskProvider: TaskProvider,
              public actionSheetController: ActionSheetController,
              public event: Events,
              private dictProvider: DictProvider,
              public uploadProvider: UploadProvider,
              private camera: Camera,
              public datepipe: DatePipe,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public navParams: NavParams) {
    let tc = this.navParams.get('taskCheck');
    this.loading = true;
    if(tc) {
      this.taskCheck = tc;
      this.editable = false;
      this.getTaskCheck();
    }else {
      this.taskCheck.operateDate = new Date();
      this.getDict();
      this.getDangerTypes();
      this.getPunishTypes();
    }
  }

  getTaskCheck() {

    this.taskProvider.getTaskCheck(this.taskCheck.id).subscribe((data: any) => {
      this.taskCheck = data.data;
      this.getDict();
      this.getDangerTypes();
      this.getPunishTypes();
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyTaskPage');
  }

  openSearch() {
    if(this.taskCheck.operator) {
      return;
    }
    this.navCtrl.push(EnterpriseSearchPage, {taskCheck: this.taskCheck});
  }

  async submit() {
    if(!this.taskCheck.enterpriseName) {
      this.alertCtrl.create({
        title: '请填写完整'
      }).present({});
      return;
    }
    let currentDate: Date = new Date();
    let user: UserVo = await this.storage.get('user');
    this.taskCheck.operator = user.realName;
    this.taskCheck.operatorId = user.id;
    this.taskCheck.groupTitle = '日常检查 - '
      + this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    this.taskCheck.taskTitle = '日常检查 - '
      + this.datepipe.transform(currentDate, 'yyyy-MM-dd');

    this.taskCheck.startDate = currentDate;
    this.taskCheck.startEnd = currentDate;

    const loading = this.loadingController.create({
      spinner: 'circles',
      content: '提交中...',
      enableBackdropDismiss: false
    });
    loading.present({});
    this.taskProvider.submitTaskCheck(this.taskCheck).subscribe((res: any) => {
        if(res.code == 0) {
          this.event.publish(MessageEvent.MESSAGE_EVENT, new MessageEvent('提交成功！', 'success', true));
        }
      }, error => {},
      () => {
        loading.dismissAll();
      });
  }

  removeDanger(d) {
    this.taskCheck.dangers.splice(this.taskCheck.dangers.indexOf(d), 1);
  }

  async chooseInspectType() {
    if(this.taskCheck.operator) {
      return;
    }
    let buttons = [];
    this.inspectTypes.forEach(inspectType => {
      buttons.push({
        text: inspectType.dictLabel,
        handler: () => {
          this.taskCheck.inspectType = Number.parseInt(inspectType.dictValue);
          this.taskCheck.inspectTypeLabel = inspectType.dictLabel;
        }
      })
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({buttons});
    await actionSheet.present();
  }

  getDict() {
    this.dictProvider.getDicts('inspectType').subscribe((data) => {
      for(let item of data.data) {
        if(item.dictType == 'inspectType') {
          this.inspectTypes = item.dataList;
          if(this.taskCheck.inspectType) {
            for(let it of item.dataList) {
              if(this.taskCheck.inspectType+'' === it.dictValue) {
                this.taskCheck.inspectTypeLabel = it.dictLabel;
              }
            }
          }
        }
      }
      this.dictFinish = true;
      this.finishLoading();
    })
  }

  finishLoading() {
    this.loading = !(this.dictFinish && this.dangerTypeFinish && this.punishTypeFinish);
  }
  async chooseLevel(danger: DangerVo) {
    if(this.taskCheck.operator) {
      return;
    }
    let buttons = [];
    buttons.push({
      text: '无隐患',
      handler: () => {
        danger.problemLevel = '';
        danger.problemLevelLabel = '';
      }
    });
    this.dangerTypes.forEach(dangerType => {
      buttons.push({
        text: dangerType.dictLabel,
        handler: () => {
          danger.problemLevel = dangerType.dictValue;
          danger.problemLevelLabel = dangerType.dictLabel;
        }
      })
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({buttons});
    await actionSheet.present();
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, {imgUrl});
  }
  removeImg(danger: DangerVo, imgUrl: string) {
    danger.problemImageUrls = danger.problemImageUrls.replace(imgUrl + ',', '');
    danger.problemImageUrls = danger.problemImageUrls.replace(imgUrl, '');
  }

  addDanger() {
    let d = new DangerVo();
    this.taskCheck.dangers.push(d);
  }

  addPunish(d) {
    let p = new PunishVo();
    d.punishesList.push(p);
  }

  removePunish(d: DangerVo, p: PunishVo) {
    d.punishesList.splice(d.punishesList.indexOf(p), 1);
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes()
      .subscribe((datas: Array<DictDataVo>) => {
        this.dangerTypes = datas;
        if(this.taskCheck.operator) {
          for(let d of this.taskCheck.dangers) {
            for(let dt of datas) {
              if(d.problemLevel === dt.dictValue) {
                d.problemLevelLabel = dt.dictLabel;
                break;
              }
            }
          }
        }
        this.dangerTypeFinish = true;
        this.finishLoading();
      });
  }
  getPunishTypes() {
    this.taskProvider.getPunishTypes()
      .subscribe((datas: Array<DictDataVo>) => {
        this.punishTypes = datas;
        if(this.taskCheck.operator) {
          for(let d of this.taskCheck.dangers) {
            for(let p of d.punishesList) {
              for(let dt of datas) {
                if(p.punishType+'' === dt.dictValue) {
                  p.punishTypeLabel = dt.dictLabel;
                  break;
                }
              }
            }
          }
        }
        this.punishTypeFinish = true;
        this.finishLoading();
      });
  }

  async cameraChoose(danger: DangerVo) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '拍照',
        icon: 'camera',
        handler: () => {
          this.cameraOpen(PictureSourceType.CAMERA, danger);
        }
      }, {
        text: '相册',
        icon: 'folder',
        handler: () => {
          this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM, danger);
        }
        // }, {
        //   text: 'test',
        //   handler: () => {
        //     const imageData = 'iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAzCDPIMRgycCRmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsgsEY19jWyvZ9bp5ZtP558v8QBTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwCETV0AEc4kCwAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAANaADAAQAAAABAAAANAAAAAD50QR6AAABA0lEQVRoBe2YMQ6EQAhFR2Np9gaWWtjZ7f0PsY23MPa7cRMbowkDOCD5NsYMDMN/CMaqG8ZvCnbVwfL5p4OknkIVpEDKUAGUn6H4WaFBKksuQ+Pmrtivtk1j319uv6xr+szz5bpkAeUnUa+kbyX5Sj8rsdyy0tjjKFjI8lNvFJvy72k6ilf0OSQpJFW0hgTBQEogXlFX1e6XO6P2TM9m1b7GuYcsP1VSHmbURjYkKSTFeWktfEDKQnVOTNXuhznFQUD0USWFOUVUnWOG7sdRzcInJCnRLzILCpSYIUkhKQp6DzYg5YEC5QwgRVHJgw1IeaBAOQNIUVTyYANSHihQzhCS1A9sAiT2ApsH7wAAAABJRU5ErkJggg==';
        //     this.uploadImg(imageData, subItem);
        //   }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  uploadImg(imageData: any, danger: DangerVo) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then(res => res.blob())
      .then(blob => {
        danger.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe((src)=> {
          if(!danger.problemImageUrls) {
            danger.problemImageUrls = src;
          }else {
            danger.problemImageUrls = danger.problemImageUrls + ',' + src;
          }
        }, () => {}, () => {
          danger.imgLoading = false;
        })
      });
  }

  cameraOpen(sourceType: number, danger: DangerVo) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImg(imageData, danger);
    }, (err) => {
      // Handle error
    });
  }

  async choosePunishLevel(p: PunishVo) {
    if(this.taskCheck.operator) {
      return;
    }
    let buttons = [];
    buttons.push({
      text: '无',
      handler: () => {
        p.punishType = null;
        p.punishTypeLabel = '';
      }
    });
    this.punishTypes.forEach(punishType => {
      buttons.push({
        text: punishType.dictLabel,
        handler: () => {
          p.punishType = Number.parseInt(punishType.dictValue);
          p.punishTypeLabel = punishType.dictLabel;
        }
      })
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({buttons});
    await actionSheet.present();
  }
}

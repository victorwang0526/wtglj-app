import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  Events,
  LoadingController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { EnterpriseSearchPage } from '../enterprise-search/enterprise-search';
import { TaskCheckVo } from '../../models/task-check-vo';
import { UserVo } from '../../models/user-vo';
import { MessageEvent } from '../../events/message-event';
import { Storage } from '@ionic/storage';
import { TaskProvider } from '../../providers/task-provider';
import { DictProvider } from '../../providers/dict-provider';
import { DictDataVo } from '../../models/dict-data-vo';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { DangerVo } from '../../models/danger-vo';
import { ImagePreviewPage } from '../image-preview/image-preview';
import { UploadProvider } from '../../providers/upload-provider';
import { PunishVo } from '../../models/punish-vo';
import { DatePipe } from '@angular/common';
import { InspectVo } from '../../models/inspect-vo';
import { InspectSubItemVo } from '../../models/inspect-sub-item-vo';
import { DangerListPage } from '../danger-list/danger-list';
import { TaskCheckItemVo } from '../../models/task-check-item-vo';
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

  inspects: Array<InspectVo> = [];
  taskCheckItems: Array<TaskCheckItemVo> = [];
  user: UserVo;
  operators: any[] = [];
  principals: any[] = [];

  constructor(
    public navCtrl: NavController,
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
    public navParams: NavParams,
  ) {
    let tc = this.navParams.get('taskCheck');
    this.storage.get('user').then((u) => {
      this.user = u;
      this.principals.push(this.user.id);
      this.init(tc);
    });
  }

  async init(tc) {
    this.loading = true;
    if (tc) {
      this.taskCheck = tc;
      this.editable = false;
      this.getTaskCheck();

      const inspectVo = await this.taskProvider.getInspectDetail(this.taskCheck.inspectId);

      this.taskCheckItems = await this.taskProvider.getTaskCheckItems(this.taskCheck.id);
      //init data
      if (this.taskCheckItems && this.taskCheckItems.length > 0) {
        for (let checkItem of this.taskCheckItems) {
          for (let subItem of inspectVo.subItems) {
            if (checkItem.subItemId == subItem.id) {
              subItem.remark = checkItem.remark;
              subItem.checked = checkItem.subItemsChecked;
              subItem.imageUrls = checkItem.subItemsImageUrls;
              subItem.dangers = checkItem.dangers;
            }
          }
        }
      }
      this.taskCheck.inspect = inspectVo;
    } else {
      this.taskCheck.operateDate = new Date();
      this.getDict();
      this.getInspects();
      this.getDangerTypes();
      this.getPunishTypes();
    }
    this.getGroupUsers();
    !this.editable && this.getPrincipals();
    this.loading = false;
  }

  getInspects() {
    this.taskProvider.getInspects().subscribe((data: any) => {
      this.inspects = data;
    });
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
    if (this.taskCheck.operator) {
      return;
    }
    this.navCtrl.push(EnterpriseSearchPage, { taskCheck: this.taskCheck });
  }

  async submit() {
    if (!this.taskCheck.enterpriseName) {
      this.alertCtrl
        .create({
          title: '请填写企业名称',
        })
        .present({});
      return;
    }
    if (!this.taskCheck.inspectType) {
      this.alertCtrl
        .create({
          title: '请选择检查类型',
        })
        .present({});
      return;
    }
    if (this.principals.length === 0) {
      this.alertCtrl
        .create({
          title: '选择检查人员',
        })
        .present({});
      return;
    }

    if (this.taskCheck.dangers && this.taskCheck.dangers.length > 0) {
      for (let d of this.taskCheck.dangers) {
        // if (!d.problemDesc) {
        //   this.alertCtrl
        //     .create({
        //       title: '请输入问题表现',
        //     })
        //     .present({});
        //   return;
        // }
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
    let currentDate: Date = new Date();
    // let user: UserVo = await this.storage.get('user');
    this.taskCheck.operator = this.user.realName;
    this.taskCheck.operatorId = this.user.id;
    this.taskCheck.groupTitle = '日常检查 - ' + this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    this.taskCheck.taskTitle = '日常检查 - ' + this.datepipe.transform(currentDate, 'yyyy-MM-dd');

    this.taskCheck.startDate = this.datepipe.transform(currentDate, 'yyyy-MM-dd hh:mm:ss');
    this.taskCheck.startEnd = this.datepipe.transform(currentDate, 'yyyy-MM-dd hh:mm:ss');

    if (this.taskCheck.inspect) {
      for (let subItem of this.taskCheck.inspect.subItems) {
        if (!subItem.dangers || subItem.dangers.length == 0) {
          continue;
        }
        this.taskCheck.dangers.push(...subItem.dangers);
      }
    }

    if (this.taskCheck.dangers && this.taskCheck.dangers.length > 0) {
      this.taskCheck.status = 0;
      this.taskCheck.dangers.forEach((item) => (item.problemDesc = item.remark));
    } else {
      this.taskCheck.status = 3;
    }
    this.taskCheck.principals = this.principals.join(',');

    const loading = this.loadingController.create({
      spinner: 'circles',
      content: '提交中...',
      enableBackdropDismiss: false,
    });
    loading.present({});
    this.taskProvider.submitTaskCheck(this.taskCheck).subscribe(
      (res: any) => {
        if (res.code == 0) {
          this.event.publish(
            MessageEvent.MESSAGE_EVENT,
            new MessageEvent('提交成功！', 'success', true),
          );
        }
      },
      (error) => {},
      () => {
        loading.dismissAll();
      },
    );
  }

  removeDanger(d) {
    this.taskCheck.dangers.splice(this.taskCheck.dangers.indexOf(d), 1);
  }

  async chooseInspectType() {
    if (this.taskCheck.operator) {
      return;
    }
    if (this.inspectTypes && this.inspectTypes.length < 2) {
      return;
    }
    let buttons = [];
    this.inspectTypes.forEach((inspectType) => {
      buttons.push({
        text: inspectType.dictLabel,
        handler: () => {
          this.taskCheck.inspectType = Number.parseInt(inspectType.dictValue);
          this.taskCheck.inspectTypeLabel = inspectType.dictLabel;
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

  async chooseInspects() {
    let buttons = [];
    this.inspects.forEach((inspect: InspectVo) => {
      buttons.push({
        text: inspect.title,
        handler: () => {
          this.chooseInspect(inspect);
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

  async chooseInspect(inspect: InspectVo) {
    this.taskCheck.inspectTitle = inspect.title;
    this.taskCheck.inspectId = inspect.id;
    this.taskCheck.inspect = inspect;

    this.taskCheck.inspect = await this.taskProvider.getInspectDetail(this.taskCheck.inspectId);
    this.taskCheckItems = await this.taskProvider.getTaskCheckItems(this.taskCheck.id);
    //init data
    if (this.taskCheckItems && this.taskCheckItems.length > 0) {
      for (let checkItem of this.taskCheckItems) {
        for (let subItem of this.taskCheck.inspect.subItems) {
          if (checkItem.subItemId == subItem.id) {
            subItem.remark = checkItem.remark;
            subItem.checked = checkItem.subItemsChecked;
            subItem.imageUrls = checkItem.subItemsImageUrls;
            subItem.dangers = checkItem.dangers;
          }
        }
      }
    }
    this.loading = false;
  }

  checkItem(subItem: InspectSubItemVo, checkedValue: any) {
    subItem.checked = checkedValue;
  }

  openDangerList(subItem) {
    this.navCtrl.push(DangerListPage, { subItem, taskCheck: this.taskCheck });
  }

  async cameraChooseSub(subItem: InspectSubItemVo) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            this.cameraOpenSub(PictureSourceType.CAMERA, subItem);
          },
        },
        {
          text: '相册',
          icon: 'folder',
          handler: () => {
            this.cameraOpenSub(PictureSourceType.SAVEDPHOTOALBUM, subItem);
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

  removeImgSub(subItem: InspectSubItemVo, imgUrl: string) {
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl + ',', '');
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl, '');
    console.log(subItem.imageUrls);
  }

  cameraOpenSub(sourceType: number, subItem: InspectSubItemVo) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.uploadImgSub(imageData, subItem);
      },
      (err) => {
        // Handle error
      },
    );
  }

  uploadImgSub(imageData: any, subItem: InspectSubItemVo) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then((res) => res.blob())
      .then((blob) => {
        subItem.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe(
          (src) => {
            if (!subItem.imageUrls) {
              subItem.imageUrls = src;
            } else {
              subItem.imageUrls = subItem.imageUrls + ',' + src;
            }
          },
          () => {},
          () => {
            subItem.imgLoading = false;
          },
        );
      });
  }

  getDict() {
    this.dictProvider.getDicts('inspectType').subscribe((data) => {
      for (let item of data.data) {
        if (item.dictType == 'inspectType') {
          let its = [];
          for (let it of item.dataList) {
            if (it.dictValue != '2' && it.dictValue != '1') {
              its.push(it);
            }
          }
          this.inspectTypes = its;

          if (this.taskCheck.inspectType) {
            for (let it of item.dataList) {
              if (this.taskCheck.inspectType + '' === it.dictValue) {
                this.taskCheck.inspectTypeLabel = it.dictLabel;
              }
            }
          } else {
            if (this.inspectTypes && this.inspectTypes.length > 0) {
              this.taskCheck.inspectType = this.inspectTypes[0].dictValue;
              this.taskCheck.inspectTypeLabel = this.inspectTypes[0].dictLabel;
            }
          }
        }
      }
      this.dictFinish = true;
      this.finishLoading();
    });
  }

  finishLoading() {
    this.loading = !(this.dictFinish && this.dangerTypeFinish && this.punishTypeFinish);
  }
  async chooseLevel(danger: DangerVo) {
    if (this.taskCheck.operator) {
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

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
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
    this.taskProvider.getDangerTypes().subscribe((datas: Array<DictDataVo>) => {
      this.dangerTypes = datas;
      if (this.taskCheck.operator) {
        for (let d of this.taskCheck.dangers) {
          for (let dt of datas) {
            if (d.problemLevel === dt.dictValue) {
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
    this.taskProvider.getPunishTypes().subscribe((datas: Array<DictDataVo>) => {
      this.punishTypes = datas;
      console.log(datas);

      if (this.taskCheck.operator) {
        for (let d of this.taskCheck.dangers) {
          for (let p of d.punishesList) {
            for (let dt of datas) {
              if (p.punishType + '' === dt.dictValue) {
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

  async choosePunishLevel(p: PunishVo) {
    if (this.taskCheck.operator) {
      return;
    }
    let buttons = [];
    // buttons.push({
    //   text: '无',
    //   handler: () => {
    //     p.punishType = null;
    //     p.punishTypeLabel = '';
    //   },
    // });
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

  getGroupUsers() {
    this.taskProvider.getGroupUsers(this.user.dept).subscribe((users) => {
      this.operators = users;
    });
  }

  getPrincipals() {
    this.taskProvider.getPrincipals(this.taskCheck.id).subscribe((data) => {
      this.principals = Array.from(new Set([data.operatorId, ...data.principalIds]));
      console.log(this.principals);
    });
  }
}

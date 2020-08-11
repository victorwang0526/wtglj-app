import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  Events,
  LoadingController,
  NavController,
  NavParams,
  ModalController,
} from 'ionic-angular';
import { TaskCheckVo } from '../../models/task-check-vo';
import { TaskProvider } from '../../providers/task-provider';
import { InspectVo } from '../../models/inspect-vo';
import { InspectSubItemVo } from '../../models/inspect-sub-item-vo';
import { MessageEvent } from '../../events/message-event';
import { Storage } from '@ionic/storage';
import { UserVo } from '../../models/user-vo';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { TaskCheckItemVo } from '../../models/task-check-item-vo';
import { UploadProvider } from '../../providers/upload-provider';
import { ImagePreviewPage } from '../image-preview/image-preview';
import { DictDataVo } from '../../models/dict-data-vo';
import { DangerListPage } from '../danger-list/danger-list';
import { SignaturePage } from '../signature/signature';
import { EnterpriseVo } from '../../models/enterprise-vo';
import { UserProvider } from '../../providers/user-provider';
import { CallNumber } from '@ionic-native/call-number';
import { TaskGroupVo } from '../../models/task-group-vo';

@Component({
  selector: 'page-inspect-task-check-detail',
  templateUrl: 'inspect-task-check-detail.html',
})
export class InspectTaskCheckDetailPage {
  taskCheck: TaskCheckVo;
  inspect: InspectVo;
  loading: boolean = false;
  taskCheckItems: Array<TaskCheckItemVo> = [];
  group: TaskGroupVo;

  dangerTypes: Array<DictDataVo> = [];
  punishTypes: Array<DictDataVo> = [];

  editable: boolean = false;
  enterprise: EnterpriseVo;
  operators: any[] = [];

  user: UserVo;

  principals: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    private storage: Storage,
    public taskProvider: TaskProvider,
    public alertCtrl: AlertController,
    public uploadProvider: UploadProvider,
    public loadingController: LoadingController,
    private camera: Camera,
    private callNumber: CallNumber,
    private userProvider: UserProvider,
    public actionSheetController: ActionSheetController,
    public model: ModalController,
  ) {
    this.taskCheck = navParams.get('taskCheck');
    this.group = navParams.get('group');
    this.taskCheck.isUnion = this.taskCheck.unionDepts != null;
    this.storage.get('user').then((u) => {
      this.user = u;
      this.init();
      this.principals.push(this.user.id);
      console.log(this.principals);
    });
  }

  async init() {
    this.editable = this.taskCheck.inspectType == 1 && !this.taskCheck.operateDate;

    this.getDangerTypes();
    this.getPunishTypes();
    this.getGroupUsers();
    !this.editable && this.getPrincipals();

    this.loading = true;
    this.inspect = await this.taskProvider.getInspectDetail(this.taskCheck.inspectId);
    this.taskCheckItems = await this.taskProvider.getTaskCheckItems(this.taskCheck.id);
    //init data
    if (this.taskCheckItems && this.taskCheckItems.length > 0) {
      for (let checkItem of this.taskCheckItems) {
        for (let subItem of this.inspect.subItems) {
          if (checkItem.subItemId == subItem.id) {
            subItem.remark = checkItem.remark;
            subItem.checked = checkItem.subItemsChecked;
            subItem.imageUrls = checkItem.subItemsImageUrls;
            subItem.dangers = checkItem.dangers;
          }
        }
      }
    }

    this.enterprise = await this.userProvider.getEnterpriseById(this.taskCheck.enterpriseId);
    this.loading = false;
  }

  async openSignature() {
    this.navCtrl.push(SignaturePage, { taskCheck: this.taskCheck });
  }

  openDangerList(subItem) {
    this.navCtrl.push(DangerListPage, { subItem, taskCheck: this.taskCheck });
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes().subscribe((datas: Array<DictDataVo>) => {
      this.dangerTypes = datas;
    });
  }

  getPunishTypes() {
    this.taskProvider.getPunishTypes().subscribe((datas: Array<DictDataVo>) => {
      this.punishTypes = datas;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckDetailPage');
  }
  async cameraChoose(subItem: InspectSubItemVo) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            this.cameraOpen(PictureSourceType.CAMERA, subItem);
          },
        },
        {
          text: '相册',
          icon: 'folder',
          handler: () => {
            this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM, subItem);
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

  async chooseIsUnion() {
    if (!this.editable) {
      return;
    }
    let buttons = [];
    buttons.push(
      {
        text: '是',
        handler: () => {
          this.taskCheck.isUnion = true;
          this.taskCheck.unionDepts = '';
          this.taskCheck.unionUser = '';
        },
      },
      {
        text: '否',
        handler: () => {
          this.taskCheck.isUnion = false;
          this.taskCheck.unionDepts = '';
          this.taskCheck.unionUser = '';
        },
      },
    );
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

  async chooseDangerType() {
    if (this.taskCheck.operateDate) {
      return;
    }
    let buttons = [];
    this.dangerTypes.forEach((dangerType) => {
      buttons.push({
        text: dangerType.dictLabel,
        handler: () => {
          this.taskCheck.dangerType = dangerType.dictValue;
          this.taskCheck.dangerTypeLabel = dangerType.dictLabel;
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

  async choosePunishType() {
    if (this.taskCheck.operateDate) {
      return;
    }
    let buttons = [];
    // buttons.push({
    //   text: '无',
    //   handler: () => {
    //     this.taskCheck.punishType = '';
    //     this.taskCheck.punishTypeLabel = '';
    //     console.log(this.taskCheck.punishType + ', ' + this.taskCheck.punishTypeLabel);
    //   },
    // });
    this.punishTypes.forEach((punishType) => {
      buttons.push({
        text: punishType.dictLabel,
        handler: () => {
          this.taskCheck.punishType = punishType.dictValue;
          this.taskCheck.punishTypeLabel = punishType.dictLabel;
          console.log(this.taskCheck.punishType + ', ' + this.taskCheck.punishTypeLabel);
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

  uploadImg(imageData: any, subItem: InspectSubItemVo) {
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

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }

  removeImg(subItem: InspectSubItemVo, imgUrl: string) {
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl + ',', '');
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl, '');
    console.log(subItem.imageUrls);
  }

  cameraOpen(sourceType: number, subItem: InspectSubItemVo) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.uploadImg(imageData, subItem);
      },
      (err) => {
        // Handle error
      },
    );
  }

  async submit() {
    console.log(this.principals);
    for (let subItem of this.inspect.subItems) {
      if (!subItem.checked) {
        this.alertCtrl
          .create({
            title: '请填写完整',
          })
          .present({});
        return;
      }
    }

    if (this.taskCheck.isUnion) {
      if (!this.taskCheck.unionDepts || !this.taskCheck.unionUser) {
        this.alertCtrl
          .create({
            title: '请填联合执法信息',
          })
          .present({});
        return;
      }
    }

    if (this.principals.length === 0) {
      this.alertCtrl
        .create({
          title: '选择检查人员',
        })
        .present({});
      return;
    }

    let user: UserVo = await this.storage.get('user');
    this.taskCheck.operator = user.realName;
    this.taskCheck.operatorId = user.id;
    this.taskCheck.operateDate = new Date();
    this.taskCheck.inspect = this.inspect;
    this.taskCheck.principals = this.principals.join(',');
    this.taskCheck.dangers = [];
    for (let subItem of this.inspect.subItems) {
      if (!subItem.dangers || subItem.dangers.length == 0) {
        continue;
      }
      this.taskCheck.dangers.push(...subItem.dangers);
    }
    const loading = this.loadingController.create({
      spinner: 'circles',
      content: '提交中...',
      enableBackdropDismiss: false,
    });
    loading.present({});
    this.taskProvider.submitTaskCheck(this.taskCheck).subscribe(
      (res: any) => {
        if (res.code == 0) {
          this.group.finished = this.group.finished + 1;
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

  getItems(items: string) {
    let titems = [];
    // [xxxx(1,2,3)][yyyy(1,3,5)]
    let x = items.split('】');
    // [xxxx(1,2,3)
    // [yyyy(1,3,5)
    for (let i = 0; i < x.length; i++) {
      let x1 = x[i].replace('【', '');
      if (!x1 || x1.trim() == '') {
        continue;
      }
      let x2 = x1.replace('）', '');
      //xxx(1,2,3
      let y = x2.split('（');
      // xxx
      // 1,2,3
      titems.push({ title: y[0], items: y[1].split('，') });
    }
    return titems;
  }

  checkItem(subItem: InspectSubItemVo, checkedValue: any) {
    subItem.checked = checkedValue;
  }

  checkItemM(subItem: InspectSubItemVo, checkedValue: any) {
    if (!subItem.checked) {
      subItem.checked = '';
    }
    if (subItem.checked.indexOf(checkedValue) > -1) {
      subItem.checked = subItem.checked.replace(checkedValue + ',', '');
    } else {
      subItem.checked = subItem.checked + checkedValue + ',';
    }
    console.log(JSON.stringify(subItem));
  }

  isChecked(subItem: InspectSubItemVo, currentValue: any): boolean {
    if (!subItem.checked) {
      return false;
    }
    return subItem.checked.indexOf(currentValue) > -1;
  }

  /**
   * Turn base 64 image into a blob, so we can send it using multipart/form-data posts
   * @param b64Data
   * @param contentType
   * @param sliceSize
   * @return {Blob}
   */
  private getBlob(b64Data: string, contentType: string, sliceSize: number = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async openEnterpriseDetail() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '' + this.enterprise.name,
          handler: () => {
            this.call(this.enterprise);
          },
        },
        {
          text: '' + this.enterprise.contact,
          handler: () => {
            this.call(this.enterprise);
          },
        },
        {
          text: '' + this.enterprise.mobile,
          handler: () => {
            this.call(this.enterprise);
          },
        },
        {
          text: '' + this.enterprise.address,
          handler: () => {
            this.call(this.enterprise);
          },
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

  call(enterprise: EnterpriseVo) {
    this.callNumber
      .callNumber(enterprise.mobile, true)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  getGroupUsers() {
    this.taskProvider
      .getGroupUsers(this.user.dept)
      .take(1)
      .subscribe((users) => (this.operators = users));
  }

  getPrincipals() {
    this.taskProvider.getPrincipals(this.taskCheck.id).subscribe((data) => {
      this.principals = Array.from(new Set([data.operatorId, ...data.principalIds]));
      console.log(this.principals);
    });
  }
}

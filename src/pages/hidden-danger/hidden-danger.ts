import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { TaskProvider } from '../../providers/task-provider';
import { UserVo } from '../../models/user-vo';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { ImagePreviewPage } from '../image-preview/image-preview';
import { UploadProvider } from '../../providers/upload-provider';
import { DictDataVo } from '../../models/dict-data-vo';
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
  danger: any = {
    problemLevel: '1',
    problemLevelLabel: '一般隐患',
  };
  user: UserVo;
  imgUrls: string[] = [];
  imgLoading: boolean = false;
  rectifyCompleteDesc = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public uploadProvider: UploadProvider,
    public loadingController: LoadingController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
  ) {
    this.getPunishTypes();
    this.getDangerTypes();
    this.danger = this.navParams.get('danger');
    this.imgUrls =
      (this.danger.rectifyCompleteImagesUrls && this.danger.rectifyCompleteImagesUrls.split(',')) ||
      [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiddenDangerPage');
  }

  async cameraChoose() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            this.cameraOpen(PictureSourceType.CAMERA);
          },
        },
        {
          text: '相册',
          icon: 'folder',
          handler: () => {
            this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM);
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

  uploadImg(imageData: any) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then((res) => res.blob())
      .then((blob) => {
        this.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe(
          (src) => {
            this.imgUrls.push(src);
          },
          () => {},
          () => {
            this.imgLoading = false;
          },
        );
      });
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, { imgUrl });
  }

  removeImg(index: number) {
    this.imgUrls.splice(index, 1);
  }

  cameraOpen(sourceType: number) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.uploadImg(imageData);
      },
      (err) => {
        // Handle error
      },
    );
  }

  getPunishTypes() {
    this.taskProvider.getPunishTypes().subscribe((datas: Array<DictDataVo>) => {
      this.danger.punishTypeLabel = datas.find(
        (data) => data.dictValue === this.danger.punishType + '',
      ).dictLabel;
    });
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes().subscribe((datas: Array<DictDataVo>) => {
      this.danger.problemLevelLabel = datas.find(
        (data) => data.dictValue === this.danger.problemLevel + '',
      ).dictLabel;
    });
  }

  finshPunish() {
    const params = [
      {
        id: this.danger.id,
        rectifyCompleteDesc: this.rectifyCompleteDesc,
        rectifyCompleteImagesUrls: this.imgUrls.join(','),
      },
    ];
    this.taskProvider
      .finishPunishes({ punishesList: params })
      .subscribe(() => this.navCtrl.popToRoot());
  }
}

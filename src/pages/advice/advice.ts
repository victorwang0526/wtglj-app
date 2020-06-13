import { Component } from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SuggestionProvider} from "../../providers/suggestion-provider";
import {Camera, CameraOptions, PictureSourceType} from "@ionic-native/camera";
import {ImagePreviewPage} from "../image-preview/image-preview";
import {UploadProvider} from "../../providers/upload-provider";

@Component({
  selector: 'page-advice',
  templateUrl: 'advice.html',
})
export class AdvicePage {

  remark: string = '';
  imgUrls: string = '';
  imgLoading: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public suggestionProvider: SuggestionProvider,
              public uploadProvider: UploadProvider,
              public loadingController: LoadingController,
              private camera: Camera,
              public actionSheetController: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvicePage');
  }

  async submit() {
    if(!this.remark) {
      const alert = await this.alertCtrl.create({
        message: '请输入建议.',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    this.suggestionProvider.submit(this.remark, this.imgUrls)
      .subscribe((res) => {
        this.alertSuccess();
      })
  }

  async alertSuccess() {
    const alert = await this.alertCtrl.create({
      message: '提交成功.',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.navCtrl.pop({});
          }
        }
      ]
    });
    await alert.present();
  }

  async cameraChoose() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '拍照',
        icon: 'camera',
        handler: () => {
          this.cameraOpen(PictureSourceType.CAMERA);
        }
      }, {
        text: '相册',
        icon: 'folder',
        handler: () => {
          this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM);
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

  uploadImg(imageData: any) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then(res => res.blob())
      .then(blob => {
        this.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe((src)=> {
          if(!this.imgUrls) {
            this.imgUrls = src;
          }else {
            this.imgUrls = this.imgUrls + ',' + src;
          }
        }, () => {}, () => {
          this.imgLoading = false;
        })
      });
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, {imgUrl});
  }
  removeImg(imgUrl: string) {
    this.imgUrls = this.imgUrls.replace(imgUrl + ',', '');
    this.imgUrls = this.imgUrls.replace(imgUrl, '');
  }

  cameraOpen(sourceType: number) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImg(imageData);
    }, (err) => {
      // Handle error
    });
  }
}

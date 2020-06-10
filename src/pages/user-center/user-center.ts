import { Component } from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {UserVo} from "../../models/user-vo";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {Camera, CameraOptions, PictureSourceType} from "@ionic-native/camera";
import {UploadProvider} from "../../providers/upload-provider";
import {ImagePreviewPage} from "../image-preview/image-preview";
import {UserProvider} from "../../providers/user-provider";

@Component({
  selector: 'page-user-center',
  templateUrl: 'user-center.html',
})
export class UserCenterPage {
  user: UserVo = null;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage: Storage,
              public uploadProvider: UploadProvider,
              public userService: UserProvider,
              private camera: Camera,
              public alertController: AlertController,
              public toastController: ToastController,
              public actionSheetController: ActionSheetController,) {

  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe((res: any) => {
      this.storage.set('user', res.data);
      this.user = res.data;
    });
  }

  ionViewDidLoad() {
    this.getUserInfo();

    console.log('ionViewDidLoad UserCenterPage');
  }
  logout() {
    this.storage.clear();
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage, {});
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async changePsd() {
    const _ts = this;
    const alert = await this.alertController.create({
      inputs: [
        {
          type: 'password',
          label: '新密码',
          placeholder: '新密码',
          value: '',
        },

        {
          type: 'password',
          label: '确认新密码',
          placeholder: '确认新密码',
          value: '',
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (res) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '确定',
          handler: (res) => {
            _ts.user.password = res[0];
            _ts.user.confirmPassword = res[1];
            if(!_ts.user.password || _ts.user.password != _ts.user.confirmPassword) {
              _ts.presentToast('密码不一致，请重新输入');
              return false;
            }
            if(_ts.user.password.length < 6) {
              _ts.presentToast('密码至少输入6位');
              return false;
            }
            _ts.userService.updateUser(_ts.user).subscribe(res => {
              console.log(res);
              _ts.presentToast('密码修改成功');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  uploadImg(imageData: any) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProvider.upload(blob).subscribe((src)=> {
          this.user.avatar = src;
          this.userService.updateUser(this.user).subscribe(res => {
            console.log(res);
          });
          this.storage.set('user', this.user);
        }, () => {}, () => {
        })
      });
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, {imgUrl});
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

}

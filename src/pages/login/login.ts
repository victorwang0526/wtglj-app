import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UserProvider } from '../../providers/user-provider';
import { HomePage } from '../home/home';
import { JPush } from '@jiguang-ionic/jpush';
import { RegiserPage } from '../regiser/regiser';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string = '';
  password: string = '';
  deviceId: string = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public userService: UserProvider,
    public jpush: JPush,
    public loadingController: LoadingController,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
  ) {
    this.jpush.getRegistrationID().then((deviceId) => {
      this.deviceId = deviceId;
    });
  }

  async login() {
    if (!this.username || !this.password) {
      this.alertCtrl.create({ title: '请输入用户名密码' }).present({});
      return;
    }
    const loading = await this.loadingController.create({});
    await loading.present();
    this.userService.login(this.username, this.password, this.deviceId).subscribe(
      (res) => {
        if (res.code != 0) {
          this.alertCtrl.create({ title: res.msg }).present({});
          return;
        }
        localStorage.setItem('token', res.data.token);
        this.getUserInfo();
      },
      (error) => {
        this.alertCtrl
          .create({ message: '登录异常，请稍后再试.' + JSON.stringify(error) })
          .present({});
      },
      () => {
        loading.dismiss();
      },
    );
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe((res: any) => {
      this.storage.set('user', res.data);
      this.navCtrl.setRoot(HomePage);
    });
  }

  openQr() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        let uid = barcodeData.text;

        if (!uid) {
          this.alertCtrl.create({ message: '二维码不正确，请重新扫描' }).present({});
          return;
        }
      })
      .catch((err) => {
        this.alertCtrl.create({ title: JSON.stringify(err) }).present({});
      });
  }

  register() {
    this.navCtrl.setRoot(RegiserPage);
  }

  goPassword() {
    this.navCtrl.setRoot(ForgotPasswordPage);
  }
}

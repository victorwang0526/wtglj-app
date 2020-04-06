import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {UserProvider} from "../../providers/user/user";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public userService: UserProvider,
              public loadingController: LoadingController,
              private storage: Storage,
              private barcodeScanner: BarcodeScanner) {
  }

  async login() {
    if(!this.username || !this.password) {
      this.alertCtrl.create({title: '请输入用户名密码'}).present({});
      return;
    }
    const loading = await this.loadingController.create({});
    await loading.present();
    this.userService.login(this.username, this.password)
      .subscribe((res) => {
        if(!res.success) {
          this.alertCtrl.create({title: res.errorMessage}).present({});
          return;
        }
        this.storage.set('user', res.data);
        this.navCtrl.setRoot(HomePage);
      }, error => {
        this.alertCtrl.create({message: JSON.stringify(error)}).present({});
      }, () => {
        loading.dismiss();
      })
  }

  openQr() {
    this.barcodeScanner.scan().then(barcodeData => {
      let uid = barcodeData.text;

      if(!uid) {
        this.alertCtrl.create({message: '二维码不正确，请重新扫描'}).present({});
        return;
      }

    }).catch(err => {
      this.alertCtrl.create({title: JSON.stringify(err)}).present({});
    });
  }
}

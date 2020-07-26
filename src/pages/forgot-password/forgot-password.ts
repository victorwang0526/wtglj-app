import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RegiterProvider } from '../../providers/regiter-provider';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  data: any = {
    realName: null,
    username: null,
    password: null,
    confirmPassword: null,
    verificationCode: null,
  };
  text: string | number = '获取验证码';
  disabled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public registerProvider: RegiterProvider,
    public alertCtrl: AlertController,
  ) {}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  async getCode() {
    if (this.data.username) {
      this.disabled = true;
      this.registerProvider.getCode(this.data.username).subscribe(() => this.countdown());
    } else {
      const alert = this.alertCtrl.create({
        message: '请输入手机号.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  }

  countdown(time = 60) {
    this.text = time;
    const timer = setInterval(() => {
      this.text = time--;
      if (time === 0) {
        clearInterval(timer);
        this.text = '获取验证码';
        this.disabled = false;
      }
    }, 1000);
  }

  onSubmit() {
    this.registerProvider.forgot(this.data).subscribe(async (data: any) => {
      if (data.code === 0) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        const alert = this.alertCtrl.create({
          message: data.message,
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
    });
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Register } from '../../models/register-vo';
import { RegiterProvider } from '../../providers/regiter-provider';
import { LoginPage } from '../login/login';
import { ExerciseDetailPage } from '../exercise-detail/exercise-detail';

/**
 * Generated class for the RegiserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-regiser',
  templateUrl: 'regiser.html',
})
export class RegiserPage {
  data: Register = {
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
    console.log('ionViewDidLoad RegiserPage');
  }

  getCode() {
    if (this.data.username) {
      this.disabled = true;
      this.registerProvider.getCode(this.data.username).subscribe(() => this.countdown());
    } else {
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

  register() {
    const params = {
      ...this.data,
      realName: this.data.username,
      confirmPassword: this.data.password,
    };
    this.registerProvider.register(params).subscribe(async (data: any) => {
      if (data.code === 0) {
        this.navCtrl.setRoot(ExerciseDetailPage);
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

  goLogin() {
    this.navCtrl.setRoot(LoginPage);
  }
}

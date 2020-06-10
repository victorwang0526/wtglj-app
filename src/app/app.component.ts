import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {MessageEvent} from "../events/message-event";
import {JPush} from "@jiguang-ionic/jpush";
import {AppVersionVo} from "../models/app-version-vo";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {AppVersion} from "@ionic-native/app-version";
import {PgyProvider} from "../providers/pgy-provider";
import {UserProvider} from "../providers/user-provider";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;
  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private storage: Storage,
              private iab: InAppBrowser,
              private appVersion: AppVersion,
              public userService: UserProvider,
              public pygService: PgyProvider,
              public event: Events,
              public jpush: JPush,
              public alertController: AlertController) {
    this.initRoot();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();

      if(this.platform.is('android')) {
        this.getVersion('android');
      }else if(this.platform.is('ios')) {
        this.getVersion('ios');
      }

      this.subEvent();

      if(this.platform.is('mobile')) {
        jpush.setDebugMode(true);
        jpush.init();
      }
    });
  }

  async getVersion(mobile) {
    let localVersion = await this.appVersion.getVersionNumber();
    let res: any = await this.pygService.checkUpdate(mobile).toPromise();
    let newAppVersion: AppVersionVo = res.data;
    if(newAppVersion.buildVersion != localVersion) {
      const alert = await this.alertController.create({
        message: '有新版本，请点击确定更新',
        enableBackdropDismiss: false,
        buttons: [{
            text: '确定',
            handler: () => {
              this.iab.create('https://www.pgyer.com/' + newAppVersion.buildShortcutUrl, '_system');
              return false;
            }
          }
        ]
      });

      await alert.present();
    }

  }


  initRoot() {
    // Or to get a key/value pair
    this.storage.get('user').then((val) => {
      if(!val) {
        this.rootPage = LoginPage;
      }else {
        this.getUserInfo();
        this.rootPage = HomePage;
      }
    });
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe((res: any) => {
      this.storage.set('user', res.data);
    });
  }

  subEvent() {
    this.event.subscribe('401', () => {
      console.log('401');
      this.alertGoLogin();
    });
    this.event.subscribe(MessageEvent.MESSAGE_EVENT, (messageEvent: MessageEvent) => {
      this.alertMessage(messageEvent);
    })
  }

  async alertMessage(messageEvent: MessageEvent) {
    const alert = await this.alertController.create({
      message: messageEvent.message,
      buttons: [
        {
          text: '确定',
          handler: () => {
            if(messageEvent.goHome) {
              this.nav.popToRoot();
            }else if(messageEvent.back) {
              this.nav.pop({});
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async alertGoLogin() {
    const alert = await this.alertController.create({
      message: '登录超时或其他设备登录，请重新登录',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.rootPage = LoginPage;
          }
        }
      ]
    });
    await alert.present();
  }
}


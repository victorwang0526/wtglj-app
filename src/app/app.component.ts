import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {MessageEvent} from "../events/message-event";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;
  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private storage: Storage,
              public event: Events,
              public alertController: AlertController) {
    // Or to get a key/value pair
    storage.get('user').then((val) => {
      if(!val) {
        this.rootPage = LoginPage;
      }else {
        this.rootPage = HomePage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.subEvent();
    });
  }

  subEvent() {
    this.event.subscribe('401', () => {
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


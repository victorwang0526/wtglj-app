import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UserVo} from "../../models/user-vo";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-user-center',
  templateUrl: 'user-center.html',
})
export class UserCenterPage {
  user: UserVo = null;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage: Storage,) {
    this.storage.get('user').then(u => {
      this.user = u;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCenterPage');
  }
  logout() {
    this.storage.clear();
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage, {});
  }

}

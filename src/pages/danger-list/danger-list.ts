import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PunishListPage} from "../punish-list/punish-list";
@Component({
  selector: 'page-danger-list',
  templateUrl: 'danger-list.html',
})
export class DangerListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DangerListPage');
  }

  openPunishPage() {
    this.navCtrl.push(PunishListPage, {});
  }
}

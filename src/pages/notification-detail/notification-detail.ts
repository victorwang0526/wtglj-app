import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnnexPage } from '../annex/annex';
import { NotificationProvider } from '../../providers/notification-provider';
import { Notice } from '../../models/notification-vo';

@Component({
  selector: 'page-notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage {
  id: string;
  detail: Notice;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notificationProvider: NotificationProvider,
  ) {
    this.id = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationDetailPage');
    this.getDetial();
    this.changeStatus();
  }

  getDetial() {
    this.notificationProvider
      .getNoticeDetail(this.id)
      .subscribe((data: any) => (this.detail = { ...data.noticeDTO, ...data }));
  }

  changeStatus() {
    this.notificationProvider.changeStatus(this.id).subscribe();
  }

  async openAnnex(path: string) {
    this.navCtrl.push(AnnexPage, { path });
  }
}

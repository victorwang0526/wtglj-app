import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { Notification } from '../../models/notification-vo';
import { NotificationProvider } from '../../providers/notification-provider';
import { Subject, Observable } from 'rxjs';
import { UserVo } from '../../models/user-vo';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  // destroy$: Subject<boolean> = new Subject();
  list$: Observable<Notification[]>;
  user: UserVo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notificationProvider: NotificationProvider,
    private storage: Storage,
    public loadingController: LoadingController,
  ) {
    this.storage.get('user').then((u) => {
      this.user = u;

      this.getData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  openNoticeDetail(item: Notification) {
    console.log(item);
    this.changeStatus(item);
    this.navCtrl.push(NotificationDetailPage, { id: item.id });
  }

  async getData() {
    const loading = this.loadingController.create({});
    await loading.present();
    this.list$ = this.notificationProvider.getNotice({
      userId: this.user.id,
      page: 1,
      limit: 30,
    });
    this.list$.subscribe(null, null, () => loading.dismiss());
  }

  changeStatus(item: Notification) {
    this.notificationProvider.changeStatus(item.id).subscribe(() => (item.status = 1));
  }
}

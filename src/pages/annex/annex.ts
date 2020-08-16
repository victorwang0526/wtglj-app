import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '../../models/notification-vo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the AnnexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-annex',
  templateUrl: 'annex.html',
})
export class AnnexPage {
  file: File;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
  ) {
    this.file = this.navParams.get('file');
    console.log(this.file);
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.file.path);
    // const options = {
    //   title: this.file.name,
    // };
    // this.document.canViewDocument(this.file.path, 'application/pdf', options);
    // this.document.viewDocument(this.file.path, 'application/pdf', options);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnexPage');
  }
}

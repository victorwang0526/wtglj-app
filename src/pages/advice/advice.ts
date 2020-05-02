import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {SuggestionProvider} from "../../providers/suggestion-provider";

@Component({
  selector: 'page-advice',
  templateUrl: 'advice.html',
})
export class AdvicePage {

  remark: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public suggestionProvider: SuggestionProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvicePage');
  }

  async submit() {
    if(!this.remark) {
      const alert = await this.alertCtrl.create({
        message: '请输入建议.',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    this.suggestionProvider.submit(this.remark)
      .subscribe((res) => {
        this.alertSuccess();
      })
  }

  async alertSuccess() {
    const alert = await this.alertCtrl.create({
      message: '提交成功.',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.navCtrl.pop({});
          }
        }
      ]
    });
    await alert.present();
  }
}

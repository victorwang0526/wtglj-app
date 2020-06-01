import {Component, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {UploadProvider} from "../../providers/upload-provider";
import {TaskCheckVo} from "../../models/task-check-vo";

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {

  taskCheck: TaskCheckVo;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  constructor(public navCtrl: NavController,
              public uploadProvider: UploadProvider,
              public loadingController: LoadingController,
              platform: Platform,
              public navParams: NavParams) {
    platform.ready().then((readySource) => {
      this.signaturePadOptions = { // passed through to szimek/signature_pad constructor
        'minWidth': 5,
        'canvasWidth': platform.width(),
        'canvasHeight': platform.height()
      };
    });
    this.taskCheck = this.navParams.get('taskCheck');
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }

  ionViewDidLoad() {
  }

  async submit() {
    const loading = await this.loadingController.create({
      content: '提交中'
    });
    await loading.present();
    fetch(`${this.signaturePad.toDataURL()}`)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProvider.upload(blob).subscribe((src)=> {
          this.taskCheck.auditImages = src;
          loading.dismissAll();
          this.navCtrl.pop({});
        }, () => {}, () => {
        })
      });
  }
}

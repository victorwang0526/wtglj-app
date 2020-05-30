import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {UploadProvider} from "../../providers/upload-provider";

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  constructor(public navCtrl: NavController,
              public uploadProvider: UploadProvider,
              public navParams: NavParams) {
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }

  ionViewDidLoad() {
  }

  submit() {
    fetch(`${this.signaturePad.toDataURL()}`)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProvider.upload(blob).subscribe((src)=> {
          console.log(src);
        }, () => {}, () => {
        })
      });
  }
}

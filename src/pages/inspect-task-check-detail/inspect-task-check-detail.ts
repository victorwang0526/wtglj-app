import { Component } from '@angular/core';
import {ActionSheetController, Events, NavController, NavParams} from 'ionic-angular';
import {TaskCheckVo} from "../../models/task-check-vo";
import {TaskProvider} from "../../providers/task-provider";
import {InspectVo} from "../../models/inspect-vo";
import {InspectSubItemVo} from "../../models/inspect-sub-item-vo";
import {MessageEvent} from "../../events/message-event";
import {Storage} from "@ionic/storage";
import {UserVo} from "../../models/user-vo";
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import {TaskCheckItemVo} from "../../models/task-check-item-vo";

@Component({
  selector: 'page-inspect-task-check-detail',
  templateUrl: 'inspect-task-check-detail.html',
})
export class InspectTaskCheckDetailPage {

  taskCheck: TaskCheckVo;
  inspect: InspectVo;
  loading: boolean = false;
  taskCheckItems: Array<TaskCheckItemVo> = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public event: Events,
              private storage: Storage,
              public taskProvider: TaskProvider,
              private camera: Camera,
              public actionSheetController: ActionSheetController) {
    this.taskCheck = navParams.get('task');

    this.loading = true;
    taskProvider.getInspectDetail(this.taskCheck.inspectId)
      .subscribe((inspectVo: InspectVo) => {
        this.inspect = inspectVo;
      }, ()=> {}, () => {
        taskProvider.getTaskCheckItems(this.taskCheck.id)
          .subscribe((taskCheckItems: Array<TaskCheckItemVo>) => {
            this.taskCheckItems = taskCheckItems;

            //init data
            if(this.taskCheckItems && this.taskCheckItems.length > 0) {
              for(let checkItem of this.taskCheckItems) {
                for(let item of this.inspect.items) {
                  for(let subItem of item.subItems) {
                    if(checkItem.subItemId == subItem.id) {
                      subItem.remark = checkItem.remark;
                      subItem.checked = checkItem.subItemsChecked;
                      subItem.imageUrls = checkItem.subItemsImageUrls;
                    }
                  }
                }
              }
            }
          }, () => {}, () => {
            this.loading = false;
          })
      });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectTaskCheckDetailPage');
  }
  async cameraChoose() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '拍照',
        icon: 'camera',
        handler: () => {
          this.cameraOpen(PictureSourceType.CAMERA);
        }
      }, {
        text: '相册',
        icon: 'albums',
        handler: () => {
          this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM);
        }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  cameraOpen(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.event.publish(MessageEvent.MESSAGE_EVENT, new MessageEvent(imageData));
    }, (err) => {
      // Handle error
    });
  }


  async submit() {
    let user: UserVo = await this.storage.get('user');
    this.taskCheck.operator = user.realName;
    this.taskCheck.operatorId = user.id;
    this.taskCheck.operateDate = new Date();
    this.taskCheck.inspect = this.inspect;
    this.taskProvider.submitTaskCheck(this.taskCheck).subscribe((res: any) => {
      if(res.code == 0) {
        this.event.publish(MessageEvent.MESSAGE_EVENT, new MessageEvent('提交成功！', 'success', true));
      }
    });
  }

  getItems(items: string) {
    let titems = [];
    // [xxxx(1,2,3)][yyyy(1,3,5)]
    let x = items.split('】');
    // [xxxx(1,2,3)
    // [yyyy(1,3,5)
    for(let i = 0; i < x.length; i++) {
      let x1 = x[i].replace('【', '');
      if(!x1 || x1.trim() == '') {
        continue;
      }
      let x2 = x1.replace('）', '');
      //xxx(1,2,3
      let y = x2.split('（');
      // xxx
      // 1,2,3
      titems.push({title: y[0], items: y[1].split('，')});
    }
    return titems;
  }

  checkItem(subItem: InspectSubItemVo, checkedValue: any) {
    subItem.checked = checkedValue;
    console.log(JSON.stringify(subItem));
  }

  checkItemM(subItem: InspectSubItemVo, checkedValue: any) {
    if(!subItem.checked) {
      subItem.checked = '';
    }
    if(subItem.checked.indexOf(checkedValue) > -1) {
      subItem.checked = subItem.checked.replace(checkedValue + ',', '');
    }else {
      subItem.checked = subItem.checked + checkedValue + ',';
    }
    console.log(JSON.stringify(subItem));
  }

  isChecked(subItem: InspectSubItemVo, currentValue: any): boolean {
    if(!subItem.checked) {
      return false;
    }
    return subItem.checked.indexOf(currentValue) > -1;
  }

  /**
   * Turn base 64 image into a blob, so we can send it using multipart/form-data posts
   * @param b64Data
   * @param contentType
   * @param sliceSize
   * @return {Blob}
   */
  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}

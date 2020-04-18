import { Component } from '@angular/core';
import {ActionSheetController, AlertController, Events, NavController, NavParams} from 'ionic-angular';
import {TaskCheckVo} from "../../models/task-check-vo";
import {TaskProvider} from "../../providers/task-provider";
import {InspectVo} from "../../models/inspect-vo";
import {InspectSubItemVo} from "../../models/inspect-sub-item-vo";
import {MessageEvent} from "../../events/message-event";
import {Storage} from "@ionic/storage";
import {UserVo} from "../../models/user-vo";
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import {TaskCheckItemVo} from "../../models/task-check-item-vo";
import {UploadProvider} from "../../providers/upload-provider";
import {ImagePreviewPage} from "../image-preview/image-preview";

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
              public alertCtrl: AlertController,
              public uploadProvider: UploadProvider,
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
  async cameraChoose(subItem: InspectSubItemVo) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '拍照',
        icon: 'camera',
        handler: () => {
          this.cameraOpen(PictureSourceType.CAMERA, subItem);
        }
      }, {
        text: '相册',
        icon: 'folder',
        handler: () => {
          this.cameraOpen(PictureSourceType.SAVEDPHOTOALBUM, subItem);
        }
      }, {
        text: 'test',
        handler: () => {
          const imageData = 'iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAzCDPIMRgycCRmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsgsEY19jWyvZ9bp5ZtP558v8QBTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwCETV0AEc4kCwAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAANaADAAQAAAABAAAANAAAAAD50QR6AAABA0lEQVRoBe2YMQ6EQAhFR2Np9gaWWtjZ7f0PsY23MPa7cRMbowkDOCD5NsYMDMN/CMaqG8ZvCnbVwfL5p4OknkIVpEDKUAGUn6H4WaFBKksuQ+Pmrtivtk1j319uv6xr+szz5bpkAeUnUa+kbyX5Sj8rsdyy0tjjKFjI8lNvFJvy72k6ilf0OSQpJFW0hgTBQEogXlFX1e6XO6P2TM9m1b7GuYcsP1VSHmbURjYkKSTFeWktfEDKQnVOTNXuhznFQUD0USWFOUVUnWOG7sdRzcInJCnRLzILCpSYIUkhKQp6DzYg5YEC5QwgRVHJgw1IeaBAOQNIUVTyYANSHihQzhCS1A9sAiT2ApsH7wAAAABJRU5ErkJggg==';
          this.uploadImg(imageData, subItem);
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

  uploadImg(imageData: any, subItem: InspectSubItemVo) {
    fetch(`data:application/octet-stream;base64,${imageData}`)
      .then(res => res.blob())
      .then(blob => {
        subItem.imgLoading = true;
        this.uploadProvider.upload(blob).subscribe((src)=> {
          if(!subItem.imageUrls) {
            subItem.imageUrls = src;
          }else {
            subItem.imageUrls = subItem.imageUrls + ',' + src;
          }
        }, () => {}, () => {
          subItem.imgLoading = false;
        })
      });
  }

  openPreview(imgUrl: string) {
    this.navCtrl.push(ImagePreviewPage, {imgUrl});
  }

  removeImg(subItem: InspectSubItemVo, imgUrl: string) {
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl + ',', '');
    subItem.imageUrls = subItem.imageUrls.replace(imgUrl, '');
    console.log(subItem.imageUrls);
  }

  cameraOpen(sourceType: number, subItem: InspectSubItemVo) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImg(imageData, subItem);
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

import {Component, Input} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {PunishListPage} from "../punish-list/punish-list";
import {DangerVo} from "../../models/danger-vo";
import {DictDataVo} from "../../models/dict-data-vo";
import {TaskProvider} from "../../providers/task-provider";
import {UploadProvider} from "../../providers/upload-provider";
import {Camera} from "@ionic-native/camera";
import {PunishVo} from "../../models/punish-vo";
import {InspectSubItemVo} from "../../models/inspect-sub-item-vo";
import {TaskCheckVo} from "../../models/task-check-vo";
@Component({
  selector: 'page-danger-list',
  templateUrl: 'danger-list.html',
})
export class DangerListPage {

  taskCheck: TaskCheckVo;
  subItem: InspectSubItemVo;
  dangerTypes: Array<DictDataVo> = [];
  punishTypes: Array<DictDataVo> = [];

  constructor(public navCtrl: NavController,
              public taskProvider: TaskProvider,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public uploadProvider: UploadProvider,
              public loadingController: LoadingController,
              private camera: Camera,
              public actionSheetController: ActionSheetController) {
    this.subItem = navParams.get('subItem');
    this.taskCheck = navParams.get('taskCheck');
    if(!this.subItem.dangers || this.subItem.dangers.length == 0) {
      this.subItem.dangers = [];
      // this.addDanger();
    }
    this.getDangerTypes();
    this.getPunishTypes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DangerListPage');
  }

  openPunishPage() {
    this.navCtrl.push(PunishListPage, {});
  }

  addDanger() {
    let d = new DangerVo();
    // this.addPunish(d);
    this.subItem.dangers.push(d);
  }

  removeDanger(d) {
    this.subItem.dangers.splice(this.subItem.dangers.indexOf(d), 1);
  }

  addPunish(d) {
    let p = new PunishVo();
    d.punishesList.push(p);
  }

  removePunish(d: DangerVo, p: PunishVo) {
    d.punishesList.splice(d.punishesList.indexOf(p), 1);
  }

  getDangerTypes() {
    this.taskProvider.getDangerTypes()
      .subscribe((datas: Array<DictDataVo>) => {
        this.dangerTypes = datas;
      });
  }
  getPunishTypes() {
    this.taskProvider.getPunishTypes()
      .subscribe((datas: Array<DictDataVo>) => {
        this.punishTypes = datas;
      });
  }

  async choosePunishLevel(p: PunishVo) {
    if(this.taskCheck.operateDate) {
      return;
    }
    let buttons = [];
    buttons.push({
      text: '无',
      handler: () => {
        p.punishType = null;
        p.punishTypeLabel = '';
      }
    });
    this.punishTypes.forEach(punishType => {
      buttons.push({
        text: punishType.dictLabel,
        handler: () => {
          p.punishType = Number.parseInt(punishType.dictValue);
          p.punishTypeLabel = punishType.dictLabel;
        }
      })
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({buttons});
    await actionSheet.present();
  }
  async chooseLevel(danger: DangerVo) {
    if(this.taskCheck.operateDate) {
      return;
    }
    let buttons = [];
    buttons.push({
      text: '无隐患',
      handler: () => {
        danger.problemLevel = '';
        danger.problemLevelLabel = '';
      }
    });
    this.dangerTypes.forEach(dangerType => {
      buttons.push({
        text: dangerType.dictLabel,
        handler: () => {
          danger.problemLevel = dangerType.dictValue;
          danger.problemLevelLabel = dangerType.dictLabel;
        }
      })
    });
    buttons.push({
      text: '取消',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({buttons});
    await actionSheet.present();
  }
}

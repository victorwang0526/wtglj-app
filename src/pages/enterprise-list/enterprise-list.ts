import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from '../../providers/task-provider';
import { UserVo } from '../../models/user-vo';
import { Storage } from '@ionic/storage';
import { IndustryEnterpriseVo } from '../../models/industry-enterprise-vo';
import { CallNumber } from '@ionic-native/call-number';
import { EnterpriseVo } from '../../models/enterprise-vo';
import {DictProvider} from "../../providers/dict-provider";
import {DictDataVo} from "../../models/dict-data-vo";

@Component({
  selector: 'page-enterprise-list',
  templateUrl: 'enterprise-list.html',
})
export class EnterpriseListPage {
  key: string = '';
  loading: boolean = false;
  user: UserVo = null;
  industryEnterprises: Array<IndustryEnterpriseVo> = null;

  industries: Array<string> = new Array<string>();
  selectedIndustry: string = '';
  highestLevel: Array<DictDataVo> = new Array<DictDataVo>();
  levelColor: Object = {'0': '#fefefe'};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private dictProvider: DictProvider,
    private callNumber: CallNumber,
    public alertController: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
  ) {
    storage.get('user').then((u: UserVo) => {
      this.user = u;
      if (u.deptDTO == null) {
        alertController.create({
          title: '用户未关联部门，请联系管理员',
          buttons: [
            {
              text: '确定',
              handler: () => {
                navCtrl.pop({});
              },
            },
          ],
        });
        return;
      }
      this.loading = true;
      taskProvider.getIndustryEnterprise(u.deptDTO.areas, this.user.id).subscribe(
        (data) => {
          this.industryEnterprises = data;
          for (let ie of data) {
            this.industries.push(ie.industryName);
          }
        },
        (error) => {},
        () => {
          this.loading = false;
        },
      );
    });
    this.getDict();
  }


  getDict() {
    this.dictProvider.getDicts('highestLevel').subscribe((data) => {
      if(data && data.data && data.data.length > 0 && data.data[0].dataList && data.data[0].dataList.length > 0) {
        this.highestLevel = data.data[0].dataList;
        for(let i = 0; i < data.data[0].dataList.length; i++) {
          this.levelColor[data.data[0].dataList[i].dictValue] = data.data[0].dataList[i].remark;
        }
      }
    });
  }

  getEnterpriceColor(enterprise) {
    return this.levelColor[enterprise.level];
  }

  openEnterprise(enterprise: EnterpriseVo) {
    const actionSheet = this.actionSheetCtrl.create({
      title: enterprise.name,
      buttons: [
        {
          text: '拨打：' + enterprise.contact + '  ' + enterprise.mobile,
          handler: () => {
            this.call(enterprise);
          },
        },
      ],
    });
    actionSheet.present();
  }

  call(enterprise: EnterpriseVo) {
    this.callNumber
      .callNumber(enterprise.mobile, true)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  keyChange(e: any) {
    this.key = e.target.value;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnterpriseListPage');
  }
}

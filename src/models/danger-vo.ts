import { PunishVo } from './punish-vo';

export class DangerVo {
  taskSubItemId: string;

  /**
   * 问题表现
   */
  problemDesc: string;

  /**
   * 隐患等级
   */
  problemLevel: string;
  problemLevelLabel: string;

  /**
   * 问题图片
   */
  problemImageUrls: string;
  imgLoading: boolean = false;

  /**
   * 隐患描述
   */
  remark: string;

  punishesList: Array<PunishVo> = [];
  sysEnterpriseDTO: Enterprise;
}

export interface Enterprise {
  address: string;
  area: string;
  contact: string;
  createDate: string;
  creator: string;
  geographicArea: string;
  id: string;
  industry: string;
  integral: number;
  mobile: string;
  name: string;
  remark: string;
  status: number;
  updateDate: string;
  updater: string;
  wxAvatarUrl: string;
  wxCity: string;
  wxCountry: string;
  wxGender: number;
  wxLanguage: string;
  wxNickName: string;
  wxOpenId: string;
  wxProvince: string;
}

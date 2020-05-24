import {PunishVo} from "./punish-vo";

export class DangerVo {

  taskSubItemId: number;

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
}

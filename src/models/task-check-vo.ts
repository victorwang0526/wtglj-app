import {InspectVo} from "./inspect-vo";
import {DangerVo} from "./danger-vo";

export class TaskCheckVo {

  id: number;
  /**
   * 检查清单项目表id
   */
  inspectId: number;
  /**
   * 检查清单项目标题
   */
  inspectTitle: string;
  /**
   * 检查任务主表id
   */
  taskId: number;
  /**
   * 任务名称
   */
  taskTitle: string;
  /**
   * 任务分组，比如xxx任务1，用来区分周期任务组
   */
  groupTitle: string;
  /**
   * 检查类型，1：检查，2：自检
   */
  inspectType: number;
  /**
   * 企业id
   */
  enterpriseId: number;
  /**
   * 企业名称
   */
  enterpriseName: string;
  /**
   * 行业
   */
  industry: string;
  /**
   * 区域
   */
  area: string;
  /**
   * 任务开始时间
   */
  startDate: Date;
  /**
   * 任务结束时间
   */
  startEnd: Date;
  /**
   * 备注
   */
  remark: string;
  /**
   * 状态  0：停用   1：正常
   */
  status: number;
  /**
   * 填表人id，检查为系统user id， 自检为微信udid
   */
  operatorId: number;
  /**
   * 填表人名称，检查为系统username， 自检为微信名称
   */
  operator: string;
  /**
   * 更新时间
   */
  operateDate: Date;

  dangerChange: string;
  dangerDate: Date;
  dangerDesc: string;
  dangerRemark: string;
  dangerType: string;
  dangerTypeLabel: string; // local

  punishAmount: string;
  punishDate: string;
  punishDept: Date;
  punishReason: string;
  punishRemark: string;
  punishResult: string;
  punishType: string;
  punishTypeLabel: string; //local

  inspect: InspectVo;

  dangers: Array<DangerVo>;
}

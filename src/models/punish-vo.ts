export class PunishVo {
  id: number;

  dangerId: number;

  /**
   * 处罚类型;{0:关闭或取缔},{1,处罚金额;}{2:责令限期修改}{3:责令暂时停产}{4:立案处罚}{5:暂扣吊销证照}{6:追究刑事责任}
   */
  punishType: number = 2;
  punishTypeLabel: string = '限期整改';

  taskCheckId: number;

  taskCheckItemId: number;

  /**
   * 处罚缘由
   */
  punishReason: string;

  /**
   * 处罚金额
   */
  punishPrice: number;

  /**
   * 处罚依据
   */
  punishBasis: string;

  /**
   * 整改标准
   */
  rectifyStandard: string;

  /**
   * 整改计划完成时间
   */
  rectifyPlanFinishDate: Date;

  /**
   * 企业整改完成时间
   */
  rectifyCompleteDate: Date;

  /**
   * 企业整改后照片
   */
  rectifyCompleteImagesUrls: string;

  /**
   * 整改描述
   */
  rectifyCompleteDesc: string;

  /** 整改结果 */
  remark: string;

  /**
   * 审核人
   */
  reviewer: number;

  /**
   * 审核时间
   */
  reviewDate: Date;
}

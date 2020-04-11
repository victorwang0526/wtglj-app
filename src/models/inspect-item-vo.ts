import {InspectSubItemVo} from "./inspect-sub-item-vo";

export class InspectItemVo {
  id: string;
  pid: string;
  title: string;
  sort: number;
  status: number;
  subItems: Array<InspectSubItemVo>;
}

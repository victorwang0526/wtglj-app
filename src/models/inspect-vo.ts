import {InspectItemVo} from "./inspect-item-vo";

export class InspectVo {
  id: string;
  title: string;
  specTitle: string;
  spec: string;
  dangerTitle: string;
  danger: string;
  industry: string;
  frequency: string;
  status: number;
  items: Array<InspectItemVo>;
}

import { Pipe, PipeTransform } from '@angular/core';
import {IndustryEnterpriseVo} from "../../models/industry-enterprise-vo";

@Pipe({
  name: 'enterpriseIndustry',
})
export class EnterpriseIndustryPipe implements PipeTransform {

  transform(ies: Array<IndustryEnterpriseVo>, industry: string) {
     if(!industry || industry.trim() == '') {
       return ies;
     }
     return ies.filter((ie: IndustryEnterpriseVo, index: number) => {
       return ie.industry.indexOf(industry) > -1;
     })
  }
}

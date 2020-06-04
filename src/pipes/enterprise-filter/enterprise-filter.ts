import { Pipe, PipeTransform } from '@angular/core';
import {EnterpriseVo} from "../../models/enterprise-vo";

@Pipe({
  name: 'enterpriseFilter',
})
export class EnterpriseFilterPipe implements PipeTransform {
  transform(enterprises: Array<EnterpriseVo>, key: string) {
    if(!key || key.trim() == '') {
      return enterprises;
    }
    return enterprises.filter((enterprise: EnterpriseVo, index: number) => {
      return enterprise.name.indexOf(key) > -1
              || enterprise.address.indexOf(key) > -1
              ||enterprise.contact.indexOf(key) > -1;
    })
  }
}

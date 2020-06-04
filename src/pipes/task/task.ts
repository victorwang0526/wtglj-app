import { Pipe, PipeTransform } from '@angular/core';
import {TaskCheckVo} from "../../models/task-check-vo";

@Pipe({
  name: 'taskPipe',
})
export class TaskPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(tasks: Array<TaskCheckVo>, key: string, area: string, industry: string) {
    if((!key || key.trim() == '')
      &&(!area || area.trim() == '')
      &&(!industry || industry.trim() == '') ) {
      return tasks;
    }
    return tasks.filter((task, index) => {
      return (key && task.enterpriseName.indexOf(key) > -1)
        || (area && task.area.indexOf(area) > -1)
        || (industry && task.industry.indexOf(industry) > -1);
    });
  }
}

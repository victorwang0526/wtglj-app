import { Pipe, PipeTransform } from '@angular/core';
import {TaskCheckVo} from "../../models/task-check-vo";

@Pipe({
  name: 'taskPipe',
})
export class TaskPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(tasks: Array<TaskCheckVo>, key: string) {
    if(!key || key.trim() == '') {
      return tasks;
    }
    return tasks.filter((task, index) => {
      return task.enterpriseName.indexOf(key) > -1;
    });
  }
}

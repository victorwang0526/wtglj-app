import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectTaskCheckPage } from './inspect-task-check';

@NgModule({
  declarations: [
    InspectTaskCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectTaskCheckPage),
  ],
})
export class InspectTaskCheckPageModule {}

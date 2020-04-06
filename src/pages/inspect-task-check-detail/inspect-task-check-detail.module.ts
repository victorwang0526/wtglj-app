import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectTaskCheckDetailPage } from './inspect-task-check-detail';

@NgModule({
  declarations: [
    InspectTaskCheckDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectTaskCheckDetailPage),
  ],
})
export class InspectTaskCheckDetailPageModule {}

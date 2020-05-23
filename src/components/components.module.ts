import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { VImageComponent } from './v-image/v-image';
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import { VDangerComponent } from './v-danger/v-danger';
import { VPunishComponent } from './v-punish/v-punish';
@NgModule({
	declarations: [VImageComponent,
    VDangerComponent,
    VPunishComponent],
	imports: [
	  CommonModule,
    IonicModule,
  ],
	exports: [VImageComponent,
    VDangerComponent,
    VPunishComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}

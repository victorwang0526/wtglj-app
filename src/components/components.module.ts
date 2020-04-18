import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { VImageComponent } from './v-image/v-image';
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [VImageComponent],
	imports: [
	  CommonModule,
    IonicModule,
  ],
	exports: [VImageComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}

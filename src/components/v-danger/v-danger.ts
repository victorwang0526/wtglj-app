import { Component } from '@angular/core';

/**
 * Generated class for the VDangerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'v-danger',
  templateUrl: 'v-danger.html'
})
export class VDangerComponent {

  text: string;

  constructor() {
    console.log('Hello VDangerComponent Component');
    this.text = 'Hello World';
  }

}

import { Component } from '@angular/core';

/**
 * Generated class for the VPunishComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'v-punish',
  templateUrl: 'v-punish.html'
})
export class VPunishComponent {

  text: string;

  constructor() {
    console.log('Hello VPunishComponent Component');
    this.text = 'Hello World';
  }

}

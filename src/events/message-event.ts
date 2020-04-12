export class MessageEvent{

  public static MESSAGE_EVENT: string = 'message_event';
  message: string;
  back: boolean;
  goHome: boolean;
  type: string; //warn/success/error...
  constructor(message, type:string = 'warn', back:boolean = false, goHome:boolean = false){
    this.message = message;
    this.back = back;
    this.goHome = goHome;
    this.type = type;
  }
}

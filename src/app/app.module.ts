import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {InterceptorModule} from "../providers/interceptor.module";
import { UserProvider } from '../providers/user/user';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {InspectTaskCheckPage} from "../pages/inspect-task-check/inspect-task-check";
import {InspectTaskCheckDetailPage} from "../pages/inspect-task-check-detail/inspect-task-check-detail";
import {InspectTaskCheckGroupPage} from "../pages/inspect-task-check-group/inspect-task-check-group";
import {AdvicePage} from "../pages/advice/advice";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    InspectTaskCheckPage,
    InspectTaskCheckDetailPage,
    InspectTaskCheckGroupPage,
    AdvicePage,
  ],
  imports: [
    HttpClientModule,
    InterceptorModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
      mode: 'ios',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    InspectTaskCheckPage,
    InspectTaskCheckDetailPage,
    InspectTaskCheckGroupPage,
    AdvicePage,
  ],
  providers: [
    JPush,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
  ]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {JPush} from "@jiguang-ionic/jpush";
import { Camera } from '@ionic-native/camera';
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {InterceptorModule} from "../providers/interceptor.module";
import { UserProvider } from '../providers/user-provider';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {InspectTaskCheckPage} from "../pages/inspect-task-check/inspect-task-check";
import {InspectTaskCheckDetailPage} from "../pages/inspect-task-check-detail/inspect-task-check-detail";
import {InspectTaskCheckGroupPage} from "../pages/inspect-task-check-group/inspect-task-check-group";
import {AdvicePage} from "../pages/advice/advice";
import {TaskProvider} from "../providers/task-provider";
import {UploadProvider} from "../providers/upload-provider";
import {ImagePreviewPage} from "../pages/image-preview/image-preview";
import {ComponentsModule} from "../components/components.module";
import {SuggestionProvider} from "../providers/suggestion-provider";
import {ExamStartPage} from "../pages/exam-start/exam-start";
import {ExamListPage} from "../pages/exam-list/exam-list";
import {ExamFinishPage} from "../pages/exam-finish/exam-finish";
import {ExamDetailPage} from "../pages/exam-detail/exam-detail";
import {DictProvider} from "../providers/dict-provider";
import {UserCenterPage} from "../pages/user-center/user-center";
import {DangerListPage} from "../pages/danger-list/danger-list";
import {PunishListPage} from "../pages/punish-list/punish-list";

// @ts-ignore
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    InspectTaskCheckPage,
    InspectTaskCheckDetailPage,
    InspectTaskCheckGroupPage,
    AdvicePage,
    ImagePreviewPage,

    ExamStartPage,
    ExamListPage,
    ExamFinishPage,
    ExamDetailPage,

    UserCenterPage,
    DangerListPage,
    PunishListPage,
  ],
  imports: [
    HttpClientModule,
    InterceptorModule,
    BrowserModule,
    ComponentsModule,
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
    ImagePreviewPage,

    ExamStartPage,
    ExamListPage,
    ExamFinishPage,
    ExamDetailPage,

    UserCenterPage,
    DangerListPage,
    PunishListPage,
  ],
  providers: [
    JPush,
    Camera,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    TaskProvider,
    DictProvider,
    UploadProvider,
    SuggestionProvider,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

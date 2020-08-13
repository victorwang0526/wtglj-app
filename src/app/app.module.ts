import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { JPush } from '@jiguang-ionic/jpush';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorModule } from '../providers/interceptor.module';
import { UserProvider } from '../providers/user-provider';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InspectTaskCheckPage } from '../pages/inspect-task-check/inspect-task-check';
import { InspectTaskCheckDetailPage } from '../pages/inspect-task-check-detail/inspect-task-check-detail';
import { InspectTaskCheckGroupPage } from '../pages/inspect-task-check-group/inspect-task-check-group';
import { AdvicePage } from '../pages/advice/advice';
import { TaskProvider } from '../providers/task-provider';
import { UploadProvider } from '../providers/upload-provider';
import { ImagePreviewPage } from '../pages/image-preview/image-preview';
import { ComponentsModule } from '../components/components.module';
import { SuggestionProvider } from '../providers/suggestion-provider';
import { ExamStartPage } from '../pages/exam-start/exam-start';
import { ExamListPage } from '../pages/exam-list/exam-list';
import { ExamFinishPage } from '../pages/exam-finish/exam-finish';
import { ExamDetailPage } from '../pages/exam-detail/exam-detail';
import { DictProvider } from '../providers/dict-provider';
import { UserCenterPage } from '../pages/user-center/user-center';
import { DangerListPage } from '../pages/danger-list/danger-list';
import { PunishListPage } from '../pages/punish-list/punish-list';
import { DailyTaskPage } from '../pages/daily-task/daily-task';
import { EnterpriseSearchPage } from '../pages/enterprise-search/enterprise-search';
import { DatePipe } from '@angular/common';
import { DangerApprovePage } from '../pages/danger-approve/danger-approve';
import { PgyProvider } from '../providers/pgy-provider';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturePage } from '../pages/signature/signature';
import { PipesModule } from '../pipes/pipes.module';
import { EnterpriseListPage } from '../pages/enterprise-list/enterprise-list';
import { CallNumber } from '@ionic-native/call-number';
import { XunChaPage } from '../pages/xun-cha/xun-cha';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NotificationPage } from '../pages/notification/notification';
import { NotificationDetailPage } from '../pages/notification-detail/notification-detail';
import { AnnexPage } from '../pages/annex/annex';
import { NotificationProvider } from '../providers/notification-provider';
import { ExerciseListPage } from '../pages/exercise-list/exercise-list';
import { ExerciseDetailPage } from '../pages/exercise-detail/exercise-detail';
import { Utils } from '../utils';
import { ExamProvider } from '../providers/exam-provider';
import { RegiterProvider } from '../providers/regiter-provider';
import { RegiserPage } from '../pages/regiser/regiser';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { HiddenDangerPage } from '../pages/hidden-danger/hidden-danger';
import {DocumentViewer} from "@ionic-native/document-viewer";

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
    DangerApprovePage,
    DailyTaskPage,
    EnterpriseSearchPage,
    SignaturePage,
    EnterpriseListPage,
    XunChaPage,
    NotificationPage,
    NotificationDetailPage,
    AnnexPage,
    ExerciseListPage,
    ExerciseDetailPage,
    RegiserPage,
    ForgotPasswordPage,
    HiddenDangerPage,
  ],
  imports: [
    HttpClientModule,
    InterceptorModule,
    BrowserModule,
    ComponentsModule,
    PipesModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
      mode: 'ios',
      pageTransition: 'ios-transition',
    }),
    IonicStorageModule.forRoot(),
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
    DangerApprovePage,
    DailyTaskPage,
    EnterpriseSearchPage,
    SignaturePage,
    EnterpriseListPage,
    XunChaPage,
    NotificationPage,
    NotificationDetailPage,
    AnnexPage,
    ExerciseListPage,
    ExerciseDetailPage,
    RegiserPage,
    ForgotPasswordPage,
    HiddenDangerPage,
  ],
  providers: [
    CallNumber,
    JPush,
    Camera,
    AppVersion,
    InAppBrowser,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    ScreenOrientation,
    DocumentViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    TaskProvider,
    DictProvider,
    UploadProvider,
    DatePipe,
    SuggestionProvider,
    PgyProvider,
    NotificationProvider,
    Utils,
    ExamProvider,
    RegiterProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

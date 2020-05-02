```shell script
$ ionic start ionic-cordova-blank-template blank --cordova --type=ionic-angular

-- add native storage

$ ionic cordova plugin add cordova-sqlite-storage

$ npm install --save @ionic/storage

$ ionic cordova plugin add phonegap-plugin-barcodescanner

$ npm install --save @ionic-native/barcode-scanner@4

$ keytool -genkey -alias wtglj.keystore -keyalg RSA -validity 20000 -keystore wtglj.keystore

$ ionic cordova plugin add jpush-phonegap-plugin@3.4.2 --variable APP_KEY=f82b13237c26a0c4ccc38e86

$ npm install --save @jiguang-ionic/jpush@1.0.2


> ionicionic

```

### todo
[ ] login page
[ ] push notification

```

> ionic serve

```

```shell script

$ ionic cordova platform add android

$ ionic cordova build android --prod --release && jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA1 -keystore ./wtglj.keystore -storepass wtgljaq -signedjar ./release/android/app-release-signed.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk wtglj.keystore
```

```shell script
$ ionic cordova platform add ios

$ ionic cordova build ios --prod --release


```

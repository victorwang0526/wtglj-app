```shell script
$ ionic start ionic-cordova-blank-template blank --cordova --type=ionic-angular

-- add native storage

$ ionic cordova plugin add cordova-sqlite-storage

$ npm install --save @ionic/storage

$ ionic cordova plugin add phonegap-plugin-barcodescanner

$ npm install --save @ionic-native/barcode-scanner@4

$ keytool -genkey -alias ionic.keystore -keyalg RSA -validity 20000 -keystore ionic.keystore

$ ionic cordova plugin add jpush-phonegap-plugin --variable APP_KEY=319abc788b17eb20adcc7263

$ npm install --save @jiguang-ionic/jpush@2.0.0


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

$ ionic cordova build android --prod --release

$ jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA1 -keystore ./ionic.keystore -storepass ionicionic -signedjar ./release/android/app-release-signed.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ionic.keystore
```

```shell script
$ ionic cordova platform add ios

$ ionic cordova build ios --prod --release


```

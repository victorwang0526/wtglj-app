[![Build Status](https://travis-ci.org/victorwang0526/wtglj-app.svg?token=Zy921zmnyZnBZ3zqFRNi&branch=master)](https://travis-ci.org/victorwang0526/wtglj-app)


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


### code push 

https://github.com/Dellos7/example-cordova-code-push-plugin

```shell script
ionic cordova plugin add cordova-plugin-code-push

npm install --save @ionic-native/code-push
npm uninstall --save @ionic-native/code-push

ionic cordova platform add ios

ionic cordova platform add android

npm install -g code-push-cli

code-push login

code-push app add wtgljaq-ios ios cordova

    Successfully added the "wtgljaq-ios" app, along with the following default deployments:
    ┌────────────┬────────────────────────────────────────┐
    │ Name       │ Deployment Key                         │
    ├────────────┼────────────────────────────────────────┤
    │ Production │ RrBiAojRni3DHVH_OmcGiYV_bd3rfT7N7JpBkM │
    ├────────────┼────────────────────────────────────────┤
    │ Staging    │ XCsxCyGY4_JIrIp6OodogATs_gLHz9WjTavuY  │
    └────────────┴────────────────────────────────────────┘

code-push app add wtgljaq-android android cordova


code-push deployment ls wtgljaq-ios -k
    
    ┌────────────┬────────────────────────────────────────┬─────────────────────┬──────────────────────┐
    │ Name       │ Deployment Key                         │ Update Metadata     │ Install Metrics      │
    ├────────────┼────────────────────────────────────────┼─────────────────────┼──────────────────────┤
    │ Production │ RrBiAojRni3DHVH_OmcGiYV_bd3rfT7N7JpBkM │ No updates released │ No installs recorded │
    ├────────────┼────────────────────────────────────────┼─────────────────────┼──────────────────────┤
    │ Staging    │ XCsxCyGY4_JIrIp6OodogATs_gLHz9WjTavuY  │ No updates released │ No installs recorded │
    └────────────┴────────────────────────────────────────┴─────────────────────┴──────────────────────┘


code-push deployment ls wtgljaq-android -k

```

add theses keys in your config.xml

```xml
<platform name="android">
    <preference name="CodePushDeploymentKey" value="YOUR-ANDROID-DEPLOYMENT-KEY" />
</platform>
<platform name="ios">
    <preference name="CodePushDeploymentKey" value="YOUR-IOS-DEPLOYMENT-KEY" />
</platform>
```


### release and updates

```shell script

ionic cordova prepare ios

code-push release wtgljaq-ios ./platforms/ios/www/ 0.0.5 --description "integration app center" -d "Production"
```

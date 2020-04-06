#!/bin/bash -v

set -e

# Build Ionic App for Android
ionic cordova platform add android --nofetch

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    ionic cordova build android
else
    ionic cordova build android --prod --release
fi

rm -rf ./release/*.apk

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA1 -keystore ./ionic.keystore -storepass ionicionic -signedjar ./release/app-release-signed.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ionic.keystore

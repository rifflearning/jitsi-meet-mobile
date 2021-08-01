Jerry Stephen Horton

ln -s $(which node) /usr/local/bin/node

If you get the error: 

Can't find the 'node' binary to build the React Native bundle.  If you have a non-standard Node.js installation, select your project in Xcode, find  'Build Phases' - 'Bundle React Native code and images' and change NODE_BINARY to an  absolute path to your node executable. You can find it by invoking 'which node' in the terminal.

This error is most likely due to installing Node via brew;  which is good and ok.  the above command creates a symlink to node where the react-native scroptes can find it.


#when running the ./build-ios.release.sh you will get a bitcode error until you run the script below
jitsi-meet-mobile/node_modules/react-native-webrtc/tools/downloadBitcode.sh


# Jitsi Meet SDK for iOS

This document has been moved to [The Handbook](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ios-sdk).

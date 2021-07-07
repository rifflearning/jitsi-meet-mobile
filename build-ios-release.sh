#download webrtc bitcode in order to make a release build
node_modules/react-native-webrtc/tools/downloadBitcode.sh
xcodebuild -workspace ios/jitsi-meet.xcworkspace -scheme JitsiMeet -destination generic/platform=iOS -configuration Release archive

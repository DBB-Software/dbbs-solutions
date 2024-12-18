/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: './detox.config.ts'
    },
    jest: {
      setupTimeout: 200000
    }
  },
  apps: {
    'ios.dev': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/mobile_app.app',
      build: 'xcodebuild -workspace ios/MobileApp.xcworkspace -scheme "MobileApp Dev" -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet'
    },
    'ios.prod': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/mobile_app.app',
      build: 'xcodebuild -workspace ios/MobileApp.xcworkspace -scheme "MobileApp Prod" -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet'
    },
    'android.dev': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/dev/debug/app-dev-debug.apk',
      build: 'cd android && ./gradlew assembleDevDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [
        8081
      ]
    },
    'android.prod': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/prod/release/app-prod-release.apk',
      build: 'cd android && ./gradlew assembleProdRelease assembleAndroidTest -DtestBuildType=release && cd ..'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_34_extension_level_7_arm64-v8a'
      }
    },
    ci: {
      type: 'android.emulator',
      device: {
        avdName: 'DETOX_DEVICE'
      }
    }
  },
  configurations: {
    'ios.sim.dev': {
      device: 'simulator',
      app: 'ios.dev'
    },
    'ios.sim.prod': {
      device: 'simulator',
      app: 'ios.prod'
    },
    'android.att.dev': {
      device: 'attached',
      app: 'android.dev'
    },
    'android.att.prod': {
      device: 'attached',
      app: 'android.prod'
    },
    'android.emu.dev': {
      device: 'emulator',
      app: 'android.dev'
    },
    'android.emu.prod': {
      device: 'emulator',
      app: 'android.prod'
    },
    'android.emu.ci': {
      device: 'ci',
      app: 'android.prod'
    }
  }
};

fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### check_env

```sh
[bundle exec] fastlane check_env
```



----


## iOS

### ios increment_build

```sh
[bundle exec] fastlane ios increment_build
```

Increment Build number

### ios increment_build_testflight

```sh
[bundle exec] fastlane ios increment_build_testflight
```

Increment Build number in TestFlight

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios build

```sh
[bundle exec] fastlane ios build
```

Prepare new IOS build!

### ios nuke

```sh
[bundle exec] fastlane ios nuke
```

Nuke expired certificates and profiles

### ios distribution

```sh
[bundle exec] fastlane ios distribution
```

Firebase distribution of iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Upload to Test Flight

### ios release

```sh
[bundle exec] fastlane ios release
```

Upload release to App Store

### ios create_app

```sh
[bundle exec] fastlane ios create_app
```

Create new app for App Store

----


## Android

### android increment_build

```sh
[bundle exec] fastlane android increment_build
```

Increment Build number

### android build

```sh
[bundle exec] fastlane android build
```

Build a Release artifact (.aab and .apk)

### android distribution

```sh
[bundle exec] fastlane android distribution
```

Firebase distribution of Android

### android beta

```sh
[bundle exec] fastlane android beta
```

Upload to Play Store beta

### android release

```sh
[bundle exec] fastlane android release
```

Upload release to Play Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

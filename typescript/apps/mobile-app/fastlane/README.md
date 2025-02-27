fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios increment_build

```sh
[bundle exec] fastlane ios increment_build
```

Increment Build number

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios nuke

```sh
[bundle exec] fastlane ios nuke
```

Nuke expired certificates and profiles

### ios build

```sh
[bundle exec] fastlane ios build
```

Prepare new IOS build!

### ios firebase

```sh
[bundle exec] fastlane ios firebase
```

Firebase distribution of iOS

### ios testing

```sh
[bundle exec] fastlane ios testing
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

### android firebase

```sh
[bundle exec] fastlane android firebase
```

Firebase distribution of Android

### android testing

```sh
[bundle exec] fastlane android testing
```

Upload to Play Store testing

### android release

```sh
[bundle exec] fastlane android release
```

Upload release to Play Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

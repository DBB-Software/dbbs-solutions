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

### ios build

```sh
[bundle exec] fastlane ios build
```

Prepare new IOS build!

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

Build a Release artifact (.aab)

### android distribution

```sh
[bundle exec] fastlane android distribution
```

Firebase distribution of Android

### android release

```sh
[bundle exec] fastlane android release
```

Upload to Play Store beta

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

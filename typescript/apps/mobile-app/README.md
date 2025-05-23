## Name: mobile-app

## Description

The `mobile-app` application serves as an example of a generated mobile application, ready for release, showcasing a basic starting point for mobile development projects.

## Usage

Generate new mobile application using the following npx command.

```bash
npx turbo gen mobile-app --args react-native-cli
```

When creating a `react-native-cli` application, have the option to select additional dependencies to the project that will extend its functionality and features:

- storybook - adds a storybook implementation for `react-native` to the base template, it is possible to build both on device and web. You can also add storybook to an existing project via npx turbo gen mobile-storybook.

- storage - adds an RTK or jotai implementation to the base template to choose as the main storage in the application using @react-native-mmkv as persistor. You can also add storage to an existing project via npx turbo gen mobile-storages.

### Components
Presented as a `mobile-components` package that provides ui solutions for any `react-native` application.

### Features
Presented as a `mobile-features` package thats provides universal solutions for `react-native-cli` apps, and basic realization of `react-native` firebase service.

### IOS
To work with iOS in a ReactNative app, need to install gems and Pods locally using commands:

```bash
bundle install && npx pod-install
```

To run the application on the simulator, need to run the corresponding variant Dev or Prod:

```bash
yarn start ios:dev
```
or
```bash
yarn start ios:prod
```

### Android
To work with Android in a React Native app require JDK 17 or higher and need to use commands to run the corresponding flavor variants Dev or Prod.

```bash
yarn start android:dev
```
or
```bash
yarn start android:prod
```

### Distribution
To work with the distribution of ReactNative app need to generate credentials for android and iOS:

- android - to build the release application need to generate [keystore](https://developer.android.com/studio/publish/app-signing) in android/app folder and create credentials.json in the root of the application in accordance with the credentials-example.json file. In order to start distribution require to create a google service file in [Google cloud console](https://console.cloud.google.com/), and provide it to fastlane folder.

- iOS - to build the release iOS archive need to create apple API key on [Apple developer portal](https://developer.apple.com/), and provide it to fastlane folder.

The DBBS Pre-Built Solutions enables the generation of a mobile application template with opinionated settings. This simplifies and accelerates the initial stages of development while promoting code consistency across different applications. Additionally, it lays the groundwork for streamlining updates to the common aspects of applications when the pre-built solutions undergoes updates.

## Feature Keywords

- mobile-app-bootstrap

## Language and framework

- React Native
- JavaScript
- TypeScript

## Type

- Application

## Tech Category

- Mobile-app

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy
- xomastyleee

## Links

[React Native](https://reactnative.dev/)

## External dependencies

- @react-native

## Name: firebase

## Description

The `firebase` package provides Firebase functionalities for Flutter applications, enabling seamless integration with Firebase services. This package includes support for Firebase Remote Config and Cloud Messaging.

## Usage

Install the package using pubspec.yaml:

```yaml
dependencies:
  firebase:
    path: ../packages/firebase
```

### Remote Config

The `RemoteConfigController` provides a way to manage remote configuration values from Firebase. It can be used to fetch, activate, and access these values throughout your application.

#### Example Usage

```dart
import 'package:firebase/firebase.dart';
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Create controller
  final remoteConfigController = RemoteConfigController(FirebaseRemoteConfig.instance);
  
  // Setup remote config defaults and settings
  final parameters = <String, RemoteConfigParameter>{
    'welcome_message': RemoteConfigParameter(
      defaultValue: 'Hello, world!',
      valueType: 'STRING',
    ),
    'feature_enabled': RemoteConfigParameter(
      defaultValue: 'false',
      valueType: 'BOOLEAN',
    ),
  };
  
  final settings = RemoteConfigSettings(
    fetchTimeout: const Duration(seconds: 10),
    minimumFetchInterval: const Duration(hours: 1),
  );
  
  final context = RemoteConfigContext(
    defaultParameters: parameters,
    settings: settings,
  );
  
  // Initialize remote config
  await remoteConfigController.initialize(context);
  
  runApp(
    ChangeNotifierProvider.value(
      value: remoteConfigController,
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Access remote config values
    final config = context.watch<RemoteConfigController>();
    final welcomeMessage = config.getSingleValue<String>('welcome_message');
    final featureEnabled = config.getSingleValue<bool>('feature_enabled');
    
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(welcomeMessage?.value ?? 'Loading...'),
              if (featureEnabled?.value == true)
                Text('Feature enabled!'),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Available Methods

- `initialize(RemoteConfigContext)`: Sets up the remote configuration with defaults and fetches values from the server
- `getSingleValue<T>(String)`: Gets a single value by key with proper typing
- `getAllValueAsMap()`: Gets all values as a Map
- `getAllValueAsList()`: Gets all values as a List of MapEntry

## Feature Keywords

- firebase
- firebase-remote-config
- firebase-cloud-messaging
- flutter-firebase

## Language and framework

- Flutter
- Dart

## Type

- Package

## Tech Category

- Mobile-app
- Frontend

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- xomastyleee

## Links

- [Firebase Flutter Documentation](https://firebase.flutter.dev/)
- [Flutter Remote Config Documentation](https://firebase.flutter.dev/docs/remote-config/overview/)

## External dependencies

- flutter
- firebase_core
- firebase_remote_config
- firebase_messaging
- provider 
## Name: flutter-mobile

## Description

The `flutter-mobile` application serves as an example of a generated Flutter mobile application within the turborepo, demonstrating a basic starting point for cross-platform mobile development projects.

## Usage

The application is integrated with turborepo for unified command execution through package.json:

```bash
# Development commands
yarn ios:dev      # Run on iOS simulator
yarn android:dev  # Run on Android emulator

# Production commands
yarn ios:prod      # Run on iOS simulator
yarn android:prod  # Run on Android emulator

# Build commands
yarn build        # Build bundle
yarn aar         # Build Android AAR
yarn apk         # Build Android APK
yarn appbundle   # Build Android App Bundle
yarn ios         # Build iOS
yarn ipa         # Build iOS IPA

# Quality assurance
yarn test        # Run tests
yarn lint        # Apply dart fixes and sort imports
yarn lint:show   # Show potential fixes
yarn type-check  # Run Flutter analyze
yarn clean       # Clean build artifacts
```

### Setup

1. **Environment Setup**
   ```bash
   make setup
   ```
   This will install all required dependencies through asdf:
   - Flutter 3.29.0
   - Dart 3.5.4
   - Java 17
   - Ruby 3.2.0
   - Cocoapods 1.16.2

### Project Structure

```
flutter_mobile/
├── android/          # Android platform-specific code
├── ios/             # iOS platform-specific code
├── lib/             # Main Flutter application code
├── test/            # Test files
├── assets/          # Static assets (images, fonts, etc.)
├── pubspec.yaml     # Flutter dependencies and configuration
└── package.json     # Turborepo integration commands
```

## Feature Keywords

- flutter-mobile-bootstrap
- cross-platform-mobile
- turborepo-integration

## Language and framework

- Flutter
- Dart

## Type

- Application

## Tech Category

- Mobile-app

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- xomastyleee

## Links

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter on GitHub](https://github.com/flutter/flutter)

## External dependencies

- flutter
- dart
- flutter_lints 
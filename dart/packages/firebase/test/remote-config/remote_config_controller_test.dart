// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

// Project imports:
import 'package:firebase/src/remote-config/remote_config_context.dart';
import 'package:firebase/src/remote-config/remote_config_controller.dart';
import 'package:firebase/src/remote-config/remote_config_value_parser.dart';

class MockFirebaseRemoteConfig extends Mock implements FirebaseRemoteConfig {
  @override
  Future<void> setDefaults(Map<String, dynamic> defaults) async {}

  @override
  Future<void> setConfigSettings(RemoteConfigSettings settings) async {}

  @override
  Future<bool> fetchAndActivate() async => true;

  @override
  RemoteConfigValue getValue(String key) {
    return MockRemoteConfigValue();
  }

  @override
  Map<String, RemoteConfigValue> getAll() {
    return {
      'string': MockRemoteConfigValue(),
      'number': MockRemoteConfigValue(),
    };
  }
}

class MockRemoteConfigValue extends Mock implements RemoteConfigValue {
  final String _stringValue = 'remote-string-value';
  final int _intValue = 100;
  final double _doubleValue = 3.14;
  final bool _boolValue = true;

  @override
  ValueSource get source => ValueSource.valueStatic;

  @override
  String asString() => _stringValue;

  @override
  int asInt() => _intValue;

  @override
  double asDouble() => _doubleValue;

  @override
  bool asBool() => _boolValue;
}

class MockRemoteConfigSettings extends Mock implements RemoteConfigSettings {}

void main() {
  group('RemoteConfigController', () {
    late RemoteConfigController controller;
    late MockFirebaseRemoteConfig mockRemoteConfig;
    late RemoteConfigContext mockContext;
    late MockRemoteConfigSettings mockSettings;

    setUp(() {
      mockRemoteConfig = MockFirebaseRemoteConfig();
      mockSettings = MockRemoteConfigSettings();

      final parameters = <String, RemoteConfigParameter>{
        'string': RemoteConfigParameter(
          defaultValue: 'default-string',
          valueType: 'STRING',
        ),
        'number': RemoteConfigParameter(
          defaultValue: '42',
          valueType: 'NUMBER',
        ),
      };

      mockContext = RemoteConfigContext(
        defaultParameters: parameters,
        settings: mockSettings,
      );

      controller = RemoteConfigController(mockRemoteConfig);
    });

    test('initialize sets up remote config correctly', () async {
      // Act
      await controller.initialize(mockContext);

      // Assert
      expect(
          controller.defaultParameters, equals(mockContext.defaultParameters));
    });

    test('getSingleValue returns parsed value', () async {
      // Arrange - custom mock setup
      await controller.initialize(mockContext);

      // Act
      final result = controller.getSingleValue<String>('string');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, equals('remote-string-value'));
      expect(result.source, equals('valueStatic'));
    });

    test('getAllValueAsMap returns map of parsed values', () async {
      // Arrange
      await controller.initialize(mockContext);

      // Act
      final result = controller.getAllValueAsMap();

      // Assert
      expect(result, isA<Map<String, ParsedValue<dynamic>?>>());
      expect(result.length, equals(2));
    });

    test('getAllValueAsList returns list of parsed values', () async {
      // Arrange
      await controller.initialize(mockContext);

      // Act
      final result = controller.getAllValueAsList();

      // Assert
      expect(result, isA<List<MapEntry<String, ParsedValue<dynamic>?>>>());
      expect(result.length, equals(2));
    });

    test('initialize throws exception when config fails', () async {
      // Create a new mock that throws an exception
      final failingMock = FailingMockFirebaseRemoteConfig();
      controller = RemoteConfigController(failingMock);

      // Act & Assert
      expect(() => controller.initialize(mockContext), throwsException);
    });
  });
}

// Special mock for testing exceptions
class FailingMockFirebaseRemoteConfig extends Mock
    implements FirebaseRemoteConfig {
  @override
  Future<void> setConfigSettings(RemoteConfigSettings settings) async {
    throw Exception('Config failed');
  }
}

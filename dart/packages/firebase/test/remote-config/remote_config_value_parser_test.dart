// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

// Project imports:
import 'package:firebase/src/remote-config/remote_config_value_parser.dart';

// Dynamic test values mock
class MockRemoteConfigValue extends Mock implements RemoteConfigValue {
  String _stringValue = 'test-string';
  int _intValue = 42;
  double _doubleValue = 3.14;
  bool _boolValue = true;

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

  // Methods to change values for tests
  void setStringValue(String value) {
    _stringValue = value;
  }

  void setIntValue(int value) {
    _intValue = value;
  }

  void setDoubleValue(double value) {
    _doubleValue = value;
  }

  void setBoolValue(bool value) {
    _boolValue = value;
  }
}

void main() {
  group('RemoteConfigValueParser', () {
    late RemoteConfigValueParser parser;
    late MockRemoteConfigValue mockValue;

    setUp(() {
      parser = RemoteConfigValueParser();
      mockValue = MockRemoteConfigValue();
    });

    test('parses String values correctly', () {
      // Arrange - direct setup
      mockValue.setStringValue('test-string');

      // Act
      final result = parser.parseConfigValue<String>(mockValue, 'STRING');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, equals('test-string'));
      expect(result.source, equals('valueStatic'));
    });

    test('parses int values correctly', () {
      // Arrange - direct setup
      mockValue.setIntValue(42);

      // Act
      final result = parser.parseConfigValue<int>(mockValue, 'NUMBER');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, equals(42));
      expect(result.source, equals('valueStatic'));
    });

    test('parses double values correctly', () {
      // Arrange - direct setup
      mockValue.setDoubleValue(3.14);

      // Act
      final result = parser.parseConfigValue<double>(mockValue, 'DOUBLE');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, equals(3.14));
      expect(result.source, equals('valueStatic'));
    });

    test('parses boolean values correctly', () {
      // Arrange - direct setup
      mockValue.setBoolValue(true);

      // Act
      final result = parser.parseConfigValue<bool>(mockValue, 'BOOLEAN');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, equals(true));
      expect(result.source, equals('valueStatic'));
    });

    test('parses JSON values correctly', () {
      // Arrange - direct setup
      mockValue.setStringValue('{"key":"value"}');

      // Act
      final result =
          parser.parseConfigValue<Map<String, dynamic>>(mockValue, 'JSON');

      // Assert
      expect(result, isNotNull);
      expect(result!.value, isA<Map<String, dynamic>>());
      expect(result.value['key'], equals('value'));
      expect(result.source, equals('valueStatic'));
    });

    test('returns null when JSON is invalid', () {
      // Arrange - direct setup
      mockValue.setStringValue('invalid-json');

      // Act
      final result =
          parser.parseConfigValue<Map<String, dynamic>>(mockValue, 'JSON');

      // Assert
      expect(result, isNull);
    });

    test('returns null when valueType is unknown', () {
      // Act
      final result = parser.parseConfigValue<String>(mockValue, 'UNKNOWN');

      // Assert
      expect(result, isNull);
    });

    test('returns null when valueType is null', () {
      // Act
      final result = parser.parseConfigValue<String>(mockValue, null);

      // Assert
      expect(result, isNull);
    });
  });
}

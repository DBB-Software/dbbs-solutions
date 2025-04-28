// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter_test/flutter_test.dart';

// Project imports:
import 'package:firebase/src/remote-config/remote_config_context.dart';

void main() {
  group('RemoteConfigParameter', () {
    test('creates instance with required parameters', () {
      // Act
      final parameter = RemoteConfigParameter(
        defaultValue: 'test',
        valueType: 'STRING',
      );

      // Assert
      expect(parameter.defaultValue, equals('test'));
      expect(parameter.valueType, equals('STRING'));
    });

    test('creates instance from JSON', () {
      // Arrange
      final json = {
        'defaultValue': {'value': 'test-value'},
        'valueType': 'STRING',
      };

      // Act
      final parameter = RemoteConfigParameter.fromJson(json);

      // Assert
      expect(parameter.defaultValue, equals('test-value'));
      expect(parameter.valueType, equals('STRING'));
    });
  });

  group('RemoteConfigDefaultValuesExtension', () {
    test('creates map from JSON', () {
      // Arrange
      final json = {
        'parameters': {
          'string': {
            'defaultValue': {'value': 'test-string'},
            'valueType': 'STRING',
          },
          'number': {
            'defaultValue': {'value': '42'},
            'valueType': 'NUMBER',
          },
        },
      };

      // Act
      final values = RemoteConfigDefaultValuesExtension.fromJson(json);

      // Assert
      expect(values, isA<Map<String, RemoteConfigParameter>>());
      expect(values.length, equals(2));
      expect(values['string']?.defaultValue, equals('test-string'));
      expect(values['string']?.valueType, equals('STRING'));
      expect(values['number']?.defaultValue, equals('42'));
      expect(values['number']?.valueType, equals('NUMBER'));
    });
  });

  group('RemoteConfigContext', () {
    test('creates instance with required parameters', () {
      // Arrange
      final parameters = <String, RemoteConfigParameter>{
        'test': RemoteConfigParameter(
          defaultValue: 'value',
          valueType: 'STRING',
        ),
      };
      final settings = RemoteConfigSettings(
        fetchTimeout: const Duration(seconds: 10),
        minimumFetchInterval: const Duration(hours: 1),
      );

      // Act
      final context = RemoteConfigContext(
        defaultParameters: parameters,
        settings: settings,
      );

      // Assert
      expect(context.defaultParameters, equals(parameters));
      expect(context.settings, equals(settings));
    });
  });
}

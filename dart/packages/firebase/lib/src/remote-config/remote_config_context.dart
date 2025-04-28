// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';

typedef RemoteConfigDefaultValues = Map<String, RemoteConfigParameter>;

class RemoteConfigParameter {
  final dynamic defaultValue;
  final String valueType;

  RemoteConfigParameter({
    required this.defaultValue,
    required this.valueType,
  });

  factory RemoteConfigParameter.fromJson(Map<String, dynamic> json) {
    return RemoteConfigParameter(
      defaultValue: json['defaultValue']['value'],
      valueType: json['valueType'],
    );
  }
}

extension RemoteConfigDefaultValuesExtension on RemoteConfigDefaultValues {
  static RemoteConfigDefaultValues fromJson(Map<String, dynamic> json) {
    final parametersJson = json['parameters'] as Map<String, dynamic>;
    return parametersJson.map(
      (key, value) => MapEntry(
        key,
        RemoteConfigParameter.fromJson(value as Map<String, dynamic>),
      ),
    );
  }
}

class RemoteConfigContext {
  final RemoteConfigDefaultValues defaultParameters;
  final RemoteConfigSettings settings;

  const RemoteConfigContext({
    required this.defaultParameters,
    required this.settings,
  });
}

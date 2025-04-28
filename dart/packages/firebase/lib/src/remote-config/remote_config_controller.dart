// Flutter imports:
import 'package:flutter/foundation.dart';

// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';

// Project imports:
import 'remote_config_context.dart';
import 'remote_config_value_parser.dart';

class RemoteConfigController extends ChangeNotifier {
  late RemoteConfigDefaultValues _defaultParameters;

  final FirebaseRemoteConfig _remoteConfig;

  final RemoteConfigValueParser _parser = RemoteConfigValueParser();

  RemoteConfigController(this._remoteConfig);

  Future<void> initialize(RemoteConfigContext context) async {
    try {
      await _remoteConfig.setConfigSettings(context.settings);

      final defaults = context.defaultParameters.map(
        (key, parameter) => MapEntry(key, parameter.defaultValue),
      );
      await _remoteConfig.setDefaults(defaults);

      _defaultParameters = context.defaultParameters;

      await _remoteConfig.fetchAndActivate();
      notifyListeners();
    } catch (e) {
      throw Exception(e);
    }
  }

  RemoteConfigDefaultValues get defaultParameters => _defaultParameters;

  ParsedValue<T>? getSingleValue<T>(String key) {
    try {
      final value = _remoteConfig.getValue(key);
      return _parser.parseConfigValue<T>(
          value, _defaultParameters[key]?.valueType);
    } catch (e) {
      return null;
    }
  }

  Map<String, ParsedValue<dynamic>?> getAllValueAsMap() {
    final allValues = _remoteConfig.getAll();
    return Map.fromEntries(
      allValues.entries.map((entry) {
        final key = entry.key;
        final value = entry.value;
        final valueType = _defaultParameters[key]?.valueType;

        return MapEntry(
            key, _parser.parseConfigValue<dynamic>(value, valueType));
      }),
    );
  }

  List<MapEntry<String, ParsedValue<dynamic>?>> getAllValueAsList() {
    return getAllValueAsMap().entries.toList();
  }
}

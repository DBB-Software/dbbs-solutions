// Dart imports:
import 'dart:convert';

// Package imports:
import 'package:firebase_remote_config/firebase_remote_config.dart';

class ParsedValue<T> {
  final T value;
  final String source;

  ParsedValue({
    required this.value,
    required this.source,
  });
}

class RemoteConfigValueParser {
  ParsedValue<T>? parseConfigValue<T>(
      RemoteConfigValue value, String? valueType) {
    dynamic parsedValue;

    switch (valueType) {
      case "STRING":
        parsedValue = value.asString();
        break;
      case "NUMBER":
        parsedValue = value.asInt();
        break;
      case "DOUBLE":
        parsedValue = value.asDouble();
        break;
      case "BOOLEAN":
        parsedValue = value.asBool();
        break;
      case "JSON":
        try {
          parsedValue = jsonDecode(value.asString());
        } catch (e) {
          return null;
        }
        break;
      default:
        return null;
    }

    return ParsedValue<T>(
      value: parsedValue as T,
      source: value.source.name,
    );
  }
}

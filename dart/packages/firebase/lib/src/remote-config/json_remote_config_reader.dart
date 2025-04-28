// Dart imports:
import 'dart:convert';

// Flutter imports:
import 'package:flutter/services.dart';

// Project imports:
import 'remote_config_context.dart';

class JsonRemoteConfigReader {
  String filePath = "assets/firebase/remote_config.json";

  JsonRemoteConfigReader();

  set updateFilePath(String newFilePath) {
    filePath = newFilePath;
  }

  Future<RemoteConfigDefaultValues> readDefaultValues() async {
    try {
      final response = await rootBundle.loadString(filePath);
      final Map<String, dynamic> jsonData = json.decode(response);
      return RemoteConfigDefaultValuesExtension.fromJson(jsonData);
    } catch (e) {
      throw Exception('Failed to read remote config: $e');
    }
  }
}

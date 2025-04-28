// Package imports:
import 'package:firebase/main.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_remote_config/firebase_remote_config.dart';

// Project imports:
import 'package:flutter_mobile/firebase_options.dart';

class FirebaseInitializer {
  static final RemoteConfigController _remoteConfigController =
      RemoteConfigController(FirebaseRemoteConfig.instance);

  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    final JsonRemoteConfigReader jsonRemoteConfigReader =
        JsonRemoteConfigReader();

    final remoteConfigContext = RemoteConfigContext(
      defaultParameters: await jsonRemoteConfigReader.readDefaultValues(),
      settings: RemoteConfigSettings(
        fetchTimeout: const Duration(seconds: 10),
        minimumFetchInterval: const Duration(hours: 1),
      ),
    );
    await _remoteConfigController.initialize(remoteConfigContext);
  }

  static RemoteConfigController get remoteConfigController =>
      _remoteConfigController;
}

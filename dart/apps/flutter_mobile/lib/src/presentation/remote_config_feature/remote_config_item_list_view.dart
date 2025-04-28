// Flutter imports:
import 'package:flutter/material.dart';

// Package imports:
import 'package:firebase/main.dart';
import 'package:provider/provider.dart';

// Project imports:
import '../settings/settings_view.dart';

/// Displays a list of SampleItems.
class SampleItemListView extends StatelessWidget {
  const SampleItemListView({
    super.key,
  });

  static const routeName = '/';

  @override
  Widget build(BuildContext context) {
    final remoteConfig = context.watch<RemoteConfigController>();
    final configValues = remoteConfig.getAllValueAsList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Remote Config Values'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.restorablePushNamed(context, SettingsView.routeName);
            },
          ),
        ],
      ),
      body: ListView.builder(
        restorationId: 'remoteConfigListView',
        itemCount: configValues.length,
        itemBuilder: (BuildContext context, int index) {
          final entry = configValues[index];
          final key = entry.key;
          final parsedValue = entry.value;

          return ListTile(
            title: Text(key),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Value: ${parsedValue?.value}'),
                Text('Source: ${parsedValue?.source}'),
              ],
            ),
          );
        },
      ),
    );
  }
}

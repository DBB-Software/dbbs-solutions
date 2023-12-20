# @dbbs/settings

Repository with settings configurations

After commit file should be uploaded to s3 bucket

### Deploying configuration

Development:

```shell
aws s3 cp development/settings.json s3://dbbs-settings-development/settings.json
```

Staging:

```shell
aws s3 cp staging/settings.json s3://dbbs-settings-staging/settings.json
```

Production:

```shell
aws s3 cp production/settings.json s3://dbbs-settings-production/settings.json
```

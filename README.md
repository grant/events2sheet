# events2sheets

A tool for logging CloudEvents to Google Sheets. Useful for debugging Events.

Sheets tutorial: https://medium.com/google-cloud/google-sheets-cloud-run-ffc1875d2a1

## Setup

Create credentials

```sh
# Get the current project
PROJECT=$(gcloud config get-value core/project 2> /dev/null)

# Create a service account (aka robot account)
gcloud iam service-accounts create sa-name \
  --description="sa-description" \
  --display-name="sa-display-name"

# Create and download credentials for the service account
gcloud iam service-accounts keys create creds.json \
  --iam-account sa-name@$PROJECT.iam.gserviceaccount.com

# Copy service account email
echo "sa-name@$PROJECT.iam.gserviceaccount.com" | pbcopy
```

- Create a Sheet
  - http://sheets.new
- Select all rows
  - Format > Number > Automatic

## Test locally

```sh
npm start
# curl localhost:8080
```

## Deploy

```sh
MY_RUN_SERVICE=log-cloudevent
GCP_PROJECT=$(gcloud config list --format 'value(core.project)' 2>/dev/null)
gcloud builds submit \
--tag gcr.io/$GCP_PROJECT/$MY_RUN_SERVICE
gcloud run deploy $MY_RUN_SERVICE \
--image gcr.io/$GCP_PROJECT/$MY_RUN_SERVICE \
--platform managed \
--allow-unauthenticated
```

## Test Deploy

```sh
RUN_SERVICE=$(gcloud run services describe $MY_RUN_SERVICE --format 'value(status.address.url)')
curl $RUN_SERVICE
```

## Create Triggers

### Pub/Sub

```sh
TOPIC=my-topic-123

gcloud pubsub topics create $TOPIC
gcloud alpha events triggers create pubsub-trigger \
--target-service $MY_RUN_SERVICE \
--type com.google.cloud.pubsub.topic.publish \
--parameters topic=$TOPIC
```

Test:

```sh
gcloud pubsub topics publish $TOPIC --message="Hello there"
```

### Audit Logs – GCS

```sh
MY_GCS_BUCKET=$(gcloud config get-value project)-gcs-bucket2


gsutil mb -p $(gcloud config get-value project) \
  -l us-central1 \
  gs://"$MY_GCS_BUCKET"
```

```sh
gcloud alpha events triggers create my-gcs-trigger224 \
  --target-service $MY_RUN_SERVICE  \
  --type com.google.cloud.auditlog.event \
  --parameters methodName=storage.buckets.update \
  --parameters serviceName=storage.googleapis.com \
  --parameters resourceName=projects/_/buckets/"$MY_GCS_BUCKET"
```

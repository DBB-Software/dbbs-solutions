# <COUNTRY_CODE>-scraper - Serverless Node.js Application

## Overview

The **<COUNTRY_CODE>-scraper** is a serverless application designed to automate the daily retrieval of legal documents from a specific resource. The scraper leverages an API to identify updated documents, uploads them to S3 bucket, and sends the updated information to an **AWS SQS queue** for further processing.

This tool ensures efficient, reliable, and up-to-date data acquisition, streamlining workflows that depend on accurate legal document tracking.

---

## Features

1. **Daily Execution**:
    - Automatically runs every day to fetch the latest updates for the previous day from the API.

2. **API scraping**:
    - Extracts download links for published and updated documents at a specific date from the specified API.

3. **Document Retrieval**:
    - Downloads updated legal documents and metadata.

4. **AWS S3 Integration**:
    - Uploads the documents to S3 bucket

5. **AWS SQS Integration**:
    - Sends the details of updated documents and metadata to an SQS queue for downstream processing. In particular: link to the document on the S3, links to the source `pdf` and `xml` documents.
    
    ```bash
    # To retrieve the document as 'xml'
    curl -L --header "Accept: application/xml" <DOCUMENT_URL>
    
    # To retrieve the document as 'pdf'
    curl -L --header "Accept: application/pdf" <DOCUMENT_URL>
    ```

6. **Serverless Architecture**:
    - Built using the Serverless Framework as AWS Lambda for scalability and cost-effectiveness.
    - Executes only when triggered, minimizing resource usage.

---

## Usage

### Build the Application
To compile TypeScript to JavaScript and prepare the application for deployment or local testing:
```bash
yarn build
```

### Run Locally
To run the application locally with the Serverless offline plugin:
```bash
yarn dev
```

This will start the application locally on `http://localhost:3032`.

### Test the Application
Run the test suite to ensure functionality:
```bash
yarn test
```

### Clean the Environment
Remove all generated files and dependencies:
```bash
yarn clean
```

---

## Deployment

Deploy the application to your AWS environment using the Serverless Framework:
```bash
APP=<COUNTRY_CODE>-scraper STAGE=[staging] yarn deploy:serverless
```

Replace `[staging]` with your desired environment stage (e.g., `local`, `production`).

---

## Configuration

Ensure the following environment variables are set up in your `.env` file:

- `REGION`: The AWS region where your serverless resources (such as SQS and S3) are deployed.  
  Example: `us-east-1`.

- `STAGE`: The deployment stage of the application.  
  Common values include `local`, `staging`, or `production`.

- `ACCOUNT_ID`: Your AWS account ID.  
  Used to ensure correct configuration of resources like SQS and S3.

- `SQS_QUEUE_NAME`: The name of the SQS queue where updated document information will be sent.  
  Example: `<COUNTRY_CODE>-documents-updates-queue`.

- `SQS_QUEUE_URL`: The full URL of the SQS queue to which the application sends messages.  
  Example: `https://sqs.eu-central-1.amazonaws.com/<ACCOUNT_ID>/<SQS_QUEUE_NAME>`.

- `S3_DOCUMENTS_BUCKET`: The name of the S3 bucket where retrieved legal documents will be stored.  
  Example: `dbbs-documents-local`.

- `S3_DOCUMENTS_BUCKET_URL`: The full URL of the S3 bucket for saving documents.  
  Example: `https://<S3_DOCUMENTS_BUCKET>.s3.amazonaws.com`.

---

## How It Works

1. **Trigger**: The application runs daily (using a scheduled AWS Lambda trigger).
2. **API Scraping**: Fetches links to yesterday published and updated documents from the API.
3. **Legal documents fetching**: Fetches and parses content and metadata for a given document.
4. **S3 upload**: Uploads fetched data to S3 bucket.
5. **SQS Message**: Sends details of the saved documents to the SQS queue.

---

## Scripts

The `package.json` includes the following useful scripts:

- `build`: Compiles TypeScript files into JavaScript for deployment.
- `dev`: Builds the application and runs it locally using the Serverless offline plugin.
- `lint`: Lints and fixes code style issues using ESLint.
- `test`: Runs the test suite with Jest.
- `watch`: Watches for changes in TypeScript files and recompiles automatically.
- `clean`: Cleans the project directory by removing generated files and dependencies.

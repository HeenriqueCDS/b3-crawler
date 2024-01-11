# B3 Crawler

A lambda application that crawls data of the brazilian stock market.

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Testing Locally](#testing-locally)
- [Folder Structure](#folder-structure)
- [Deploy](#deploy)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About

Explain what your project does,
This repository houses two lambda functions

`invocable-importer.ts`
Receives a message from a SQS Queue, containing a tickerId, then it uses it to insert this ticker information and history into a Postgres database using AWS RDS

`scheduled-importer.ts`
This one is scheduled and triggered by Event Bridge at AWS, it retrieves data from 10 new tickets, and inserts into the same database as the previous function

This lambdas are part of a bigger application called *B3Finder*, it lists stocks from B3 (Brazilian Stock Market) and show to the user useful information to help him to choose where to invest his money

## Getting Started
### Prerequisites

To run and deploy the application you'll need 4 simples things

- An account at [BRAPI](https://brapi.dev/), to generate your access token and then save it in your `.env` 
- [Node.js](https://nodejs.org/en) installed, i recommend you to always use the LTS version, but if there any conflicts, i am using `v18.7.0`
- [Docker Compose](https://docs.docker.com/compose/) to run a local database, so you don't get billed on your
- [AWS CLI](https://docs.aws.amazon.com/cli/) to deploy the application, you need to install and configure the AWS CLI

### Testing Locally

Step-by-step instructions on how to test the lambdas locally.

```bash
# Install dependencies 
npm install

# Run your local database
docker-compose up #or docker compose up

#Run the tests
npm run test

```
Then done, you'll have your tests running!

## Folder structure

```
/project-root
│
├── /src # Source code
│ ├── /functions # Lambda functions
│ ├── /scripts # Contains the script to create the database tables if they dot no exists
│ ├── /services # Configurations for the usage of external services, Eg. database and data provider
│ ├── /tests # Integration tests
│ ├── /types # API Response types
│ ├── /utils # Some util functions such as data mappers and api requests
│
├── .gitignore # Git ignore file
├── package.json # Node.js package file
├── README.md # Project README file
├── .gitignore # Git ignore file
```

## Deploy 

Starting from the assumption you have already installed the [AWS CLI](#prerequisites) and created a IAM role with the lambda basic permission, and access to SQS and RDS, you'll need to run a simple sequence of commands

```bash
#Create the build of the application, it owns a pre and a post scripts as you can se in the package.json ile
npm run build

#To deploy the invocable function, run the following command
aws lambda create-function --function-name b3-invocable-importer --runtime "nodejs18.x" --role arn:aws:iam::12345678910:role/your-lambda-role --zip-file "fileb://dist/invocable-importer-importer.zip" --handler invocable-importer.handler

#To deploy the scheduled function, run the following command
aws lambda create-function --function-name b3-scheduled-importer --runtime "nodejs18.x" --role arn:aws:iam::12345678910:role/your-lambda-role --zip-file "fileb://dist/scheduled-importer-importer.zip" --handler scheduled-importer.handler
```

## License

This project is licensed under the MIT License 

## Acknowledgments

 - [Henrique](https://www.linkedin.com/in/henriquecds/), designed and developed the application
 - [Giovanni](https://www.linkedin.com/in/giovanni-sacchitiello), designed the architecture and solution


# Udacity Cloud Developer Nanodegree Capstone Project

This is my capstone project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990), it showcase my new skills gained from the materials and hands-on projects offered by Udacity.

# Summary

As a user, you can login and register for a service where you can save the books you want to read in the future, and mark them as "complete" when you read them

It's using Serverless technologies and it demonstrates:

* AWS
  * Lambdas Functions (Serverless functions)
  * DynamoDB (NoSql Database)
  * S3 Bucket (File storages service)
* Serverless Framework
* Auth0
  * 3rd party OAuth service
* Optimisations
  * Global Secondary Indexes on DynamoDb
  * Individual packaging of Lambdas functions
* Fontend Client
  * React

# Requirements
  * Node 12
  * AWS Account
  * AWS CLI
  * Serverless Framework
  * Auth0 Account

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. 

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")



API Endpoit for my implementation:
```
https://ovbeog9smf.execute-api.us-east-1.amazonaws.com/dev
```


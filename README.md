# Appoint Me: web service


This project encompasses the web service API implementation for a progressive web application (PWA) called Appoint Me. The web service operates as an API only backend running on Express.js and MongoDB. Combined with the frontend, this project represents a full MERN stack progressive web app with backend unit and integration tests.

This project was prepared as part of the Project Implementation Cluster course at TAFE in 2022.

## Installation

Follow the steps below to install and configure this web service.

### Clone the Github repository

In a terminal on your local machine, cd to the location where you want to save the web service and clone this repository:

`git clone https://github.com/Jet004/appoint-me-backend.git`

Once you have cloned the repository, cd into the root directory:

`cd appoint-me-backend`

### Install dependencies

Install all of the project dependencies:

`npm install`

## Configuration

### Configure environment variables

This project implements the `dotenv` environment file package to ensure that key configurations remain private and secure. As such, this distribution omits the .env file necessary for the web service to run.

You should always configure a unique `.env` file for the specific environment in which the web service will operate. **Never commit your environment files to Github**.

The following environment variables are required for the web service to run and should be implemented in a fashion suitable to your environment.

- PORT
- DB_URL
- JWT_SECRET
- CORS_ORIGIN

##### PORT

The port number you want the web service to run on . This value is passed to the express server and will need to be included in the localhost domain when making requests to the service. Example implementation in the .env file:

`PORT=8000`

##### DB_URL

The MongoDb connection string for your database instance. This can be any valid MongoDB connection string which points to a running MongoDb instance. If you are using MongoDB Atlas, remember to [add your IP address to the Atlas whitelist](https://www.mongodb.com/docs/atlas/government/tutorial/allow-ip/). 

Example implementation for MongoDB Atlas (replace values between angle brackets <> with your own MongoDB instance values):

`DB_URL=mongodb+srv://<username>:<password>@cluster0.gifku.mongodb.net/<db_name>?retryWrites=true&w=majority`

Example of a connection string for a MongoDB instance running on the local machine (replace values between angle brackets <> with your own MongoDB instance values):

`DB_URL=mongodb://127.0.0.1:27017/<db_name>?directConnection=true&serverSelectionTimeoutMS=2000`

##### JWT_SECRET

This web service implements the default encryption method implemented in the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package (HS256 symmetrically signed encryption method). This encryption method requires a user generated secret key which is used to encrypt JWT tokens. **Your secret key is used to secure JWT access and refresh tokens and should always be kept private and secure**. Leaking your private key will result in a major security breach.

Example secret key in .env file (replace the insecure example key with your actual secret key):

`JWT_SECRET=ThisIsNotASecureSecretKey`

##### CORS_ORIGIN

By default most browsers block requests to servers which are different from the 'origin' domain. Since this PWA is designed to separate the frontend and backend code so each can run from a separate server and communicate via a RESTful API, Cross Origin Resource Sharing (CORS) needs to be taken into account in order for the browser to allow the two services to communicate. The [cors package](https://expressjs.com/en/resources/middleware/cors.html) for Express.js enables the application to nominate which domains can access the API. The whitelist for allowed domains should be specified in the CORS_ORIGIN environment variable as shown below:

`CORS_ORIGIN=https://domain@example.com`

## Running the development server

With all of the dependencies installed and environment configuration completed, you can now run the development server and access the API endpoints by making requests either from localhost or one of the allowed URLs you specified in the CORS_ORIGIN environment variable. To run the development server navigate to the project root directory and enter the following command in the terminal:

`npm run dev`

This will instantiate a node http server and begin listening for requests to the localhost domain and port.

That's it! You now have the backend web service up and running on your local machine! 

To stop the development server press `control + c` (Mac).

## Deployment

### Building production files - not yet implemented

This web service uses the Babel compiler to transpile the project code into an earlier version of JavaScript for efficiency and compatibility with a wider range of browsers. As such, the project must first be 'built' (compiled) before it is ready to be deployed to a production server.

This feature has not yet been implemented. Look out for it in the coming weeks!

## Testing the web service

This web service was developed using test driven development with unit tests implemented for all controllers and integration tests for testing all API endpoints.

In order to meed project deadlines unit tests for the Mongoose models has not been implemented. Also, some of the controllers only have test cases for successful requests and need to have failure cases tested. This will be implemented after the frontend has been developed.

The test scripts for this project were implemented using the [Jest](https://jestjs.io/) testing suite and integrated with the express application and babel. This allows all tests to be run with a single terminal command:

`npm test`

The integration endpoint tests instantiate a separate express server on port 3200 and interface with a test database so the test runs will not conflict with the development server. Currently the development server uses the same test database. This will change in future to prevent any possible conflicts between the development and testing environments.

Test files will not be included in the production build. This lightens the weight of the production version of the application and fully removes any possible sources of conflicts from the codebase.

While not yet implemented, the tests for this project will be implemented into a Github CI/CD pipeline so the test suite will run after the build phase and before deployment to the staging environment.

## Notes
# Appoint Me: web service

AppointMe is an appointment management and CRM application for businesses employing an appointment based business model. Businesses can define a suite of services to offer to clients and manage bookings for those services. The core of the system revolves around the calendar system which provides a graphical display of appointments. Clients can view the services offered by the business and book appointments via the app.

This repository encompasses the web service API implementation for for the application. The web service operates as an API only backend running on Express.js awith a MongoDB database. Combined with the frontend, this project represents a full MERN stack progressive web app with backend unit and integration tests. Below is a list of backages and frameworks implemented in the web service:

- bcrypt - version 5.0.1
- cors - version 2.8.5
- date-fns - version 2.28.0
- dotenv - version 16.0.0
- express - 4.17.3
- express-fileupload - version 1.3.1
- express-rate-limit - version 6.3.0
- express-slow-down - version 1.4.0
- express-validator - version 6.14.0
- jsonwebtoken - version 8.5.1
- mongoose - version 6.2.8

### bcrypt

This package is a cryptography package. In this project it is used solely for hashing and checking user passwords. As it is part of the authentication system for the API it can be found in two places, the registration system and the login system. The registration system uses the synchronous hash function of bcrypt to generate a hash from the user's password. This hash is then saved to the database in an unreadable format. On login this hash is retrieved and compared to the login password using bcrypt's synchronous compariston function to determine if user credentials are correct or not.

### cors

The cors package is a middleware designed to simplify the process of handling cross-origin requests from browsers. It sets the CORS headers and informs browsers whether or not to allow arequest to be made to the server. By defining a whitelist of origins which are allowed to send requests to the web service access rights to the API backend can be controlled to a greater extent. It's important to note however that browser vendors choose whether or not to include CORS policy checks. This package will not prevent requests from cURL, postman or any other raw HTTP request method and so should not be relied on for security. This middleware has been implemented in the app.js file.

### date-fns

This package contains over 200 functions for working with date objects in JavaScript. It is a lightweight but powerful package for handling date and time conversions, formatting and timezone offsets. As an application focused on managing appointments, this package has been used in a number of places in the application. The appointments controller uses this package extensively for managing date and time format, timezone offsets and date arithmetic.

### dotenv

This package takes values stored as key value pairs in a .env file and adds them to the environment variables as part of the runtime environment. This is useful for keeping the variables secure and the stored variables are typically environment dependent meaning they should be configured as a part of deployment and can change application behaviour based on what environment the application is being run in. In this application dotenv has been used to create four environment variables: PORT, DB_URL, JWT_SECRET and CORS_ORIGIN.

### express

Express is the backend framework used to create this project. It provides a set of tools for easily defining routes, middleware, controllers, database interactions and responses to client requests. It is a powerful but flexible framework allowing the developer to use keep bundle size to a minimum as each dependency of the project must be installed in addition to Express. There is no pre-installed set of features which are never utilised. The Express application in this project is defined in the app.js file.

### express-fileupload

This package is a plugin for express which reads files send in a request and makes them available as part of the request object. By making the file available to controllers via the request object this project has implemented functionality for users to upload display images for their profile pictures.

### express-rate-limit

This package simplifies the process of tracking the number or requests users make and setting rate limits. Once a user reaches their limit within the specified timeframe they can no longer make requests to the API. As specified in the project specifications there is a hard limit of 500 requests per user per day in the production version of the application. This package is a middleware instantiated at the beginning of the application in the app.js file.

### express-slow-down

This package is similar to express rate limit in that it is designed to simplify the process of limiting the number of requests a user can make in a set period of time. While the above package blocks all requests which exceed the hard limit withing the set timeframe, express slow down specifies a delay time. If the number of requests exceeds the set limit then subsequent requests will be delayed by a set amount of time. In this case any more than one request within half a second will be delayed by half a second. This effectively means that any given user can not make more than one request per half second. This package is a middleware and is implemented in the app.js file.

### express-validator

This package is a route level middleware used to define validation rules for user inputs. It has the capability to define validation rules for user input received as url parameters, in the body, headers or files. As route level middleware this package can validate user input before the route's controller is called. The package has a pre-defined set of validators which streamline the validation process, allow custom messages to be displayed on failure of any criteria and allow custom validators to be defined. This package also provides sanitisation methods built in. This package has been used on all routes in the application to validate user inputs.

### jsonwebtoken

This package provides functions for creating and managing JSON web tokens. It accepts a wide variety of encryption methods for securing tokens and a function for validating that any given token originated from the server. This forms the basis of the authentication system implemented in this project. The funcionality of this package is applied primarilly in the login controller, logout controller and sessionHandler middleware. By implementing a custom middleware every request is checked to see if authentication tokens are present and automatically verifies the user and builds a session object which is attached to the request object. This allows user data to be readily accessible in any route requiring authentication. The resultant session object is also used for validating that a user is logged in and of the required user type.

### mongoose

The mongoose package is essentially an ODM (Object Document Mapping) module used to translate MongoDB schemas into readily usable objects. It defines object schemas which are both simple and powerful for interacting with a MongoDB database. This package also has the capability to integrate validation at the database layer and instance methods for defining common functionality for a given model. This project has implemented mongoose to define and handle all MongoDD database interactions. All mongoose schemas and query methods can be found in the models directory.

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

This project has been deployed to a Heroku server. To emulate this follow the steps below.

First create an account on the heroku platform [here](https://www.heroku.com) and log in.

Download the Heroku CLI tool [here](https://devcenter.heroku.com/articles/heroku-cli) and follow the steps to log in via teh CLI tool.

Create a new application instance on Heroku replacing <App Name> with the name of your application:

`heroku apps:create <App Name>`

Create a 'Procfile' in the application root directory following the instruction [here](https://devcenter.heroku.com/articles/procfile) to define the scripts to run when deploying the application. Eg. To simply run the 'start' script defined in package.json simply include the following line in the Procfile:

`web: npm start`

To push the existing local repository up to the Heroku server first ensure the latest version of the web service has been committed locally:

`git add .`

`git commit -m 'Prepare to push to Heroku server'`

Push to the Heroku server. If you have changed the name of the master branch you will need to modify the command below to suit:

`git push heroku master`

To set the Heroku environment variables (config vars) via the CLI follow the commands below replacing the values with those appropriate to the environment. For the deployed application there are three required config vars:

- DB_URL: a MongoDB connection url
- JWT_SECRET: a secret key for securing authentication tokens
- CORS_ORIGIN: a comma separated list of domains allowed to access the web services resources

Eg.

`heroku config:set JWT_SECRET=IJBsibfi489whc9uc238h9877987dsiounIUBIUB`

That's all! The application should be deployed and running live. You can access the web service using the url given to you after pushing to heroku. Alternately you can find the url in the settings page on Heroku.

If you encounter any errors, check the Heroku log file to see a detailed breakdown of the error:

`heroku logs --tail`

## Testing the web service

This web service was developed using test driven development with unit tests implemented for all controllers and integration tests for testing all API endpoints.

In order to meed project deadlines unit tests for the Mongoose models has not been implemented. Also, some of the controllers only have test cases for successful requests and need to have failure cases tested. This will be implemented after the frontend has been developed.

The test scripts for this project were implemented using the [Jest](https://jestjs.io/) testing suite and integrated with the express application and babel. This allows all tests to be run with a single terminal command:

`npm test`

The integration endpoint tests instantiate a separate express server on port 3200 and interface with a test database so the test runs will not conflict with the development server. Currently the development server uses the same test database. This will change in future to prevent any possible conflicts between the development and testing environments.

Test files will not be included in the production build. This lightens the weight of the production version of the application and fully removes any possible sources of conflicts from the codebase.

While not yet implemented, the tests for this project will be implemented into a Github CI/CD pipeline so the test suite will run after the build phase and before deployment to the staging environment.
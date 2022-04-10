# Appoint Me: web service

This project encompases the web service API implementation for a progressive web application called Appoint Me. The web service operates as an API only backend running on Express.js and MongoDB. Combined with the frontend, this project represents a full MERN stack progressive web app with backend unit and integration tests.

This project was prepared as part of the Project Implementation Cluster course at TAFE in 2022.

## Installation

Follow the steps below to install and configure this web service.

#### Clone the github repository

In a terminal on your local machine, cd to the location where you want to save the web service and clone this repository:

    git clone https://github.com/Jet004/appoint-me-backend.git

Once you have cloned the repository, cd into the root directory:

    cd appoint-me-backend

#### Install dependencies

Install all of the project dependencies:
    
    npm install

#### Configure environment variables

This project implements the dotenv environment file package to ensure that key configurations remain private and secure. As such, this distribution ommits the .env file necessary for the web service to run.

You should always configure a unique .env file for the specific environment in which the web service will operate. NEVER COMMIT YOUR ENVIRONMENT CONFIGURATION FILES TO GITHUB.

The following environment variables are required for the web service to run and should be implemented in a fashion suitable to your environment.

PORT - the port number you want the web service to run on
DB_URL - the MongoDb connection string for your database instance
JWT_SECRET - the encryption string used to encrypt JWT tokens
CORS_ORIGIN - the whitelist for domains which are allowd to make requests to the web service


### Notes
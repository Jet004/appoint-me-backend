# appoint-me-backend

## Installation


## TODO

- input sanitisation and validation in controllers
- unit test cases for testing controller validation
- unit test DB User model + address/appointments
- Refactor how I handle different environment configs

## Necessary changes to ERD

- Users, temp users and business reps need a user type flag so session log entries, crm and appointments know where to look for a particular user

## CI/CD
- Set up Github pipeline to trigger on push
- Set up automatic build process
- Set up automated testing
- Set up automated deployment

## Production: Necessary Changes

- Change error messages to be more generic rather than returning error objects
- Set up babel build command
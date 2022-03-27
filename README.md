# appoint-me-backend

## Installation


## TODO

- input sanitisation and validation in controllers
- Add appointment validator to user validators and adjust integration tests
- Consider how to avoid injection attacks - may need to build user object to pass to DB method... At the moment any extra key value pairs are passed through to the DB...
- unit test DB User model + address/appointments
- Add logic to check if temp user exists when user created - divert all user data to user from temp user - delete temp user (ref crm collection)
- Add logic to prevent business adding more than one temp user with the same email address (ref crm collection)

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
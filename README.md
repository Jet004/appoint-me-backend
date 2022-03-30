# appoint-me-backend

## Installation


## TODO

- Add business details for managing business profile page (Admin panel)
- Add appointment validator to user validators and adjust integration tests
- unit test Models
- Add logic to check if temp user exists when user created - divert all user data to user from temp user - delete temp user (ref crm collection)
- Add logic to prevent business adding more than one temp user with the same email address (ref crm collection)
- Change business controllers to use JWT for abn/id rather than params, update tests to reflect the changes... (Add validation test for get services...)

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
- remove push mock data from index.js

## Possible future improvements

- Improve the unexpected keys function to accept mongoose schemas rather than an array of accepted keys. Function should iterate over the schema and return a flat array of schema keys. The function should be able to accept multiple schemas and combine their keys into a single array.
- 
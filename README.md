# appoint-me-backend

## Installation


## TODO

- Middleware to redirect if already logged in/not logged in... - Handle the redirect on the front end


- Add business details for managing business profile page (Admin panel)

- user routes access restrictions: logged in, user type, isAuthorised
- tempUser routes access restrictions: logged in, user type, isAuthorised
- unit test Models
- Add logic to check if temp user exists when user created - divert all user data to user from temp user - delete temp user (ref crm collection)
- Add logic to prevent business adding more than one temp user with the same email address (ref crm collection)
- Change business controllers to use JWT for abn/id rather than params, update tests to reflect the changes... (Add validation test for get services...)

- subdocument appointments to be implemented if have time
- Add appointment validator to user validators and adjust integration tests
- Limit get all users to those related to a business - also limit get user by ID/email

## Todo when have time

 - extend integration tests to fully test user validation: length, type, unsafe charaters etc.
 - extend JWT implementation to use token family checks to prevent token reuse hacks
 - tests for deletion of expired tokens which still exist in the DB
 - Change logout tests in integration tests and auth controller tests to test DbAddTokenToBlacklist and DbDeleteExpiredTokens
 - add testing for token validity and presence on post/put services routes and unexpected key check tests and login / user type tests
 - implement tests for request logger
 - tests on all protected routes checking that authorisation middleware working correctly
 - Add email validation for account creation
 - Add testing for createTempUser controller - modify integration tests for same - add validation tests for login, user type, abn

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

## JWTs

- https://betterprogramming.pub/jwt-ultimate-how-to-guide-with-best-practices-in-javascript-f7ba4c48dfbd
 



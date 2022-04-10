# appoint-me-backend



## Installation


## TODO

- test that CRM and appointments cascade delete when user / temp user deleted

- Middleware to redirect if already logged in/not logged in... - Handle the redirect on the front end

- Add business details for managing business profile page (Admin panel)

- unit test Models
- Add logic to check if temp user exists when user created - divert all user data to user from temp user - delete temp user (ref crm collection)
- Add logic to check if user / temp user / business rep aleady exists for that email address
- Change business controllers to use JWT for abn/id rather than params, update tests to reflect the changes... (Add validation test for get services...)

- Add appointment validator to user validators and adjust integration tests
- Delete temp user already implemented - handle business deletion of user. ie. CRM
- no longer need tempFlag in CRM model as we now have the userModel field
- negative tests for getClientList controller and route

## Todo when have time

- subdocument appointments to be implemented if have time
- extend integration tests to fully test user validation: length, type, unsafe charaters etc.
- extend JWT implementation to use token family checks to prevent token reuse hacks
- tests for deletion of expired tokens which still exist in the DB
- Change logout tests in integration tests and auth controller tests to test DbAddTokenToBlacklist and DbDeleteExpiredTokens
- add testing for token validity and presence on post/put services routes and unexpected key check tests and login / user type tests
- implement tests for request logger
- tests on all protected routes checking that authorisation middleware working correctly
- Add email validation for account creation
- Add testing for createTempUser controller - modify integration tests for same - add validation tests for login, user type, abn
- Need to add more validation testing for logged in user authorisation on all relevant routes
- Improve how user deletion is handled. At the moment deleting any user type results in a hard delete of any associated CRM (and will be extended to appointments). Ideally:
    - if a user deletes their account it causes a soft delete so businesses retain historical data (but not sensitive user data details)
    - if temp user deleted it is a hard delete after confirmation and data is lost
    - if Business rep is deleted, no CRM operation is performed - but need to check if business should be deleted or not - and therefore also associated CRMs.
    - business deleted user from their side - results in a soft delete - user still has access to data
    - The current cascade delete is not compatible with a multi business version of this app
- Add appointment status: upcoming, completed, cancelled
- Add attendance record to appointment: no show, attended
- Add payments to appointments? Or as separate collection? Track payments and account balances etc.
- appointment must be within business operating hours
- Add failure tests for appointment routes
- Add excluded times - meetings lunch breaks days off etc.
- Auto appointment cancellation when time excluded
- email verification
- email updates/notifications

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

## Notes

- When a user is deleted, the user account will be deleted, but not the CRM. This is to prevent the business from losing access to past services rendered for metrics, tracking and analytics. Instead, set a deleted flag on the CRM entry to show that that user no longer exists
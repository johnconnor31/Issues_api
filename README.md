
GET '/public/health' ----> Check api health;

POST '/public/login' {username, password }, ---> Login with username and password


POST '/public/register' { username, password } ---> Regiser your user 

GET '/issues/:id' (Headers: 'Authorization : Bearer {access_token from login api}') ---> Get an issue by id;

POST '/issues/:id' (Headers: 'Authorization : Bearer {access_token from login api}') ---> Update issue with new fields;

POST '/issues' ---> Create new issue;

GET '/issues' ---> Get all issues;

GET '/revisions/:id' --->  Get all revisions of an issue by id;

POST '/revisions/compare/:id' { revision1: number, revision2: number } ---> Compare two revisions of an issue by id;

# SocialAppAPI

A social app API

Hosted here: [Social app API](https://mighty-castle-97073.herokuapp.com/)

Endpoints:

1. A user signup **POST** api **/user/signup** accepting name(as name), password(as password) and email(as email) as input.
2. A user signing in **POST** api **/user/signin** accepting email(as email) and password(as password) as input and returning auth token as response.
3. A user profile **GET** api **/user/profile** accepting name(as name) in params and token from login(as x-api-key) in header, returning user detail as response.
4. A user profile update **POST** api **/user/profile/update** accepting new name(as name), old email(as email) and old password(as password) along with token from login(as x-api-key) in header.


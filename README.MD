#### Description

API for the running viz app. Provides a CRUD for managing running data, and also integration with Polar watches, by using the Polar Accesslink API v3.

#### Setup

1. Install the necessary dependencies:

```bash
npm install
```

2. Setup a .env file in the project's root. Should contain the following:

```
MONGO_URI = *mongodb connection string*
JWT_SECRET = *random string to hash the tokens*
JWT_EXPIRATION = *token expiration period*

POLAR_BASIC_AUTH = *polar basic authorization code*
POLAR_CLIENT_ID = *polar client id*
```

To generate the credentials related to the Polar Accesslink API, it is necessary to first [create a Polar Flow Account](https://flow.polar.com/register).

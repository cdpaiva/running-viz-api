const fetch = require("node-fetch");
const { BadRequestError } = require("../errors");
const Integration = require("../models/Integration");

const getProfile = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new BadRequestError("No user id provided.");
  }

  const integration = await Integration.findOne({ userId: id });
  if (!integration) {
    return res.status(200).json({ msg: "User has no integrations." });
  }

  res.status(200).json({ profile: integration.profile });
};

// should use the auth middleware?
const createProfile = async (req, res) => {
  const { userId } = req.body;
  const integration = await Integration.findOne({ userId: userId });
  // should also check for the token's expiration date
  const token = integration.token.access_token;

  const profile = await registerUser(token, userId);
  integration.profile = profile;
  await Integration.findOneAndUpdate({ userId: userId }, integration);
  res.status(200).send(profile);
};

const getAuthCode = async (req, res) => {
  const userId = req.query.state;
  console.log(userId);
  const code = req.query.code;
  if (!code) {
    throw new BadRequestError("No authorization code provided.");
  }

  const token = await getToken(code, userId); //8c7ae4df3a32db4721cd48a6d23ec0dd
  console.log(token);
  // const user = await registerUser(token.access_token, req.user.userId);
  res.status(200).json({ token });
};

const getToken = async (code, userId) => {
  const body = {
    grant_type: "authorization_code",
    code: code,
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Authorization: `Basic ${process.env.POLAR_BASIC_AUTH}`,
  };

  const res = await fetch("https://polarremote.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams(body),
    headers: headers,
  });
  const access_token = await res.json();
  await Integration.create({ userId, code, token: access_token });
  return access_token;
};

const registerUser = async (token, id) => {
  console.log("User access token: " + token);
  const inputBody = {
    "member-id": id,
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch("https://www.polaraccesslink.com/v3/users", {
      method: "POST",
      body: inputBody,
      headers: headers,
    });
    console.log(res);
    if (res.status !== 200) {
      return "Failed to create the user";
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// code d9fb91439bbef29d6b82ff0655caadc8

/*
{
    "polar-user-id": 43527991,
    "member-id": "ah8293",
    "registration-date": "2023-06-06T15:30:25.000Z",
    "first-name": "Carlos",
    "last-name": "Paiva",
    "birthdate": "1990-05-17",
    "gender": "MALE",
    "weight": 76.0,
    "height": 183.0,
    "extra-info": []
}

// response from create transaction

{
    "transaction-id": 271055255,
    "resource-uri": "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255"
}

// response from getting the transaction id

{
      "exercises": [
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013011",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013038",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013064",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013091",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013116",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013132",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013167",
        "https://www.polaraccesslink.com/v3/users/43527991/exercise-transactions/271055255/exercises/296013190"
    ]
}

// single exercise response

{
  {
    "upload-time": "2023-05-16T18:10:02.000Z",
    "id": 296013011,
    "polar-user": "https://www.polaraccesslink.com/v3/users/43527991",
    "transaction-id": 271055255,
    "device": "Polar Vantage M",
    "device-id": "500AF925",
    "start-time": "2023-05-15T17:05:38",
    "start-time-utc-offset": -240,
    "duration": "PT44M5.252S",
    "calories": 546,
    "distance": 5995.0,
    "heart-rate": {
        "average": 142,
        "maximum": 165
    },
    "training-load": 85.0,
    "sport": "RUNNING",
    "has-route": true,
    "detailed-sport-info": "RUNNING",
    "running-index": 46,
    "training-load-pro": {
        "cardio-load": 67.3257,
        "cardio-load-interpretation": "MEDIUM",
        "muscle-load": -1.0,
        "muscle-load-interpretation": "NOT_AVAILABLE",
        "perceived-load": 0.0,
        "perceived-load-interpretation": "NOT_AVAILABLE",
        "user-rpe": "UNKNOWN"
    }
}
}
*/

module.exports = { getAuthCode, getProfile, createProfile };

const fetch = require("node-fetch");
const { BadRequestError } = require("../errors");
const Integration = require("../models/Integration");
const PolarRun = require("../models/PolarRun");
const { StatusCodes } = require("http-status-codes");

const getProfile = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new BadRequestError("No user id provided.");
  }

  const integration = await Integration.findOne({ userId: id });
  if (!integration) {
    return res.status(StatusCodes.NO_CONTENT).end();
  }

  res.status(StatusCodes.OK).json({ profile: integration.profile });
};

const createProfile = async (req, res) => {
  const { userId } = req.body;
  const integration = await Integration.findOne({ userId: userId });
  const token = integration.token.access_token;

  const profile = await registerUser(token, userId);
  integration.profile = profile;
  await Integration.findOneAndUpdate({ userId: userId }, integration);
  res.status(StatusCodes.OK).send(profile);
};

const getAuthCode = async (req, res) => {
  const userId = req.query.state;
  const code = req.query.code;
  if (!code) {
    throw new BadRequestError("No authorization code provided.");
  }

  const token = await getToken(code, userId);
  res.status(StatusCodes.OK).json({ token });
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
    if (res.status !== 200) {
      return "Failed to create the user";
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const syncAccount = async (req, res) => {
  const userId = req.body.userId;
  // get user token and polar-user-id
  const userIntegration = await Integration.findOne({ userId });
  if (!userIntegration) {
    res
      .status(StatusCodes.NOT_FOUND)
      .send({ msg: `Could not find integration data for the user ${userId}` });
    return;
  }
  const token = userIntegration.token.access_token;
  const memberId = userIntegration.profile["polar-user-id"];
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  // start a transaction to check for available exercises
  const transactionsResponse = await fetch(
    `https://www.polaraccesslink.com/v3/users/${memberId}/exercise-transactions`,
    {
      method: "POST",
      headers,
    }
  );

  if (transactionsResponse.status === 204) {
    res.status(StatusCodes.NO_CONTENT).end();
    return;
  }
  const transactions = await transactionsResponse.json();
  const transactionId = transactions["transaction-id"];

  // fetch the list of available exercises with the transaction-id received
  const transactionListResponse = await fetch(
    `https://www.polaraccesslink.com/v3/users/${memberId}/exercise-transactions/${transactionId}`,
    {
      method: "GET",
      headers,
    }
  );

  const transactionList = await transactionListResponse.json();
  const exercises = transactionList.exercises;

  // fetch and save exercise data of all available exercises
  const requests = [];
  for (const link of exercises) {
    requests.push(fetchAndSaveRuns(link, token, userId));
  }
  await Promise.all(requests);

  // commit the transaction once all the data was saved
  await fetch(
    `https://www.polaraccesslink.com/v3/users/${memberId}/exercise-transactions/${transactionId}`,
    {
      method: "PUT",
      headers,
    }
  );

  res.status(StatusCodes.OK).end();
};

function fetchAndSaveRuns(link, token, userId) {
  return fetch(link, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 204) {
        return; // no new data to be synced
      }
      return res.json();
    })
    .then((data) => {
      const polarRun = PolarRun.mapResponseToModel(data);
      polarRun.userId = userId;

      return PolarRun.create(polarRun);
    });
}

module.exports = { getAuthCode, getProfile, createProfile, syncAccount };

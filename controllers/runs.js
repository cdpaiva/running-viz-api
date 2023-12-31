const Run = require("../models/Run");
const PolarRun = require("../models/PolarRun");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllRuns = async (req, res) => {
  const runs = await Run.find({ userId: req.user.userId }).sort("createdAt");
  const polarRuns = await PolarRun.find({ userId: req.user.userId }).sort(
    "createdAt"
  );
  const allRuns = runs.concat(polarRuns);
  res.status(StatusCodes.OK).json({ runs: allRuns });
};

const getRun = async (req, res) => {
  const {
    user: { userId },
    params: { id: runId },
  } = req;

  const polarRun = await PolarRun.findOne({ userId: userId, _id: runId });
  if (!polarRun) {
    const run = await Run.findOne({ userId: userId, _id: runId });
    if (!run) {
      throw new NotFoundError(`No run with id ${runId} found`);
    }
    res.status(StatusCodes.OK).json({ run });
    return;
  } else {
    res.status(StatusCodes.OK).json({ run: polarRun });
  }
};

const createRun = async (req, res) => {
  req.body.userId = req.user.userId;
  console.log(req.body);
  const run = await Run.create(req.body);
  res.status(StatusCodes.CREATED).json(run);
};

const updateRun = async (req, res) => {
  const {
    body: { location, distance, date },
    user: { userId },
    params: { id: runId },
  } = req;

  if (!location || !distance || !date) {
    throw new BadRequestError("Location, distance and date cannot be empty");
  }

  const polarRun = await PolarRun.findOneAndUpdate(
    { userId: userId, _id: runId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!polarRun) {
    const run = await Run.findOneAndUpdate(
      { userId: userId, _id: runId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!run) {
      throw new NotFoundError(`No run with id ${runId} found`);
    }
    res.status(StatusCodes.OK).json({ run });
    return;
  }
  res.status(StatusCodes.OK).json({ run: polarRun });
};

const deleteRun = async (req, res) => {
  const {
    user: { userId },
    params: { id: runId },
  } = req;

  const polarRun = await PolarRun.findOneAndRemove({
    userId: userId,
    _id: runId,
  });

  if (!polarRun) {
    const run = await Run.findOneAndRemove({ userId: userId, _id: runId });
    if (!run) {
      throw new NotFoundError(`No run with id ${runId} found`);
    }
  }
  res.status(StatusCodes.ACCEPTED).send();
};

module.exports = { getAllRuns, getRun, createRun, updateRun, deleteRun };

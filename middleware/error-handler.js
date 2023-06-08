const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later.",
  };

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  // Validation erros
  if (err.name === "ValidationError") {
    (customError.msg = Object.values(err.errors).reduce(
      (acc, prev) => acc + ", " + prev
    )),
      (customError.statusCode = StatusCodes.BAD_REQUEST);
  }

  // Cast errors => raised when mongoose tries to parse invalid ids, for example
  if (err.name === "CastError") {
    customError.msg = `No item found for id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Duplicated emails for registration
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field. Choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

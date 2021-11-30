const CustomAPIError = require("./custom-error");
const { statusCodes } = require("http-status-codes");

class UnathenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.UNAUTHORIZED;
  }
}

module.exports = UnathenticatedError;

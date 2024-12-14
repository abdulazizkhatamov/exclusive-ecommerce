class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = Error.name;
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;

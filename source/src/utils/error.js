// Special type of network error
// ===========================================================================
export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
    this.message = message;
    Error.captureStackTrace(this, NetworkError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

// Special type of validation error
// ===========================================================================
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
    Error.captureStackTrace(this, ValidationError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

// Special type of chrome api error
// ===========================================================================
export class ChromeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ChromeError';
    this.message = message;
    Error.captureStackTrace(this, ChromeError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

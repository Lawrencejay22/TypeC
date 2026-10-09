export default class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

export const badRequest = (message, extra) => new HttpError(400, message, extra);
export const unauthorized = (message = "Please sign in first.") => new HttpError(401, message);
export const forbidden = (message, extra) => new HttpError(403, message, extra);
export const notFound = (message = "Not found.") => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
export const tooMany = (message) => new HttpError(429, message);

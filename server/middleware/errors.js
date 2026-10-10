import mongoose from "mongoose";
import HttpError from "../utils/httpError.js";

export function notFoundHandler(req, res) {
  res.status(404).json({ message: "That endpoint doesn't exist." });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, ...err.extra });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "The request body isn't valid JSON." });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "That request is too large." });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first?.message || "Invalid data." });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid id." });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "That's already taken." });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong on our side. Please try again." });
}

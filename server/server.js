import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

try {
  await connectDB(env.mongoUri);
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`TypeC API listening on http://localhost:${env.port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

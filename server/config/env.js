import "dotenv/config";

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill them in.");
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters long.");
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

const env = {
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  trustProxy: Number(process.env.TRUST_PROXY ?? 1),
  timezone: process.env.TIMEZONE || "Asia/Manila",
  brevo: {
    apiKey: process.env.BREVO_API_KEY || "",
    fromEmail: process.env.MAIL_FROM_EMAIL || "",
    fromName: process.env.MAIL_FROM_NAME || "TypeC",
  },
  contactInbox: process.env.CONTACT_INBOX || "",
};

if (isProduction && (!env.brevo.apiKey || !env.brevo.fromEmail)) {
  console.error("BREVO_API_KEY and MAIL_FROM_EMAIL are required in production.");
  process.exit(1);
}

export default env;

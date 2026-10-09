import { Router } from "express";
import Message from "../models/Message.js";
import env from "../config/env.js";
import { contactLimiter } from "../middleware/limits.js";
import { escapeHtml, sendMail } from "../services/mailer.js";
import * as check from "../utils/validate.js";

const router = Router();

router.post("/", contactLimiter, async (req, res) => {
  const name = check.text(req.body.name, { field: "Name", max: 60 });
  const email = check.email(req.body.email);
  const subject = check.text(req.body.subject, { field: "Subject", max: 100 });
  const message = check.text(req.body.message, { field: "Message", min: 10, max: 2000 });

  const saved = await Message.create({ name, email, subject, message, user: req.user?._id });

  if (env.contactInbox) {
    sendMail({
      to: env.contactInbox,
      subject: `[TypeC contact] ${subject}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }).catch((err) => console.error(`Contact forward failed for ${saved._id}:`, err.message));
  }

  res.status(201).json({ message: "Message sent! We'll get back to you soon." });
});

export default router;

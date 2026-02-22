const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const rootDir = process.cwd();
const port = Number(process.env.PORT || 5000);

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const contactTo = process.env.CONTACT_TO || smtpUser;
const contactFrom = process.env.CONTACT_FROM || smtpUser;

const rateLimitWindowMs = Number(process.env.CONTACT_RATE_WINDOW_MS || 600000);
const rateLimitMax = Number(process.env.CONTACT_RATE_MAX || 5);
const ipBuckets = new Map();

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function trimField(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function overRateLimit(ip) {
  const now = Date.now();
  const history = ipBuckets.get(ip) || [];
  const freshHistory = history.filter((t) => now - t <= rateLimitWindowMs);
  if (freshHistory.length >= rateLimitMax) {
    ipBuckets.set(ip, freshHistory);
    return true;
  }
  freshHistory.push(now);
  ipBuckets.set(ip, freshHistory);
  return false;
}

function requireEnv(res) {
  if (!smtpHost || !smtpUser || !smtpPass || !contactTo || Number.isNaN(smtpPort)) {
    res.status(503).json({ ok: false, error: "Email service not configured." });
    return false;
  }
  return true;
}

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  if (!requireEnv(res)) return;

  const ip = req.ip || "unknown";
  if (overRateLimit(ip)) {
    res.status(429).json({ ok: false, error: "Too many requests. Please try again shortly." });
    return;
  }

  const name = trimField(req.body.name, 100);
  const email = trimField(req.body.email, 200).toLowerCase();
  const topic = trimField(req.body.topic, 120) || "General enquiry";
  const message = trimField(req.body.message, 4000);
  const page = trimField(req.body.page, 500);

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: "Name, email and message are required." });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: "Please provide a valid email address." });
    return;
  }

  const subject = `[DAFC Contact] ${topic}`;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message);
  const safePage = escapeHtml(page || "Unknown");
  const safeIp = escapeHtml(ip);

  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    `Page: ${page || "Unknown"}`,
    `IP: ${ip}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Topic:</strong> ${safeTopic}</p>
    <p><strong>Page:</strong> ${safePage}</p>
    <p><strong>IP:</strong> ${safeIp}</p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage.replaceAll("\n", "<br>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"DAFC Website" <${contactFrom}>`,
      to: contactTo,
      replyTo: email,
      subject,
      text,
      html,
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    res.status(500).json({ ok: false, error: "Unable to send message right now." });
  }
});

app.use((req, res, next) => {
  const blockedPaths = new Set([
    "/server.js",
    "/package.json",
    "/package-lock.json",
    "/Dockerfile",
    "/.dockerignore",
    "/.gitignore",
    "/CLAUDE.md",
    "/README.md",
  ]);

  if (
    blockedPaths.has(req.path) ||
    req.path.startsWith("/.git") ||
    req.path.startsWith("/node_modules")
  ) {
    res.status(404).end();
    return;
  }
  next();
});

app.use(express.static(rootDir, { extensions: ["html"] }));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(rootDir, "index.html"));
});

app.listen(port, () => {
  console.log(`DAFC web server running on port ${port}`);
});

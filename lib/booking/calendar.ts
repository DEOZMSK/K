import { google } from "googleapis";

const REQUIRED_ENV = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  "GOOGLE_CALENDAR_ID"
] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV)[number];

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Отсутствуют переменные окружения: ${missing.join(", ")}`);
  }
}

function normalizePrivateKey(rawKey: string) {
  return rawKey.replace(/\\n/g, "\n");
}

export function getCalendarId(): string {
  validateEnv();
  return process.env.GOOGLE_CALENDAR_ID as string;
}

export function getCalendarClient() {
  validateEnv();

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY as string),
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  return google.calendar({ version: "v3", auth });
}

export function assertRequiredEnv(key: RequiredEnvKey) {
  if (!process.env[key]) {
    throw new Error(`Не заполнена переменная окружения ${key}`);
  }
}

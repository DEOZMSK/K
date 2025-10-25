import { google } from "googleapis";
import { NextResponse } from "next/server";

const REQUIRED_ENV = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  "GOOGLE_SHEETS_ID"
] as const;

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Отсутствуют переменные окружения: ${missing.join(", ")}. Заполните их в .env`);
  }
}

export async function POST(request: Request) {
  try {
    validateEnv();

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const consentAccepted = body.consent === "on" || body.consent === true || body.consent === "true";
    const source = String(body.source ?? "landing");

    if (!name || !email || !consentAccepted) {
      return NextResponse.json(
        { error: "Проверьте имя, email и согласие на обработку персональных данных" },
        { status: 400 }
      );
    }

    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    await jwtClient.authorize();

    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Leads!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            name,
            email,
            phone,
            consentAccepted ? "yes" : "no",
            source,
            request.headers.get("user-agent") ?? "",
            request.headers.get("referer") ?? ""
          ]
        ]
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead webhook error", error);
    return NextResponse.json({ error: "Не удалось сохранить лид" }, { status: 500 });
  }
}

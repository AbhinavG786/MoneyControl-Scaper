import { google } from "googleapis";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const keyFile= path.join(__dirname, "../credentials/google-credentials.json")
let credentials;
if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
  const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, "base64").toString();
  credentials = JSON.parse(decoded);
} else {
  credentials = JSON.parse(fs.readFileSync(keyFile));
}
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const appendToSheet = async (spreadsheetId, range, values) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const headers = [
    "Symbol",
    "Company Name",
    "Strengths",
    "Weaknesses",
    "Opportunities",
    "Threats",
    "MC Essential Score",
    "Scrape Time",
  ];

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const hasHeaders = response.data.values && response.data.values.length > 0;

  if (!hasHeaders && headers) {
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource: { values: [headers] },
    });
  }

  sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
};

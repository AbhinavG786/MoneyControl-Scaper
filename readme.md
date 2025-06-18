# 📊 MoneyControl NSE SWOT Scraper

A Node.js-powered scraper that fetches SWOT analysis and MC Essential Score for top NSE-listed companies from [Moneycontrol](https://www.moneycontrol.com/) and logs the data into a Google Sheet.

This project also supports **GitHub Actions automation** to run daily or on demand.

---

## 🚀 Features

- Scrapes:
  - ✅ Strengths, Weaknesses, Opportunities, Threats (count-based)
  - ✅ MC Essential Score (%)
- Google Sheets integration using Service Account
- Puppeteer automation with stealth plugin to bypass anti-bot checks
- GitHub Actions setup for daily scheduled runs
- Easy configuration via `.env` and modular JS files

---

## 🧾 Tech Stack & Dependencies

| Tool | Purpose |
|------|---------|
| `puppeteer-extra` + `stealth-plugin` | Web scraping with stealth mode |
| `dotenv` | Secure environment variable management |
| `googleapis` | Google Sheets API integration |
| `Node.js` | JavaScript runtime |
| `GitHub Actions` | Workflow automation |

---

## ⚙️ Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/AbhinavG786/MoneyControl-Scaper.git
cd moneycontrol-scrape
npm install        
```

### 2. Create .env

```bash
SPREADSHEET_ID=your_google_sheet_id
RANGE=Sheet1!A1
GOOGLE_SERVICE_ACCOUNT_BASE64=your_google_service_account_key_base64
```
### 3. Setup Google Sheets API Access
- Go to Google Cloud Console

- Create a project

- Enable the Google Sheets API

- Create a Service Account

- Assign "Editor" role

- Download the JSON key

- Share your sheet with the service account email

- Save the file as: credentials/google-credentials.json


### 4. Running the Script Locally

```bash
node src/scrapeMoneyControl.js
```













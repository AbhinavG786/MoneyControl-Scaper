import puppetter from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { COMPANIES } from "./companies.js";
import { urlBuilder } from "../utils/urlBuilder.js";
import { appendToSheet } from "../utils/googleSheets.js";
import dotenv from "dotenv"
dotenv.config()

const mainScraper=async()=>{
    puppetter.use(StealthPlugin())
    const browser=await puppetter.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page=await browser.newPage()
     page.setDefaultNavigationTimeout(60_000);
     const results=[]
     for(const company of COMPANIES){
        try {
            results.push(await singleCompanyScraper(company,page))
            console.log(`Scraped data for ${company.sym} successfully.`);
        } catch (error) {
            console.error(`Error scraping data for ${company.sym}:`, error);
        }
     }

     await browser.close();
     return results;
}

const singleCompanyScraper=async(companyName,page)=>{
    const url=urlBuilder(companyName)
    // await page.goto(url, { waitUntil: "networkidle2" });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForSelector("strong", { timeout: 30000 }); 

   const data=await page.evaluate(()=>{
        const getValue=(title)=>{
            const element=[...document.querySelectorAll("strong")].find((e)=>e.textContent.toLowerCase().includes(title))
            if(!element)return -1;
            console.log(element.textContent)
        const match = element.textContent.match(/\((\d+)\)/); //I have taken regex here to extract the number from "Strengths (12) as in site"
       return  match ? parseInt(match[1],10) : -1;
        }

        const mcScoreElement = document.querySelector(".esbx.esbx3") || document.querySelector(".esbx.esbx4");
         const mcScore = mcScoreElement?.textContent.match(/\d+/)?.[0] || "NaN";

         return {
            Strengths:getValue("strengths"),
            Weaknesses:getValue("weaknesses"),
            Opportunities:getValue("opportunities"),
            Threats:getValue("threats"),
            mcScore:`${mcScore}%`
         }
    })
    return {...companyName,...data,scrapeTime:new Date().toISOString()}
}

mainScraper().then(async(output) => {
//   console.log(output);
  const spreadsheetId=process.env.SPREADSHEET_ID
  const range=process.env.RANGE
  const values = output.map(({ sym, name, Strengths, Weaknesses, Opportunities, Threats, mcScore, scrapeTime }) => 
    [sym, name, Strengths, Weaknesses, Opportunities, Threats, mcScore, scrapeTime]
  );
  await appendToSheet(spreadsheetId,range,values)
}).catch((err) => {
  console.error("Error in mainScraper:", err);
});

const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
require("dotenv").config();
const app = express();
mongoose.set("strictQuery", true);
const PORT = 6000;

let browser;
const data = [];
const scrapeData = async () => {
  try {
    const page = await browser.newPage();
    await page.goto(
      `https://baschet.ro/liga-nationala-de-baschet-masculin/echipe`
    );
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    $("#app > div.container > div > div > div > div > ul > li").map(
      (i, element) => {
        const teamLink = `${$(element).find("a").attr("href")}/statistici`;
        data.push({ teamLink });
      }
    );
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  const teamsLinks = await scrapeData();
  console.log(teamsLinks.length);
};

const startServer = () => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

const startApp = () => {
  startServer();
};

startApp();
main();
// cron.schedule(``,main,{})

const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const Teams = require("./Collections/Model");
require("dotenv").config();
const app = express();
const teams = require("./Collections/teams");
mongoose.set("strictQuery", true);
const collectionService = require("./Collections/Service");
const PORT = process.env.PORT;

const createTeam = async (team) => {
  if ((await Teams.findOne({ teamName: team.teamName })) == null) {
    collectionService.createRecord(team);
  } else {
    await Teams.findOneAndUpdate(
      {
        teamName: team.teamName,
      },
      team,
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

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
    $("#app > div.container > div > div > div > div > ul > li")
      .map((i, element) => {
        const teamLink = `${$(element).find("a").attr("href")}/statistici`;
        data.push({ teamLink });
      })
      .get();
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

const scrapeMatchDescription = async (url, page) => {
  await page.goto(url);
  const html = await page.evaluate(() => document.body.innerHTML);
  const $ = await cheerio.load(html);
  const teamName = $(
    "#app > div:nth-child(2) > div > div > div.team-header > h1"
  ).text();
  const smallTeamName = $(
    "#app > div:nth-child(2) > div > div > div.team-header > h1"
  )
    .text()
    .toLowerCase()
    .replace(" ", "")
    .replace(" ", "")
    .replace("-", "")
    .replace(/["]/g, "")
    .replace("constanța", "")
    .replace(" ", "");
  let color_one;
  let color_two;
  if (teamName === "CSM CSU Oradea") {
    color_one = "#a51117";
    color_two = "#1c2c44";
  }
  if (teamName === "U BT Cluj-Napoca") {
    color_one = "#f1f2f9";
    color_two = "#1f1f21";
  }
  if (teamName === "Rapid București") {
    color_one = "#ab363d";
    color_two = "#fff9ff";
  }
  if (teamName === "FC Argeș Pitești") {
    color_one = "#2e2460";
    color_two = "#f3fff2";
  }
  if (teamName === "BC CSU Sibiu") {
    color_one = "#ffdd00";
    color_two = "#11386b";
  }
  if (teamName === `SCM "U" Craiova`) {
    color_one = "#21539d";
    color_two = "#eeeeec";
  }
  if (teamName === `CSM Ploiești`) {
    color_one = "#0a62bc";
    color_two = "#f9df64";
  }
  if (teamName === `CSM Târgu Mureș`) {
    color_one = "#3d457c";
    color_two = "#374880";
  }
  if (teamName === `CSM VSKC Miercurea Ciuc`) {
    color_one = "#e63834";
    color_two = "#332c32";
  }
  if (teamName === `CSM Târgu Jiu`) {
    color_one = "#4e6183";
    color_two = "#48ace5";
  }
  if (teamName === `SCM Timișoara`) {
    color_one = "#44286b";
    color_two = "#eccc45";
  }
  if (teamName === `CS Dinamo Bucureşti`) {
    color_one = "#e01d23";
    color_two = "#fcfdfc";
  }
  if (teamName === `CSO Voluntari`) {
    color_one = "#7dcaea";
    color_two = "#03294a";
  }
  if (teamName === `CSM ABC Athletic Constanța`) {
    color_one = "#3b50ae";
    color_two = "#1c2c44";
  }
  if (teamName === `CSM Galaţi`) {
    color_one = "#3364ba";
    color_two = "#274386";
  }
  if (teamName === `CSA Steaua București`) {
    color_one = "#2d53a5";
    color_two = "#ee1b2c";
  }
  if (teamName === `CSM Focșani`) {
    color_one = "#76c4f0";
    color_two = "#27276b";
  }
  if (teamName === `ACS Laguna Sharks București`) {
    color_one = "#333536";
    color_two = "#201e1f";
  }
  const teamLogo = $(
    "#app > div:nth-child(2) > div > div > div.team-header > div.text-center > img"
  ).attr("src");
  const coach = $(
    "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(4)"
  )
    .text()
    .replace("Antrenor:", "")
    .trim();
  const year_founded = $(
    "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(5)"
  )
    .text()
    .replace("Anul infiintarii:", "")
    .trim();
  const yearlyStats = $("#lnbm > div:nth-child(4) > table > tbody > tr")
    .map((i, element) => {
      const year = $(element).find("th").text();
      const matches = $(element).find("td:nth-child(2)").text();
      const two_fgm = $(element).find("td:nth-child(3)").text();
      const two_fga = $(element).find("td:nth-child(4)").text();
      const two_fgp = $(element)
        .find("td:nth-child(5)")
        .text()
        .replace("%", "");
      const three_fgm = $(element).find("td:nth-child(6)").text();
      const three_fga = $(element).find("td:nth-child(7)").text();
      const three_fgp = $(element)
        .find("td:nth-child(8)")
        .text()
        .replace("%", "");
      const ftm = $(element).find("td:nth-child(9)").text();
      const fta = $(element).find("td:nth-child(10)").text();
      const ftp = $(element).find("td:nth-child(11)").text().replace("%", "");
      const reb = $(element).find("td:nth-child(14)").text();
      const ass = $(element).find("td:nth-child(15)").text();
      const fouls = $(element).find("td:nth-child(16)").text();
      const tov = $(element).find("td:nth-child(19)").text();
      const blocks = $(element).find("td:nth-child(20)").text();
      const pts = $(element).find("td:nth-child(21)").text();
      return {
        year,
        matches,
        two_fgm,
        two_fga,
        two_fgp,
        three_fgm,
        three_fga,
        three_fgp,
        ftm,
        fta,
        ftp,
        reb,
        ass,
        fouls,
        tov,
        blocks,
        pts,
      };
    })
    .get();
  const team = {
    teamName,
    smallTeamName,
    teamLogo,
    coach,
    year_founded,
    color_one,
    color_two,
    yearlyStats: yearlyStats,
  };
  // console.log(team);
  createTeam(team);
};

const main = async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  const descriptionPage = await browser.newPage();
  const teamsLinks = await scrapeData();
  console.log(teamsLinks.length);
  for (i = 0; i <= teamsLinks.length - 1; i++) {
    await scrapeMatchDescription(teamsLinks[i].teamLink, descriptionPage);
  }
};

app.get("/", async (req, res) => {
  res.send("Echipe");
});

const initRoutes = () => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
  app.use(express.json());
  app.use("/api/v1/teams", teams);
};

const startServer = () => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

const database = () => {
  if (mongoose.connect(process.env.MONGO_URI))
    console.log("Connected to Database");
};

const startApp = () => {
  startServer();
  initRoutes();
  database();
};

startApp();
main();
cron.schedule(`0 0 * * *`, main, {});

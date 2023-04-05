const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema({
  teamName: { type: String },
  smallTeamName: { type: String },
  teamLogo: { type: String },
  coach: { type: String },
  year_founded: { type: String },
  color_one: { type: String },
  color_two: { type: String },
  yearlyStats: {
    year: { type: String },
    matches: { type: String },
    two_fgm: { type: String },
    two_fga: { type: String },
    two_fgp: { type: String },
    three_fgm: { type: String },
    three_fga: { type: String },
    three_fgp: { type: String },
    ftm: { type: String },
    fta: { type: String },
    ftp: { type: String },
    reb: { type: String },
    ass: { type: String },
    fouls: { type: String },
    tov: { type: String },
    blocks: { type: String },
    pts: { type: String },
  },
});

module.exports = mongoose.model("teams", teamsSchema);

const express = require("express");
const { StatusCodes } = require("http-status-codes");
const Team = require("./Model");
const teamRouter = express.Router();

const getAllTeams = async (req, res) => {
  const { smallTeamName } = req.query;
  const queryParams = {};
  if (smallTeamName) {
    queryParams.smallTeamName = smallTeamName;
  }
  const teams = await Team.find(queryParams);
  res.status(StatusCodes.OK).json({ teams });
};

teamRouter.route("/create-team").get(getAllTeams);

module.exports = teamRouter;

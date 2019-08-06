require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";

createConnection()
  .then(async connection => {
    // await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();
    connection.query(`
      CREATE TABLE IF NOT EXISTS "DiscordBet"
      ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "Amount" integer NOT NULL,
      "Prediction" integer NOT NULL,
      "DateAdded" varchar NOT NULL,
      "UserId" varchar NOT NULL,
      "MatchId" varchar NOT NULL)`);
    
    connection.query(`CREATE TABLE IF NOT EXISTS "DiscordMatch"
    ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "Team1Name" varchar NOT NULL,
    "Team1Rate" integer NOT NULL,
    "Team2Name" varchar NOT NULL,
    "Team2Rate" integer NOT NULL,
    "Result" integer,
    "StartTime" varchar NOT NULL,
    "GameName" varchar)`);
  })
  .catch(error => console.log(error));

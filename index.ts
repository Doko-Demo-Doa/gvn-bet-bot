require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";

createConnection()
  .then(async connection => {
    // await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();

    // Run only once after deployment.
    // connection.query(`ALTER TABLE "DiscordMatch" ADD COLUMN "TournamentName"`);
    // connection.query(`ALTER TABLE "DiscordBet" ADD COLUMN "Result"`);

    connection.query(`CREATE TABLE IF NOT EXISTS "DiscordBetLog"
    ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "ActionType" integer NOT NULL,
    "TargetTeam" integer NOT NULL,
    "MoneyAmount" integer NOT NULL,
    "RecordDate" integer NOT NULL,
    "DiscordUser" integer,
    "DiscordMatch" integer,
    CONSTRAINT "FK_betlog_user_to_DiscordUser" FOREIGN KEY ("DiscordUser") REFERENCES "DiscordUser" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "FK_betlog_match_to_DiscordMatch" FOREIGN KEY ("DiscordMatch") REFERENCES "DiscordMatch" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);

    connection.query(`CREATE TABLE IF NOT EXISTS "DiscordBetMoneyLog"
    ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "MoneyAmount" integer NOT NULL,
    "Reason" integer NOT NULL,
    "RecordDate" integer NOT NULL,
    "DiscordUser" integer,
    "DiscordMatch" integer,
    CONSTRAINT "FK_betmoneylog_user_to_DiscordUser" FOREIGN KEY ("DiscordUser") REFERENCES "DiscordUser" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "FK_betmoneylog_match_to_DiscordMatch" FOREIGN KEY ("DiscordMatch") REFERENCES "DiscordMatch" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
  })
  .catch(error => console.log(error));

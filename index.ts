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

    connection.query(`CREATE TABLE IF NOT EXISTS "DiscordBetLog"
    ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "ActionType" integer NOT NULL,
    "TargetTeam" integer NOT NULL,
    "MoneyAmount" integer NOT NULL,
    "RecordDate" integer NOT NULL,
    "DiscordUser" integer,
    "DiscordMatch" integer,
    CONSTRAINT "FK_2ab65ed2ed24a5e1db7ab3aade4" FOREIGN KEY ("DiscordUser") REFERENCES "DiscordUser" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "FK_9d4639676311a1316ff64f51d98" FOREIGN KEY ("DiscordMatch") REFERENCES "DiscordMatch" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
  })
  .catch(error => console.log(error));

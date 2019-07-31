require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";
import { DiscordUser } from "./src/entities/user";

createConnection()
  .then(async connection => {
    // await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();
    const found = await DiscordUser.findOne({ userId: 211163226757398530 });
    console.log(found);
  })
  .catch(error => console.log(error));

require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";
import { DiscordUser } from "./src/entities/user";

createConnection()
  .then(async connection => {
    await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();

    const firstUser = await DiscordUser.find({ take: 2 });
    console.log(firstUser);
  })
  .catch(error => console.log(error));

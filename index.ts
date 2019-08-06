require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";

createConnection()
  .then(async connection => {
    // await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();
  })
  .catch(error => console.log(error));

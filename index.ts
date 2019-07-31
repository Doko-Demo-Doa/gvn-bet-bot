require("dotenv").config();
require("reflect-metadata");
require("./src/app-loader");

import { createConnection } from "typeorm";
import moment from 'moment';

// dayjs.locale('vi');

createConnection()
  .then(async connection => {
    // await connection.query('PRAGMA foreign_keys=OFF');
    // await connection.synchronize();
    console.log(moment('2019-09-12 20:14', 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm'))
    console.log('yaya', moment('2019-14-12 20:14', 'YYYY-MM-DD HH:mm').isValid())

  })
  .catch(error => console.log(error));

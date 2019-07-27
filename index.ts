// import Discord from 'discord.js'
import 'reflect-metadata'
import './src/app-loader'

/* import {createConnection} from "typeorm";
import {User} from "./src/entities/user";

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.tag = "Timber";
    user.username = "Saw";
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error)); */

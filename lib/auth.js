import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite"; 
import db from "./db";

//NOTE: the adapter const constructor requires you to 1st give it the name of the
//better sqlite db, then a config object that names as keys the user and session, and 
//for each has a string value mathing the names of the corresponding tables
//in sqlite

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions'
});


const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  }
});

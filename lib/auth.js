import { cookies } from "next/headers";
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

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null
    };
  }

  const sessionId =  sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null
    };
  }

  const result = await lucia.validateSession(sessionId);

  //This conditional checks to see if there is an exiting session and essentially
  //refreshed the cookie, which prolongs it and keeps someone from being locked out
  //NOTE, by settings a session cooke whilst rendering a page, it will cause nextJS to 
  //throw an error, thus you wrap this in a try/catch block and 'do nothing' if an 
  //error is found -- this is specific and a workaround provided by lucia.js
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = luciaCreateSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {};

  //if there is invalid session data, we create a new session cookie
  if (!result.session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }

  return result;
}

export async function destroySession() {
  const {session} = await verifyAuth();
  if (!session) {
    return {
      error: 'Unauthorized!'
    };
  }

  //This will go into the sessions db table and delete it
  await lucia.invalidateSession(session.id);
  
  //This will clear the cookie from the broswer/server
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}
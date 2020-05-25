// initialize database tables

import { pgclient, Persons } from "./database.js";
const db = pgclient();
await new Persons().createTable(db);

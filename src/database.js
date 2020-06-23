// database client + model

import { Client } from "./deps.ts";

const DB_HOST = Deno.env.get("DB_HOST") || "127.0.0.1";
const DB_PORT = +Deno.env.get("DB_PORT") || 5432;
const DB_NAME = Deno.env.get("DB_NAME") || "postgres";
const DB_USER = Deno.env.get("DB_USER") || "postgres";
const DB_PASSWORD = Deno.env.get("DB_PASSWORD") || "";

export function pgclient() {
  const client = new Client({
    user: DB_USER,
    database: DB_NAME,
    hostname: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
  });
  return client;
}

export class Person {
  constructor(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // insert/update
  async save(client) {
    await client.connect();
    if (!this.id) {
      const data = await client.query(
        "INSERT INTO people (firstName, lastName) VALUES ($1, $2) RETURNING id",
        this.firstName,
        this.lastName,
      );
      this.id = data.rows[0][0];
    } else {
      await client.query(
        "UPDATE people SET firstName = $2, lastName = $3 WHERE id = $1",
        this.id,
        this.firstName,
        this.lastName,
      );
    }
    await client.end();
  }

  // select returns true if found
  async load(client) {
    if (!this.id) {
      throw "attempted to read person with no id";
    }
    await client.connect();
    let found = false;
    const data = await client.query(
      "SELECT firstName, lastName FROM people WHERE id = $1",
      this.id,
    );
    if (data.rows.length) {
      this.firstName = data.rows[0][0];
      this.lastName = data.rows[0][1];
      found = true;
    }
    await client.end();
    return found;
  }

  // delete
  async delete(client) {
    if (!this.id) {
      throw "attempted to delete person with no id";
    }
    await client.connect();
    const data = await client.query(
      "DELETE FROM people WHERE id = $1",
      this.id,
    );
    await client.end();
  }
}

export class Persons {
  async createTable(client) {
    await client.connect();
    await client.query(
      "CREATE TABLE IF NOT EXISTS people ( id SERIAL PRIMARY KEY, firstName VARCHAR(50) NOT NULL, lastName VARCHAR(50) )",
    );
    await client.end();
  }

  async deleteTable(client) {
    await client.connect();
    await client.query("DROP TABLE IF EXISTS people");
    await client.end();
  }

  async getAll(client) {
    const persons = [];
    await client.connect();
    const data = await client.query("SELECT * FROM people;");
    await client.end();
    data.rows.forEach((item) => {
      persons.push(new Person(item[0], item[1], item[2]));
    });
    return persons;
  }
}

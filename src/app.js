// example API server built for Deno

export const APP_HOST = Deno.env.get("APP_HOST") || "127.0.0.1";
export const APP_PORT = Deno.env.get("APP_PORT") || 4000;

import { Application, Router } from "./deps.ts";
import { pgclient, Person, Persons } from "./database.js";

const db = pgclient();

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Try the /person and /persons endpoints.";
  })
  .get("/person/:id", async (context) => {
    const id = context.params.id;
    const person = new Person(id);
    const found = await person.load(db);
    if (!found) {
      context.response.status = 404;
      context.response.body = { error: "Person not found" };
      return;
    }
    context.response.body = person;
  })
  .get("/persons", async (context) => {
    const everyone = await new Persons().getAll(db);
    context.response.body = everyone;
  })
  .post("/person", async (context) => {
    if (!context.request.hasBody) {
      context.response.status = 400;
      context.response.body = { error: "No data submitted." };
    }

    const body = await context.request.body();
    const personData = body.value;

    const person = new Person(null, personData.firstName, personData.lastName);
    await person.save(db);
    context.response.body = { ok: true };
  })
  .post("/person/:id", async (context) => {
    if (!context.request.hasBody) {
      context.response.status = 400;
      context.response.body = { error: "No data submitted." };
    }
    const id = context.params.id;
    const body = await context.request.body();
    const personData = body.value;

    const person = new Person(id, personData.firstName, personData.lastName);
    await person.save(db);
    context.response.body = { ok: true };
  })
  .delete("/person/:id", async (context) => {
    const id = context.params.id;
    const person = new Person(id);
    await person.delete(db);
    context.response.body = { ok: true };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use((context) => {
  context.status = 404;
  context.response.body = { error: "Invalid method" };
});

console.log(`Listening on port:${APP_PORT}...`);
await app.listen(`${APP_HOST}:${APP_PORT}`);

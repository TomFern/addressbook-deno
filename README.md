Example HTTP API Server running on [Deno](https://deno.land).

This is a port for Deno of my [[addressbook][addressbook]] Node.js demo.

## Install and Run

1. Fork and clone this repository.
2. Set up environment.

```bash
$ cp env-example .env
$ source .env
```

3. Install/Update dependencies.

```bash
$ deno cache --reload src/deps.ts
```

4. Start a postgres database.

```bash
$ docker run -it -d -p 5432:5432 postgres
```

5. Create the tables.

```bash
$ deno run --allow-net --allow-env src/migrate.js
```

6. Run the application:

```bash
$ deno run --allow-net --allow-env src/app.js
```

## Testing

The project ships with some sample tests that take advantage of Deno’s built-in test runner.

Run the unit tests:

```bash
$ docker run -it -d -p 5432:5432 postgres
$ deno run --allow-net --allow-env src/migrate.js
$ deno test --allow-net --allow-env src/test/database.test.js
```

Run the integration tests:

```bash
$ docker run -it -d -p 5432:5432 postgres
$ deno run --allow-net --allow-env src/migrate.js
$ deno run --allow-net --allow-env src/app.js &
$ deno test --allow-net --allow-env src/test/app.test.js
```

## Run in Docker

Run with docker (WIP):

```bash
$ docker run -it -d -p 5432:5432 postgres
$ docker build -t addressbook-deno .
$ docker run d -it -p 4000:4000 -n addressbook addressbook-deno
$ docker exec -it addressbook deno --allow-env --allow-net migrate.js
```


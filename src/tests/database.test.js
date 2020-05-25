import { assertEquals, assertStrictEq, assertNotEquals } from "../deps.ts";
import { pgclient, Person, Persons } from "../database.js";

const db = pgclient();

Deno.test("create person", async () => {
    await new Persons().deleteTable(db);
    await new Persons().createTable(db);

    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(1);
    const found = await person2.load(db);

    assertStrictEq(found, true);
    assertStrictEq(person2.firstName, person1.firstName);
    assertStrictEq(person2.lastName, person1.lastName);
});

Deno.test("delete person", async () => {
    await new Persons().deleteTable(db);
    await new Persons().createTable(db);

    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(1);
    await person2.delete(db);

    assertNotEquals(person2.firstName, person1.firstName);
    assertNotEquals(person2.lastName, person1.lastName);
});

Deno.test("update person", async () => {
    await new Persons().deleteTable(db);
    await new Persons().createTable(db);

    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(1, "Billy", "Joel");
    await person2.save(db);

    assertStrictEq(person2.firstName, "Billy");
    assertStrictEq(person2.lastName, "Joel");
});

Deno.test("get all persons", async () => {
    await new Persons().deleteTable(db);
    await new Persons().createTable(db);

    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(null, "Billy", "Idol");
    await person2.save(db);

    const persons = await new Persons().getAll(db);
    assertEquals(persons.length, 2);
    persons.forEach(item => {
        assertStrictEq(item.firstName, "Billy");
        assertStrictEq(item.lastName, "Idol");
    });
});

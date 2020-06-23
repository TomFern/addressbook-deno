import { assertEquals, assertStrictEquals, assertNotEquals, assert } from "../deps.ts";
import { pgclient, Person, Persons } from "../database.js";

const db = pgclient();

Deno.test("create person", async () => {
    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(person1.id);
    const found = await person2.load(db);

    assertStrictEquals(found, true);
    assertStrictEquals(person2.firstName, person1.firstName);
    assertStrictEquals(person2.lastName, person1.lastName);
});

Deno.test("delete person", async () => {
    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(person1.id);
    await person2.delete(db);

    assertNotEquals(person2.firstName, person1.firstName);
    assertNotEquals(person2.lastName, person1.lastName);
});

Deno.test("update person", async () => {
    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    person1.lastName = "Joel";
    await person1.save(db);
    const person2 = new Person(person1.id);
    await person2.load(db);

    assertStrictEquals(person2.firstName, "Billy");
    assertStrictEquals(person2.lastName, "Joel");
});

Deno.test("get all persons", async () => {
    const person1 = new Person(null, "Billy", "Idol");
    await person1.save(db);
    const person2 = new Person(null, "Billy", "Idol");
    await person2.save(db);

    const persons = await new Persons().getAll(db);
    // assertEquals(persons.length, 2);
    assert(persons.length > 2);
    persons.forEach(item => {
        assertStrictEquals(item.firstName, "Billy");
    });
});

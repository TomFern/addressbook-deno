import { assertEquals, assertStrictEq, assertNotEquals } from "../deps.ts";

export const APP_HOST = Deno.env.get("APP_HOST") || "127.0.0.1";
export const APP_PORT = Deno.env.get("APP_PORT") || 4000;
const baseUrl = "http://" + APP_HOST + ":" + APP_PORT;

// run these tests on a brand-new, initialized db

Deno.test("create person", async () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "firstName": "John",
      "lastName": "Doe",
    }),
  };
  const response = await fetch(baseUrl + "/person", requestOptions);
  await response.body.close();
  assertEquals(response.status, 200);
});

Deno.test("get person", async () => {
  const response = await fetch(baseUrl + "/person/1");
  const body = await response.json();
  assertStrictEq(body.firstName, "John");
  assertStrictEq(body.lastName, "Doe");
});

Deno.test("update person", async () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "firstName": "Mary",
      "lastName": "Jane",
    }),
  };
  const response1 = await fetch(baseUrl + "/person/1", requestOptions);
  await response1.body.close();
  assertEquals(response1.status, 200);

  const response2 = await fetch(baseUrl + "/person/1");
  const body2 = await response2.json();
  assertStrictEq(body2.firstName, "Mary");
  assertStrictEq(body2.lastName, "Jane");
});

Deno.test("delete person", async () => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  };

  const response1 = await fetch(baseUrl + "/person/1", requestOptions);
  await response1.body.close();
  assertEquals(response1.status, 200);

  const response2 = await fetch(baseUrl + "/person/1");
  await response2.body.close();
  assertEquals(response2.status, 404);
});

Deno.test("get all persons", async () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "firstName": "John",
      "lastName": "Doe",
    }),
  };

  const response1 = await fetch(baseUrl + "/person", requestOptions);
  await response1.body.close();
  const response2 = await fetch(baseUrl + "/person", requestOptions);
  await response2.body.close();
  assertEquals(response1.status, 200);
  assertEquals(response2.status, 200);

  const response3 = await fetch(baseUrl + "/persons");
  const body3 = await response3.json();
  assertEquals(body3.length, 2);
  assertStrictEq(body3[0].firstName, "John");
  assertStrictEq(body3[0].lastName, "Doe");
  assertStrictEq(body3[1].firstName, "John");
  assertStrictEq(body3[1].lastName, "Doe");
});

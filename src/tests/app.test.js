import { assertEquals, assertStrictEq, assertNotEquals, assert } from "../deps.ts";

export const APP_HOST = Deno.env.get("APP_HOST") || "127.0.0.1";
export const APP_PORT = Deno.env.get("APP_PORT") || 4000;
const baseUrl = "http://" + APP_HOST + ":" + APP_PORT;

Deno.test("test HTTP endpoints", async () => {

  // create person
  // -------------

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "firstName": "Billy",
      "lastName": "Idol",
    }),
  };

  let response = await fetch(baseUrl + "/person", requestOptions);
  let body = await response.json();
  let id = body.person.id;
  assertEquals(response.status, 200);


  // get person
  // ----------

  response = await fetch(baseUrl + "/person/" + id);
  body = await response.json();
  assertStrictEq(body.firstName, "Billy");
  assertStrictEq(body.lastName, "Idol");


  // update person
  // -------------

  const requestOptionsUpdate = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "firstName": "Billy",
      "lastName": "Jane",
    }),
  };
  response = await fetch(baseUrl + "/person/" + id, requestOptionsUpdate);
  body = await response.json();
  
  response = await fetch(baseUrl + "/person/" + id);
  body = await response.json();
  assertEquals(response.status, 200);
  assertStrictEq(body.firstName, "Billy");
  assertStrictEq(body.lastName, "Jane");


  // get all persons
  // ---------------

  response = await fetch(baseUrl + "/persons");
  body = await response.json();
  assert(body.length > 0);
  assertStrictEq(body[0].firstName, "Billy");


  // delete person
  // -------------

  const requestOptionsDelete = {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  };
  response = await fetch(baseUrl + "/person/" + id, requestOptionsDelete);
  await response.json();
  assertEquals(response.status, 200);

  response = await fetch(baseUrl + "/person/" + id);
  await response.json();
  assertEquals(response.status, 404);

});


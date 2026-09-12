import test from "node:test";
import assert from "node:assert/strict";
import { getErrorMessage } from "../src/utils/getErrorMessage.js";

test("registration displays the backend error field for HTTP 400", () => {
  const message = "Registration failed: Username is already taken.";
  assert.equal(getErrorMessage({ response: { status: 400, data: { error: message } } }), message);
});

test("field validation messages keep priority", () => {
  assert.equal(getErrorMessage({ response: { status: 400, data: {
    error: "General error", errors: { Email: ["Invalid email."] }
  } } }), "Invalid email.");
});

test("an invalid error payload uses the friendly fallback", () => {
  assert.equal(getErrorMessage({ response: { status: 400, data: { error: {} } } }),
    "Please check the entered information and try again.");
});

test("server failures do not expose internal details", () => {
  assert.equal(getErrorMessage({ response: { status: 500, data: { error: "Private detail" } } }),
    "The server encountered an unexpected problem. Please try again later.");
});

test("network failures have a readable message", () => {
  assert.equal(getErrorMessage({}),
    "Unable to connect. Please check your connection or try again later.");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { ukTime, timeRange, ukDate, money, postcodeMapUrl } from "../lib/filters.js";

test("ukTime follows NHS style", () => {
  assert.equal(ukTime("08:00"), "8am");
  assert.equal(ukTime("18:30"), "6:30pm");
  assert.equal(ukTime("12:00"), "midday");
  assert.equal(ukTime("00:00"), "midnight");
  assert.equal(ukTime("12:45"), "12:45pm");
  assert.equal(ukTime("not a time"), "not a time");
});

test("timeRange joins opening and closing times", () => {
  assert.equal(timeRange({ opens: "08:00", closes: "18:30" }), "8am to 6:30pm");
});

test("ukDate formats dates with and without the day", () => {
  assert.equal(ukDate("2026-11-19"), "Thursday 19 November 2026");
  assert.equal(ukDate("2026-11-19", false), "19 November 2026");
});

test("money formats pounds", () => {
  assert.equal(money(82000), "£82,000");
});

test("postcodeMapUrl builds an OpenStreetMap search unless a link is given", () => {
  assert.match(
    postcodeMapUrl({ address: ["1 River Lane"], postcode: "ZZ1 1AA" }),
    /^https:\/\/www\.openstreetmap\.org\/search\?query=1%20River%20Lane%2C%20ZZ1%201AA$/,
  );
  assert.equal(postcodeMapUrl({ map_url: "https://maps.example/x" }), "https://maps.example/x");
});

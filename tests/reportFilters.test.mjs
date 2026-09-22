import test from "node:test";
import assert from "node:assert/strict";
import {
  hasReportCoordinates,
  readReportFilters,
  updateReportFilter,
} from "../src/utils/reportFilters.js";

test("invalid URL values use safe defaults", () => {
  assert.deepEqual(
    readReportFilters(new URLSearchParams("page=-2&category=bad&status=0")),
    { page: 1, categoryId: "", statusId: "", searchQuery: "" },
  );
});
test("URL keeps category, status and search", () => {
  assert.deepEqual(
    readReportFilters(
      new URLSearchParams("page=2&category=1&status=3&search=bench"),
    ),
    { page: 2, categoryId: "1", statusId: "3", searchQuery: "bench" },
  );
});
test("changing a filter resets pagination without mutating existing params", () => {
  const params = new URLSearchParams("page=3&status=2");
  assert.equal(
    updateReportFilter(params, "category", "1").toString(),
    "status=2&category=1",
  );
  assert.equal(params.get("page"), "3");
});
test("clearing search removes the search and page params", () => {
  assert.equal(
    updateReportFilter(
      new URLSearchParams("search=bench&page=2"),
      "search",
      "",
    ).toString(),
    "",
  );
});
test("page changes retain other filters", () => {
  assert.equal(
    updateReportFilter(new URLSearchParams("status=1"), "page", 2).toString(),
    "status=1&page=2",
  );
});
test("map accepts zero coordinates and rejects absent or invalid coordinates", () => {
  assert.equal(hasReportCoordinates({ latitude: 0, longitude: 0 }), true);
  for (const latitude of [null, undefined, NaN, 91, "45"])
    assert.equal(hasReportCoordinates({ latitude, longitude: 19 }), false);
  assert.equal(hasReportCoordinates({ latitude: 45, longitude: 181 }), false);
});

export function readReportFilters(params) {
  const positiveId = (value) =>
    /^\d+$/.test(value || "") &&
    Number(value) > 0 &&
    Number.isSafeInteger(Number(value))
      ? String(Number(value))
      : "";
  return {
    searchQuery: params.get("search") || "",
    categoryId: positiveId(params.get("category")),
    statusId: positiveId(params.get("status")),
    page: Number(positiveId(params.get("page"))) || 1,
  };
}

export function updateReportFilter(params, key, value) {
  const next = new URLSearchParams(params);
  if (value && !(key === "page" && String(value) === "1"))
    next.set(key, String(value));
  else next.delete(key);
  if (key !== "page") next.delete("page");
  return next;
}

export function hasReportCoordinates(report) {
  return (
    Number.isFinite(report.latitude) &&
    Number.isFinite(report.longitude) &&
    Math.abs(report.latitude) <= 90 &&
    Math.abs(report.longitude) <= 180
  );
}

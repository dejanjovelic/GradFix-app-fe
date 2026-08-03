import api from "./axios";

export async function getReportStatuses() {
  const response = await api.get(
    "/reportStatuses"
  );

  return response.data;
}
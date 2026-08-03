import api from "./axios";

export async function createReport(formData) {
  const response = await api.post("/reports", formData);

  return response.data;
}

export async function getReportById(id) {
  const response = await api.get(`/reports/${id}`);

  return response.data;
}
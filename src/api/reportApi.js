import api from "./axios";

export async function createReport(formData) {
  const response = await api.post("/reports", formData);

  return response.data;
};

export async function getReportById(id) {
  const response = await api.get(`/reports/${id}`);

  return response.data;
};

export async function getReports(filters = {}) {
  const params = {
    page: filters.page || 1,
    pageSize: filters.pageSize || 6,
  };

  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  if (filters.statusId) {
    params.statusId = filters.statusId;
  }

  const response = await api.get(
    "/reports",
    { params }
  );

  return response.data;
}

export async function getMapReports(filters = {}) {
  const params = {};

  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  if (filters.statusId) {
    params.statusId = filters.statusId;
  }

  const response = await api.get("/reports/map", {
    params,
  });

  return response.data;
}
import api from "./api";

export const getApplications = async (params = {}) => {
  const response = await api.get("/applications", { params });
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/applications/stats");
  return response.data;
};

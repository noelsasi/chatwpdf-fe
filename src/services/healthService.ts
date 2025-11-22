import { api } from "../lib/api";

export const checkDatabaseConnection = async () => {
  try {
    const response = await api.get("/api/health/db");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const checkServerConnection = async () => {
  try {
    const response = await api.get("/api/health");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

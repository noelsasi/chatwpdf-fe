import axios from "axios";

export const api = axios.create({
  baseURL: "https://chatapi.immchurch.com/api",
  withCredentials: true,
});

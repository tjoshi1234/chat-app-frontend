import axios from "axios";

export const baseURL = "http://localhost:1111";

export const apiCaller = axios.create({
  baseURL: baseURL,
});

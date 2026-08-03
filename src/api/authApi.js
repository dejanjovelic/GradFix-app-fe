import api from "./axios";

export function loginUser(data) {
  return api.post("/auth/login", data);
}

export function registerUser(data) {
  return api.post("/auth/register", data);
}

export function loginWithGoogle(data) {
  return api.post("/auth/google", data);
}

export function getCurrentProfile() {
  return api.get("/auth/me");
}
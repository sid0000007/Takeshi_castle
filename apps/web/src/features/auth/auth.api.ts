import type { ApiResponse, AuthResponse } from "@takeshi-castle/shared";

import { api } from "../../services/api.js";

export async function register(input: {
  email: string;
  username: string;
  password: string;
  color: string;
}) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", input);

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

export async function login(input: { email: string; password: string }) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

export async function fetchSession() {
  const response = await api.get<ApiResponse<AuthResponse>>("/auth/session");

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

export async function guestLogin(input: { username: string; color?: string }) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/guest-login", input);

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

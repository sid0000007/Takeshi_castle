import type { ApiResponse, AuthResponse } from "@takeshi-castle/shared";

import { api } from "../../services/api.js";

export async function guestLogin(input: { username: string; color?: string }) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/guest-login", input);

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

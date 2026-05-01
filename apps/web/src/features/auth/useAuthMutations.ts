import { useMutation } from "@tanstack/react-query";

import { login, register } from "./auth.api.js";
import { useAuthStore } from "./auth.store.js";

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data);
    }
  });
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
    }
  });
}

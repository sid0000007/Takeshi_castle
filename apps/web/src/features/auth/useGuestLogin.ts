import { useMutation } from "@tanstack/react-query";

import { guestLogin } from "./auth.api.js";
import { useAuthStore } from "./auth.store.js";

export function useGuestLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: guestLogin,
    onSuccess: (data) => {
      setAuth(data);
    }
  });
}

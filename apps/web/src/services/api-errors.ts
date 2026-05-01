import axios from "axios";

type ErrorPayload = {
  error?: {
    message?: string;
  };
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorPayload | string | undefined;

    if (typeof data === "object" && data !== null) {
      if (typeof data.error?.message === "string" && data.error.message.trim()) {
        return data.error.message;
      }

      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function getResponseErrorMessage(responseData: unknown, fallback: string) {
  if (typeof responseData !== "object" || responseData === null) {
    return fallback;
  }

  const data = responseData as ErrorPayload;

  if (typeof data.error?.message === "string" && data.error.message.trim()) {
    return data.error.message;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallback;
}

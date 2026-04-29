import type { ApiSuccess } from "@takeshi-castle/shared";

export function success<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data
  };
}

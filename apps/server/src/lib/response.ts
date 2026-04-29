// Normalizes successful API responses into a shared shape.
import type { ApiSuccess } from "@takeshi-castle/shared";

export function success<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data
  };
}

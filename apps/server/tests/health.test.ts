import { describe, expect, it } from "vitest";

import { getHealthStatus } from "../src/modules/health/health.controller.js";

describe("health controller", () => {
  it("returns ok status payload", () => {
    expect(getHealthStatus()).toEqual({
      success: true,
      data: {
        status: "ok"
      }
    });
  });
});

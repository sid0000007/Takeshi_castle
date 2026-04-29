// Returns the basic health payload used by uptime checks.
export function getHealthStatus() {
  return {
    success: true,
    data: {
      status: "ok"
    }
  };
}

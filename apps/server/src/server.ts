// Boots migrations, seeds local data, attaches sockets, and starts listening.
import { createServer } from "node:http";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";
import { seedDatabase } from "./db/seed.js";
import { bootstrapSockets } from "./sockets/index.js";

export async function startServer() {
  await runMigrations();
  await seedDatabase();

  const app = createApp();
  const httpServer = createServer(app);
  bootstrapSockets(httpServer);

  await new Promise<void>((resolve) => {
    httpServer.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${env.PORT}`);
      resolve();
    });
  });
}

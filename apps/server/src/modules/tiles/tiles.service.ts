// Delegates tile claims to the shared claim workflow.
import type { PublicUser } from "@takeshi-castle/shared";

import { claimTile } from "../../services/claim.service.js";

export async function claimTileForUser(tileId: string, user: PublicUser) {
  return claimTile(tileId, user);
}

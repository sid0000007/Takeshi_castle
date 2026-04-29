import { RouterProvider } from "react-router-dom";

import { router } from "./app/router.js";
import { AppProviders } from "./app/providers.js";

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

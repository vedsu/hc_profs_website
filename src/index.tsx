import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { primeReactConfigOptions } from "./constant.ts";
import "./custom.css";
import "./index.css";
import hcpWebsiteRoutes from "./routes.tsx";

const root = createRoot(document.getElementById("root")!);

const routerConfig = createBrowserRouter(hcpWebsiteRoutes);

root.render(
  <StrictMode>
    <PrimeReactProvider value={primeReactConfigOptions}>
      <RouterProvider router={routerConfig} />
    </PrimeReactProvider>
  </StrictMode>
);

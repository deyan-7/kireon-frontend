import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/openapi.json` ||
    "https://backend.niceforest-23188099.westeurope.azurecontainerapps.io/openapi.json",
  output: "src/client",
  plugins: ["@hey-api/client-fetch"],
});

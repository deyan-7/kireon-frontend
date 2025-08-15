import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/openapi.json` ||
    "https://hiring-agent-backend-staging-474483908861.europe-west3.run.app/openapi.json",
  output: "src/client",
  plugins: ["@hey-api/client-fetch"],
});

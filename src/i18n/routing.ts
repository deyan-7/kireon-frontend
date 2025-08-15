import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "ro", "it", "es"],
  defaultLocale: "de",
});

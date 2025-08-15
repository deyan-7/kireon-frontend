"use client";

import { usePathname } from "next/navigation";

export const useLocale = (): string => {
  const pathname = usePathname();
  const locale = pathname?.split("/")?.[1] || "en";
  return locale;
};

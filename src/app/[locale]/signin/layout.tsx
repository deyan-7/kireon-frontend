"use client";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { ReactNode } from "react";

export default function StartGuestLayout({
  children,
}: {
  children: ReactNode;
}) {
  useAuthGuard();
  return <section>{children}</section>;
}

import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/custom.scss";
import "highlight.js/styles/github.css";

import { AuthProvider } from "@/context/AuthContext";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { AgentStreamProvider } from "@/context/AgentStreamProvider";
import { TaskProvider } from "@/context/TaskContext";

export const metadata: Metadata = {
  title: "Kireon",
  description: "Kireon",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <AuthProvider>
            <TaskProvider>
              <AgentStreamProvider>{children}</AgentStreamProvider>
            </TaskProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

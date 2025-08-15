"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const onSignIn = pathname === "/signin";

    if (!user && !onSignIn) {
      router.replace("/signin");
      return;
    }

    if (user && onSignIn) {
      router.replace("/");
      return;
    }

    if (user) {
      router.replace("/");
    }
  }, [pathname, user, loading, router]);
};

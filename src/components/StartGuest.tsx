"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import BaseLayout from "@/components/BaseLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const StartGuest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();

  const startTest = async () => {
    setIsLoading(true);
    setError(null);
    const newThreadId = uuidv4();

    setIsLoading(false);

    const queryString = searchParams.toString();
    const url = `/conversation/${newThreadId}${
      queryString ? `?${queryString}` : ""
    }`;
    router.push(url);
  };

  return (
    <BaseLayout>
      <div className="flex flex-col gap-8">
        <div className="overflow-y-auto relative">
          {error && (
            <div className="text-center">
              <input
                className="container"
                type="text"
                placeholder={error}
                aria-invalid="true"
                readOnly
              />
            </div>
          )}

          <div className="container max-w-3xl text-black">
            {t("start_guest_message")}
          </div>
        </div>

        {error && (
          <input
            readOnly
            aria-invalid="true"
            className="border-red-500 text-red-600 mb-4"
            value={`Error: ${error}`}
          />
        )}

        <button
          onClick={startTest}
          className="action-btn w-full"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Starting..." : t("start_guest_button")}
        </button>
      </div>
    </BaseLayout>
  );
};

export default StartGuest;

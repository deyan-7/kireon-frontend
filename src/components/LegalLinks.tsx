"use client";

import { useTranslations } from "next-intl";

interface LegalLinksProps {
  className?: string;
}

const LegalLinks = ({ className = "" }: LegalLinksProps) => {
  const t = useTranslations();
  return (
    <div className={`flex gap-2 sm:gap-4 text-xs ${className}`}>
      <a
        href="https://deyan7.de/impressum/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors whitespace-nowrap"
      >
        {t("impressum")}
      </a>
      <a
        href="https://deyan7.de/datenschutz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors whitespace-nowrap"
      >
        {t("privacy_policy")}
      </a>
    </div>
  );
};

export default LegalLinks;

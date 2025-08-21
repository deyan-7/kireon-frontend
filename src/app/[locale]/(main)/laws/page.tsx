import { useTranslations } from "next-intl";

export default function LawsPage() {
  const t = useTranslations("sidebar");
  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("laws")}</h1>
      <p>This page is under construction.</p>
    </div>
  );
}
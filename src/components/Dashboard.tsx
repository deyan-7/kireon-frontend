"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { v4 as uuidv4 } from "uuid";
import { Link } from "@/i18n/navigation";
import styles from "./Dashboard.module.scss";
import Image from "next/image";

const Dashboard = () => {
  const t = useTranslations("dashboard");
  const router = useRouter();

  const handleStartConsulting = () => {
    const newThreadId = uuidv4();
    router.push(`/conversation/${newThreadId}`);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.png"
            alt="Kireon Logo"
            width={80}
            height={80}
            priority
          />
          <h1 className={styles.title}>Kireon GPT</h1>
        </div>
        <p>{t("welcome_message")}</p>
      </div>
      <div className={styles.tileGrid}>
        <div className={styles.tile} onClick={handleStartConsulting}>
          <h3>{t("consultant_title")}</h3>
        </div>
        <Link href="/laws" className={styles.tile}>
          <h3>{t("laws_title")}</h3>
        </Link>
        <Link href="/customer" className={styles.tile}>
          <h3>{t("customer_title")}</h3>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
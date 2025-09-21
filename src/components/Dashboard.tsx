"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Dashboard.module.scss";
import Image from "next/image";

const Dashboard = () => {
  const t = useTranslations("sidebar");
  const tDashboard = useTranslations("dashboard");

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
          <h1 className={styles.title}>Kireon</h1>
        </div>
        <p>{tDashboard("welcome_message")}</p>
      </div>
      <div className={styles.tileGrid}>
        <Link href="/laws" className={styles.tile}>
          <h3>{t("laws")}</h3>
        </Link>
        <Link href="/customer" className={styles.tile}>
          <h3>{t("customer")}</h3>
        </Link>
        <Link href="/laws/reports" className={styles.tile}>
          <h3>{t("reports")}</h3>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
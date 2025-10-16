"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import Image from "next/image";
import styles from "./Sidebar.module.scss";
import {
  DocumentTextIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/laws",
      label: t("laws"),
      icon: DocumentTextIcon,
      isActive: (path: string) => path === "/laws",
    },
    {
      href: "/customer",
      label: t("customer"),
      icon: UsersIcon,
      isActive: (path: string) => path === "/customer",
    },
    {
      href: "/laws/reports",
      label: t("reports"),
      icon: DocumentArrowDownIcon,
      isActive: (path: string) => path === "/laws/reports",
    },
  ];

  return (
    <nav className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
      <div className={styles.logoContainer}>
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={160}
          height={40}
          className={styles.logo}
          priority
        />
      </div>
      <div className={styles.sidebarContent}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    styles.navLink,
                    item.isActive(pathname) && styles.active
                  )}
                >
                  <Icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={styles.toggleButton}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        )}
      </button>
    </nav>
  );
};

export default Sidebar;
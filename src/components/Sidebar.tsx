"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import styles from "./Sidebar.module.scss";
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UsersIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  const navItems = [
    {
      href: `/conversation/${uuidv4()}`,
      label: t("consultant"),
      icon: ChatBubbleLeftRightIcon,
      isActive: (path: string) => path.startsWith("/conversation"),
    },
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
  ];

  return (
    <nav className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
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
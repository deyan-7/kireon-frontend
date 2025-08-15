import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { type FirebaseOptions } from "firebase/app";

interface AppConfig {
  agent: RoleConfig;
  user: RoleConfig;
  system: RoleConfig;
  firebaseConfig: FirebaseOptions;
}

interface RoleConfig {
  icon:
    | ForwardRefExoticComponent<
        Omit<SVGProps<SVGSVGElement>, "ref"> & {
          title?: string | undefined;
          titleId?: string | undefined;
        } & RefAttributes<SVGSVGElement>
      >
    | string;
  iconColor: string;
  roleName: string;
}

const config: AppConfig = {
  agent: {
    icon: "ava_logo.svg",
    iconColor: "text-[#009DE0]",
    roleName: "Test your AI Engineering Skills",
  },
  user: {
    icon: UserCircleIcon,
    iconColor: "text-blue-500",
    roleName: "You",
  },
  system: {
    icon: "agent-logo.svg",
    iconColor: "text-[#009DE0]",
    roleName: "Agent",
  },
  firebaseConfig: {
    apiKey: "AIzaSyAAPoVpZXQK1eeuxOm_ESmT3Dwl1xixfLQ",
    authDomain: "d7-hiring-agent.firebaseapp.com",
    projectId: "d7-hiring-agent",
    storageBucket: "d7-hiring-agent.firebasestorage.app",
    messagingSenderId: "474483908861",
    appId: "1:474483908861:web:d9715d7a4c6de670571e94",
    measurementId: "G-9NS197WL3M",
  },
};

export function setIsProduction(isProd: boolean) {
  isProduction = isProd;
}
export let isProduction = false;

export default config;

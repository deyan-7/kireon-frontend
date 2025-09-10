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
    icon: "logo.png",
    iconColor: "text-[#730C16]",
    roleName: "Kireon GPT Assistant",
  },
  user: {
    icon: UserCircleIcon,
    iconColor: "text-[#730C16]",
    roleName: "You",
  },
  system: {
    icon: "agent-logo.svg",
    iconColor: "text-[#730C16]",
    roleName: "Agent",
  },
  firebaseConfig: {
    apiKey: "AIzaSyCzsOn795kYELai6AY2HEPP848wW2bw6yU",
    authDomain: "kireon-gpt.firebaseapp.com",
    projectId: "kireon-gpt",
    storageBucket: "kireon-gpt.firebasestorage.app",
    messagingSenderId: "510702145393",
    appId: "1:510702145393:web:ebf3812c13ec965d0270d0",
    measurementId: "G-CMW9Q7H77G"
  }
};

export function setIsProduction(isProd: boolean) {
  isProduction = isProd;
}
export let isProduction = false;

export default config;

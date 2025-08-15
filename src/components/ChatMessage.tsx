"use client";

import React from "react";
import config from "@/config";
import { Role } from "@/domain/constants";
import Image from "next/image";

type Props = {
  role: Role;
  message?: any;
  isLoadingArtifact: boolean;
  isStartScreen: boolean;
  onArtifactSelected?: (artifact: { id: string; version: number }) => void;
  children?: React.ReactNode;
};

const ChatMessage: React.FC<Props> = ({
  role = Role.AI,
  isStartScreen,
  children,
}) => {
  const showAvatar = (role === Role.TOOL || role === Role.AI) && !isStartScreen;

  const roleConfigMap = {
    [Role.TOOL]: config.system,
    [Role.AI]: config.agent,
    [Role.CUSTOM]: config.agent,
    [Role.HUMAN]: config.user,
  };

  const roleConfig = roleConfigMap[role];
  const Icon = roleConfig.icon;
  const iconColor = roleConfig.iconColor;

  return (
    <div className={`chat-message ${role === Role.HUMAN ? "user" : "ai"}`}>
      {showAvatar && Icon && (
        <div className="icon_agent h-10 w-10 shrink-0 mr-4 mt-[0.2rem] flex items-center justify-center bg-[var(--darkblue)] rounded-full">
          {typeof Icon === "string" ? (
            <Image
              width="26"
              height="10"
              alt={`${role} icon`}
              src={`/assets/images/${Icon}`}
              className={iconColor}
            />
          ) : (
            <Icon className={iconColor} />
          )}
        </div>
      )}

      <div className="flex-grow mt-2.5">
        <div className="leading-relaxed whitespace-pre-wrap">
          {children ?? <span className="text-gray-400">Loading...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

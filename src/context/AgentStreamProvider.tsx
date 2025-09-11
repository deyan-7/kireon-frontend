"use client";

import { useAgentStream } from "@/lib/hooks/useAgentStream";
import React, { createContext, useContext, ReactNode } from "react";

const StreamContext = createContext<ReturnType<typeof useAgentStream> | null>(
  null
);

export const useAgentStreamContext = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error(
      "useAgentStreamContext must be used within an AgentStreamProvider"
    );
  }
  return context;
};

interface AgentStreamProviderProps {
  children: ReactNode;
}

export const AgentStreamProvider = ({ children }: AgentStreamProviderProps) => {
  const stream = useAgentStream(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream` ||
    "https://kireon-backend-510702145393.europe-west4.run.app/stream"
  );

  return (
    <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>
  );
};

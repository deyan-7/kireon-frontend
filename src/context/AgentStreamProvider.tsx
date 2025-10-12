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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stream` ||
    "https://backend.niceforest-23188099.westeurope.azurecontainerapps.io/api/stream"
  );

  return (
    <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>
  );
};

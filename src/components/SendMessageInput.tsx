"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import TextInput, { TextInputRef } from "./TextInput";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import { useNormalizedParam } from "@/lib/hooks/useNormalizedParam";
import { useAuth } from "@/context/AuthContext";
import LegalLinks from "./LegalLinks";
import { useSplitViewContext } from "./SplitView";

type Props = {
  placeholder?: string;
};

export type SendMessageInputRef = {
  focusInput: () => void;
};

const SendMessageInput = forwardRef<SendMessageInputRef, Props>(
  ({ placeholder }, ref) => {
    const conversationUuid = useNormalizedParam("conversationId") as string;
    const { sendMessage, isStreaming } = useAgentStreamContext();
    const { user, loading } = useAuth();
    const textInputRef = useRef<TextInputRef>(null);
    const { isCompact } = useSplitViewContext();

    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

    const t = useTranslations();

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        textInputRef.current?.focusInput();
      },
    }));

    const handleSubmit = async (message: string) => {
      if (!user || loading) {
        console.warn("User not authenticated yet.");
        return;
      }

      const token = await user.getIdToken();

      await sendMessage(
        {
          thread_id: conversationUuid,
          user_id: user.uid,
          model: "gpt-4o-mini",
          stream_tokens: true,
          message: message,
          agent_id: "hiring-assessment-agent",
        },
        token
      );
    };

    return (
      <div className="container text-center mb-2 mt-1 px-0 md:px-8">
        <div className="relative mb-2">
          <TextInput
            ref={textInputRef}
            inputEnabled={!isStreaming}
            placeholder={placeholder}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-x-4 gap-y-1 text-[0.6rem] text-gray-400">
          <span
            className={`${
              isMobile
                ? "hidden min-[480px]:inline"
                : isCompact
                ? "hidden"
                : "inline"
            } sm:text-left`}
          >
            {t("llm_disclaimer")}
          </span>
          <span
            className={`${
              isMobile
                ? "inline min-[480px]:hidden text-center"
                : isCompact
                ? "inline text-center"
                : "hidden"
            }`}
          >
            {t("llm_disclaimer_short")}
          </span>
          <LegalLinks className="shrink-0" />
        </div>
      </div>
    );
  }
);

SendMessageInput.displayName = "SendMessageInput";
export default SendMessageInput;

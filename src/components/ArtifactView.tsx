"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ArtifactEval from "./ArtifactEval";
import ArtifactForm from "./ArtifactForm";
import ArtifactHeader from "@/components/ArtifactHeader";
import ArtifactActionButton from "@/components/ArtifactActionButton";
import { ArtifactType } from "@/domain/constants";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useTaskContext } from "@/context/TaskContext";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import { useNormalizedParam } from "@/lib/hooks/useNormalizedParam";
import { useMediaQuery } from "react-responsive";

import styles from "./ArtifactView.module.scss";
import ArtifactMarkdown from "./ArtifactMarkdown";

const ArtifactView = () => {
  const { user, loading } = useAuth();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [updatedArtifact, setUpdatedArtifact] = useState<any>(null);

  const {
    artifacts: streamedArtifacts,
    chatMessages,
    sendMessage,
    clearArtifacts,
  } = useAgentStreamContext();

  const lastMessage = chatMessages.at(-1);
  const nextCommand = (lastMessage?.meta?.available_commands as any[])?.[0];
  const conversationUuid = useNormalizedParam("conversationId") as string;

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const artifactScrollRef = useRef<HTMLDivElement | null>(null);

  const { tasks: taskSummary, currentTaskIndex } = useTaskContext();

  const latestArtifact = streamedArtifacts.at(-1);

  const parsedContent = useMemo(() => {
    try {
      if (typeof latestArtifact?.content === "string") {
        const trimmed = latestArtifact.content.trim();
        const isLikelyJson =
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"));
        if (isLikelyJson) {
          try {
            return JSON.parse(trimmed);
          } catch {
            return trimmed;
          }
        }
      }
      return latestArtifact?.content ?? {};
    } catch {
      return {};
    }
  }, [latestArtifact]);

  const artifactType: ArtifactType | undefined =
    latestArtifact?.type ||
    parsedContent.artifact_type ||
    parsedContent.task_type;

  const ArtifactComponent = selectArtifactComponent(artifactType);

  const normalizedArtifact: any = useMemo(
    () => ({
      ...(latestArtifact || {}),
      type: artifactType,
      title:
        latestArtifact?.title ||
        parsedContent.artifact_title ||
        parsedContent.task_title,
      payload:
        parsedContent.payload ||
        parsedContent.artifact_content ||
        parsedContent.task_content?.content ||
        (typeof parsedContent === "string" ? parsedContent : ""),
      status: latestArtifact?.status,
    }),
    [latestArtifact, artifactType, parsedContent]
  );

  const renderedArtifact = useMemo(() => {
    if (!latestArtifact) return null;

    if (
      normalizedArtifact.type === "json_form" &&
      normalizedArtifact.status === "streaming"
    ) {
      return (
        <div className={styles.formLoadingPlaceholder}>
          <div className={styles.shimmerBlock} />
          <div className={`${styles.shimmerBlock} ${styles.short}`} />
          <div className={styles.shimmerBlock} />
          <div className={`${styles.shimmerBlock} ${styles.short}`} />
        </div>
      );
    }

    return (
      <ArtifactComponent
        artifact={normalizedArtifact}
        onModified={setUpdatedArtifact}
      />
    );
  }, [latestArtifact, normalizedArtifact, ArtifactComponent]);

  useEffect(() => {
    const anchor = scrollAnchorRef.current;
    const container = artifactScrollRef.current;
    if (anchor && container) {
      anchor.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [renderedArtifact]);

  const onAction = async () => {
    if (loading || !user) return;
    const updated = updatedArtifact || normalizedArtifact;
    if (!updated) return;

    const token = await user.getIdToken();
    setIsActionLoading(true);
    if (nextCommand?.name === "CMD_SUBMIT_TASK_WITH_ARTIFACT") {
      clearArtifacts();
    }
    await sendMessage(
      {
        thread_id: conversationUuid,
        user_id: user.uid,
        model: "gpt-4o-mini",
        stream_tokens: true,
        message: "",
        agent_id: "kireon-agent",
        agent_config: {
          command_id: nextCommand?.id,
          artifact_content: updated,
        },
      },
      token
    );
    setIsActionLoading(false);
  };

  return (
    <div
      className={clsx(
        styles.artifact,
        "h-full flex flex-col overflow-hidden relative"
      )}
    >
      <div className={clsx(isMobile ? "mobile-header" : "")}>
        <ArtifactHeader
          tasks={taskSummary}
          currentTaskIndex={currentTaskIndex}
        />
      </div>

      <div className={styles.artifactContainer}>
        <div className={styles.fadeIn} />
        <div
          className={clsx(
            styles.artifactContent,
            "pt-[30px] overflow-y-auto h-full"
          )}
          ref={artifactScrollRef}
        >
          <div className={clsx(styles.artifactInnerContent, "pl-10 pr-10")}>
            {renderedArtifact}
            <div ref={scrollAnchorRef} />
          </div>
        </div>
        <div className={styles.fadeOut} />
        <div className={clsx(styles.artifactActionFooter, "pl-10 pr-10")}>
          <ArtifactActionButton
            label={nextCommand?.label}
            onAction={onAction}
            disabled={loading || isActionLoading}
          />
        </div>
      </div>
    </div>
  );
};

function selectArtifactComponent(artifactType?: ArtifactType) {
  switch (artifactType) {
    case ArtifactType.JsonForm:
      return ArtifactForm;
    case ArtifactType.Markdown:
    case ArtifactType.MarkdownEditor:
    case ArtifactType.TaskInstruction:
    case ArtifactType.ChatTask:
      return ArtifactMarkdown;
    case ArtifactType.TaskEvaluation:
    case ArtifactType.EvaluateAll:
      return ArtifactEval;
    default:
      return ArtifactMarkdown;
  }
}

export default ArtifactView;

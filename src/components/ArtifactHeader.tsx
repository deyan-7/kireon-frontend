"use client";

import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ArtifactTimeline from "./ArtifactTimeline";
import Image from "next/image";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";

import styles from "./ArtifactHeader.module.scss";

interface ArtifactHeaderProps {
  tasks?: {
    original_index: number;
    task_title: string;
    task_type: string;
    task_icon: string;
  }[];
  currentTaskIndex: number;
}

const ArtifactHeader = ({
  tasks = [],
  currentTaskIndex,
}: ArtifactHeaderProps) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { reset } = useAgentStreamContext();

  const handleNewConversation = () => {
    const newThreadId = uuidv4();
    reset();

    router.push(`/conversation/${newThreadId}`);
  };

  const handleLogout = async () => {
    reset();
    await signOut();
    router.replace("/signin");
  };
  return (
    <div
      className={clsx(
        styles.artifactHeader,
        "flex flex-col gap-2 px-5 md:px-10 py-4 bg-[var(--artifact-bg)]"
      )}
    >
      <div className="flex flex-row justify-between items-center min-h-[55px]">
        <div className="flex flex-row gap-4 items-center justify-center">
          <span className="ava_title">Kireon GPT</span>
        </div>

        <div className="flex flex-row items-center gap-0 md:gap-6">
          <button
            onClick={handleNewConversation}
            title="Neuer Chat"
            className={styles.headerButton}
          >
            <PencilSquareIcon className="h-6 w-6 text-gray-500" />
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className={styles.headerButton}
          >
            <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-gray-500" />
          </button>
          <Image
            src="/images/logo.png"
            alt="Kireon Logo"
            width={40}
            height={40}
          />
        </div>
      </div>

      {tasks.length > 0 && (
        <ArtifactTimeline
          tasks={tasks}
          currentTask={currentTaskIndex}
          totalTasks={tasks.length}
        />
      )}
    </div>
  );
};

export default ArtifactHeader;

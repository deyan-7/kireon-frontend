"use client";

import type { Task } from "@/types/generic";
import Image from "next/image";
import styles from "./ArtifactTimeline.module.scss";

type Props = {
  tasks: Task[];
  currentTask: number;
  totalTasks: number;
};

const ArtifactTimeline = ({ tasks, currentTask, totalTasks }: Props) => {
  const progressWidth =
    totalTasks > 1 ? `${(currentTask / (totalTasks - 1)) * 100}%` : "0%";

  return (
    <div
      className={`${styles.artifactTimeline} flex justify-between items-center min-h-[55px] relative`}
    >
      <div
        id="artifactTimelineProgressContainer"
        className="absolute top-1/2 left-[2.5rem] right-[2.5rem] h-[2px] z-5 bg-[#747F9E]"
      >
        <div
          id="artifactTimelineProgress"
          className="bg-[#71D8FC] h-[2px] transition-all"
          style={{ width: progressWidth }}
        />
      </div>

      <div
        className={`${styles.artifactTimelineBubbles} flex justify-between items-center w-full z-10 relative`}
      >
        {tasks.map((task) => {
          const taskIndex = task.original_index;
          const done = taskIndex < currentTask;
          const active = taskIndex === currentTask;

          const bubbleClass = [
            styles.timelineItem,
            done && styles.timelineDone,
            active && styles.timelineActive,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={taskIndex}
              className={bubbleClass}
              title={task.task_title}
            >
              <Image
                src={task.task_icon}
                alt={task.task_title}
                width={48}
                height={48}
                className="task-icon w-12 h-12"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtifactTimeline;

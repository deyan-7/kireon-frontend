"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Task } from "@/types/generic";

type TaskContextType = {
  tasks: Task[];
  currentTaskIndex: number;
  updateTasks: (tasks: Task[], index: number) => void;
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  currentTaskIndex: 0,
  updateTasks: () => {},
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const updateTasks = useCallback((newTasks: Task[], index: number) => {
    setTasks(newTasks);
    setCurrentTaskIndex(index);
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, currentTaskIndex, updateTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

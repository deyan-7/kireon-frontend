export class NetworkingError {
  code: number | null;
  message: string;

  constructor(code: number | null, message: string) {
    this.code = code;
    this.message = message;
  }
}

export interface SourceDocument {
  id: string;
  filename: string;
  content: string;
  created?: Date;
  updated?: Date;
}

export interface Task {
  original_index: number;
  task_title: string;
  task_type: string;
  task_icon: string;
}

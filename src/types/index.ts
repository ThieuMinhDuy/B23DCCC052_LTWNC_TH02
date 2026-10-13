export type Priority = 'low' | 'medium' | 'high';

export interface DeadlineTask {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // ISO string format
  priority: Priority;
  completed: boolean;
}

// Generic API response type as requested in Buổi 1
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Custom Type Guard: Kiểm tra xem 1 object có phải là DeadlineTask hay không (Buổi 1)
export function isDeadlineTask(obj: any): obj is DeadlineTask {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.dueDate === 'string' &&
    ['low', 'medium', 'high'].includes(obj.priority) &&
    typeof obj.completed === 'boolean'
  );
}

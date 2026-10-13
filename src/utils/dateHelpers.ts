import { DeadlineTask } from '../types';

/**
 * Kiểm tra xem bài tập đã quá hạn hay chưa.
 * So sánh dueDate với ngày hôm nay (00:00:00).
 */
export function isOverdue(dueDate: string | Date): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;
  due.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
}

/**
 * Tính số ngày còn lại đến hạn nộp.
 * Trả về số âm nếu đã quá hạn, 0 nếu hết hạn hôm nay, số dương nếu còn hạn.
 */
export function calcDaysLeft(dueDate: string | Date): number {
  if (!dueDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return 0;
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export interface StatsResult {
  total: number;
  completed: number;
  overdue: number;
  incomplete: number;
  bySubject: Record<string, number>;
}

/**
 * Tính toán số liệu thống kê cho danh sách bài tập.
 * Đếm số bài đã xong, quá hạn, chưa xong và theo từng môn học.
 */
export function calcStats(tasks: DeadlineTask[] = []): StatsResult {
  const result: StatsResult = {
    total: tasks.length,
    completed: 0,
    overdue: 0,
    incomplete: 0,
    bySubject: {},
  };

  for (const task of tasks) {
    if (task.completed) {
      result.completed += 1;
    } else {
      result.incomplete += 1;
      if (isOverdue(task.dueDate)) {
        result.overdue += 1;
      }
    }

    const subject = task.subject?.trim() || 'Chưa phân loại';
    result.bySubject[subject] = (result.bySubject[subject] || 0) + 1;
  }

  return result;
}

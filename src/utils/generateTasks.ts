import { DeadlineTask, Priority } from '../types';

const SUBJECTS = [
  'Lập trình Web nâng cao',
  'Cơ sở dữ liệu',
  'Trí tuệ nhân tạo',
  'An toàn thông tin',
  'Kiến trúc phần mềm',
  'Mạng máy tính',
  'Hệ điều hành',
  'Thuật toán ứng dụng',
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

/**
 * Hàm sinh dữ liệu mẫu 10.000 bài tập siêu nhanh (tối ưu hóa bộ nhớ và CPU).
 */
export function generateMockTasks(count: number = 10000): DeadlineTask[] {
  const tasks: DeadlineTask[] = new Array(count);
  const now = Date.now();

  // Tiền tính toán trước 30 chuỗi ngày ISO để không phải gọi new Date() 10.000 lần
  const dateCache: string[] = [];
  for (let offset = -10; offset <= 20; offset++) {
    dateCache.push(new Date(now + offset * 24 * 60 * 60 * 1000).toISOString());
  }

  const subjectsLen = SUBJECTS.length;
  const prioritiesLen = PRIORITIES.length;
  const datesLen = dateCache.length;

  for (let i = 0; i < count; i++) {
    const idNum = i + 1;
    const subject = SUBJECTS[i % subjectsLen];
    const priority = PRIORITIES[i % prioritiesLen];
    const dueDate = dateCache[i % datesLen];
    const completed = i % 4 === 0;

    tasks[i] = {
      id: `task-${idNum}`,
      subject,
      title: `Bài tập #${idNum}: Thực hành ${subject} (Phần ${(i % 10) + 1})`,
      dueDate,
      priority,
      completed,
    };
  }

  return tasks;
}

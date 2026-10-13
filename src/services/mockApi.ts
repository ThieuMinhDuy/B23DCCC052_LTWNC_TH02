import { ApiResponse, DeadlineTask } from '../types';

// Data mẫu ban đầu
const MOCK_TASKS: DeadlineTask[] = [
  {
    id: '1',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài tập thực hành React Component',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), 
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế ERD',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    subject: 'Trí tuệ nhân tạo',
    title: 'Nộp báo cáo giữa kỳ',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
    priority: 'low',
    completed: true,
  },
  {
    id: '4',
    subject: 'An toàn thông tin',
    title: 'Tìm hiểu lỗ hổng XSS',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), 
    priority: 'high',
    completed: false,
  }
];

export const fetchInitialTasksApi = async (): Promise<ApiResponse<DeadlineTask[]>> => {
  return new Promise((resolve) => {
    // Giả lập độ trễ mạng 1 giây
    setTimeout(() => {
      resolve({
        data: MOCK_TASKS,
        status: 200,
        message: 'Success',
      });
    }, 1000);
  });
};

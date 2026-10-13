import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DeadlineStats } from '../DeadlineStats';
import deadlinesReducer from '../../deadlines/deadlinesSlice';
import { DeadlineTask } from '../../../types';

const renderStats = (tasks: DeadlineTask[]) => {
  const store = configureStore({
    reducer: {
      deadlines: deadlinesReducer,
    },
    preloadedState: {
      deadlines: {
        tasks,
        status: 'succeeded' as const,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <DeadlineStats />
    </Provider>
  );
};

describe('Component Tests: DeadlineStats', () => {
  it('1. Hiển thị thông báo khi danh sách bài tập rỗng', () => {
    renderStats([]);

    expect(screen.getByText(/Tổng số: 0 bài tập/i)).toBeInTheDocument();
    expect(screen.getByText(/Chưa có dữ liệu bài tập/i)).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('2. Hiển thị chính xác các chỉ số hoàn thành, chưa hoàn thành, quá hạn và theo môn', () => {
    const mockTasks: DeadlineTask[] = [
      {
        id: '1',
        subject: 'Web nâng cao',
        title: 'Task 1',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: 'high',
        completed: true,
      },
      {
        id: '2',
        subject: 'Cơ sở dữ liệu',
        title: 'Task 2',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        priority: 'medium',
        completed: false,
      },
    ];

    renderStats(mockTasks);

    expect(screen.getByText(/Tổng số: 2 bài tập/i)).toBeInTheDocument();
    expect(screen.getByText(/Đã hoàn thành/i)).toBeInTheDocument();
    expect(screen.getByText(/Chưa hoàn thành/i)).toBeInTheDocument();
    expect(screen.getByText(/Đã quá hạn/i)).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('50%')).toBeInTheDocument(); // 1/2 = 50%
    expect(screen.getByText('Web nâng cao')).toBeInTheDocument();
    expect(screen.getByText('Cơ sở dữ liệu')).toBeInTheDocument();
  });
});

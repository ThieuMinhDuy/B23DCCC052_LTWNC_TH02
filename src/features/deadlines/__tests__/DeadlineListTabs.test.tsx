import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DeadlineList } from '../DeadlineList';
import deadlinesReducer from '../deadlinesSlice';
import { DeadlineTask } from '../../../types';

describe('Component Tests: DeadlineList Tabs & Search filtering', () => {
  const mockTasks: DeadlineTask[] = [
    {
      id: 'tab-1',
      subject: 'Toán rời rạc',
      title: 'Đồ thị Euler',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'high',
      completed: false,
    },
    {
      id: 'tab-2',
      subject: 'Hệ điều hành',
      title: 'Bài tập Deadlock',
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      priority: 'medium',
      completed: false,
    },
    {
      id: 'tab-3',
      subject: 'Lập trình Java',
      title: 'Xây dựng GUI Swing',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'low',
      completed: true,
    },
  ];

  const renderWithTasks = (tasks = mockTasks) => {
    const store = configureStore({
      reducer: { deadlines: deadlinesReducer },
      preloadedState: {
        deadlines: {
          tasks,
          status: 'succeeded' as const,
          error: null,
        },
      },
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <DeadlineList />
        </Provider>
      ),
    };
  };

  it('1. Chuyển tab lọc bài tập: Chưa xong, Quá hạn, Đã xong', () => {
    renderWithTasks();

    // Tab Chưa xong (2 bài)
    const incompleteTab = screen.getByRole('button', { name: /^Chưa xong/i });
    fireEvent.click(incompleteTab);
    expect(screen.getByText('Đồ thị Euler')).toBeInTheDocument();
    expect(screen.getByText('Bài tập Deadlock')).toBeInTheDocument();
    expect(screen.queryByText('Xây dựng GUI Swing')).not.toBeInTheDocument();

    // Tab Quá hạn (1 bài)
    const overdueTab = screen.getByRole('button', { name: /^Quá hạn/i });
    fireEvent.click(overdueTab);
    expect(screen.getByText('Bài tập Deadlock')).toBeInTheDocument();
    expect(screen.queryByText('Đồ thị Euler')).not.toBeInTheDocument();

    // Tab Đã xong (1 bài)
    const completedTab = screen.getByRole('button', { name: /^Đã xong/i });
    fireEvent.click(completedTab);
    expect(screen.getByText('Xây dựng GUI Swing')).toBeInTheDocument();
    expect(screen.queryByText('Đồ thị Euler')).not.toBeInTheDocument();
  });

  it('2. Lọc bài tập khi gõ vào ô tìm kiếm với useDebounce', () => {
    jest.useFakeTimers();
    renderWithTasks();

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm bài tập/i);

    // Gõ tìm kiếm 'Java'
    fireEvent.change(searchInput, { target: { value: 'Java' } });

    // Chờ 300ms debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('Xây dựng GUI Swing')).toBeInTheDocument();
    expect(screen.queryByText('Đồ thị Euler')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('3. Thao tác bấm nút Stress test và Xóa dữ liệu mẫu', () => {
    const { store } = renderWithTasks([]);

    // Ban đầu hiển thị empty state
    expect(screen.getByText(/Không có bài tập nào/i)).toBeInTheDocument();

    // Bấm nút tạo 10.000 bài
    const stressBtn = screen.getByText(/Tạo 10.000 bài tập mẫu/i);
    fireEvent.click(stressBtn);

    expect(store.getState().deadlines.tasks.length).toBe(10000);

    // Bấm nút xóa dữ liệu mẫu
    const resetBtn = screen.getByText(/Xóa dữ liệu mẫu/i);
    fireEvent.click(resetBtn);

    expect(store.getState().deadlines.tasks.length).toBe(0);
  });
});

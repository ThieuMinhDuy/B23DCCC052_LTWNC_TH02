import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DeadlineList } from '../DeadlineList';
import deadlinesReducer, { fetchDeadlines } from '../deadlinesSlice';
import * as mockApiModule from '../../../services/mockApi';

jest.mock('../../../services/mockApi');

const renderWithCustomStore = (initialState?: any) => {
  const store = configureStore({
    reducer: {
      deadlines: deadlinesReducer,
    },
    preloadedState: initialState ? { deadlines: initialState } : undefined,
  });

  return render(
    <Provider store={store}>
      <DeadlineList />
    </Provider>
  );
};

describe('Async Tests: AssignmentList / DeadlineList với Mock API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Hiển thị thông báo đang tải khi trạng thái là loading', () => {
    renderWithCustomStore({
      tasks: [],
      status: 'loading',
      error: null,
    });

    expect(screen.getByText(/Đang tải danh sách bài tập/i)).toBeInTheDocument();
  });

  it('2. Hiển thị danh sách bài tập khi fetch API thành công (succeeded)', async () => {
    const mockData = [
      {
        id: 'api-1',
        subject: 'Trí tuệ nhân tạo',
        title: 'Báo cáo bài tập lớn AI',
        dueDate: '2026-11-15T00:00:00.000Z',
        priority: 'high' as const,
        completed: false,
      },
    ];

    (mockApiModule.fetchInitialTasksApi as jest.Mock).mockResolvedValueOnce({
      data: mockData,
      status: 200,
    });

    const store = configureStore({
      reducer: { deadlines: deadlinesReducer },
    });

    render(
      <Provider store={store}>
        <DeadlineList />
      </Provider>
    );

    // Kích hoạt async thunk fetchDeadlines
    act(() => {
      store.dispatch(fetchDeadlines());
    });

    await waitFor(() => {
      expect(screen.getByText('Báo cáo bài tập lớn AI')).toBeInTheDocument();
      expect(screen.getByText('Trí tuệ nhân tạo')).toBeInTheDocument();
    });
  });

  it('3. Hiển thị thông báo lỗi khi fetch API thất bại (failed)', async () => {
    (mockApiModule.fetchInitialTasksApi as jest.Mock).mockRejectedValueOnce(
      new Error('Mất kết nối mạng tới máy chủ')
    );

    const store = configureStore({
      reducer: { deadlines: deadlinesReducer },
    });

    render(
      <Provider store={store}>
        <DeadlineList />
      </Provider>
    );

    // Kích hoạt async thunk và kỳ vọng trạng thái rejected
    act(() => {
      store.dispatch(fetchDeadlines());
    });

    await waitFor(() => {
      expect(screen.getByText(/Lỗi: Mất kết nối mạng tới máy chủ/i)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DeadlineItem } from '../DeadlineItem';
import deadlinesReducer from '../deadlinesSlice';
import { DeadlineTask } from '../../../types';

describe('Component Tests: DeadlineItem wrapper', () => {
  const task: DeadlineTask = {
    id: 'di-1',
    subject: 'Mạng máy tính',
    title: 'Thực hành WireShark',
    dueDate: '2026-12-01T00:00:00.000Z',
    priority: 'medium',
    completed: false,
  };

  it('render DeadlineItem và thực thi tương tác hoàn thành / xóa bài tập', async () => {
    const store = configureStore({
      reducer: { deadlines: deadlinesReducer },
      preloadedState: {
        deadlines: {
          tasks: [task],
          status: 'succeeded' as const,
          error: null,
        },
      },
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DeadlineItem task={task} />
      </Provider>
    );

    expect(screen.getByText('Thực hành WireShark')).toBeInTheDocument();

    // Click toggle hoàn thành
    const toggleBtn = screen.getByRole('button', { name: /hoàn thành/i });
    await user.click(toggleBtn);
    expect(store.getState().deadlines.tasks[0].completed).toBe(true);

    // Click xóa bài tập
    const deleteBtn = screen.getByRole('button', { name: /xóa bài tập/i });
    await user.click(deleteBtn);
    const confirmBtn = screen.getByRole('button', { name: /xóa luôn/i });
    await user.click(confirmBtn);
    expect(store.getState().deadlines.tasks).toHaveLength(0);
  });
});

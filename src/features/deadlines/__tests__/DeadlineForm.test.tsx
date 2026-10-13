import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DeadlineForm } from '../DeadlineForm';
import deadlinesReducer from '../deadlinesSlice';

const renderForm = () => {
  const store = configureStore({
    reducer: {
      deadlines: deadlinesReducer,
    },
  });

  const renderResult = render(
    <Provider store={store}>
      <DeadlineForm />
    </Provider>
  );

  return { store, ...renderResult };
};

describe('Component Tests (RTL + userEvent): DeadlineForm', () => {
  it('1. Validate: Form không dispatch khi các trường bắt buộc để trống', async () => {
    const { store } = renderForm();
    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', { name: /thêm deadline/i });
    await user.click(submitBtn);

    // Danh sách task vẫn rỗng vì form bị chặn validate
    expect(store.getState().deadlines.tasks).toHaveLength(0);
  });

  it('2. Submit: Thêm bài tập thành công khi điền đầy đủ dữ liệu và reset form', async () => {
    const { store } = renderForm();
    const user = userEvent.setup();

    const subjectInput = screen.getByPlaceholderText(/Môn học/i);
    const titleInput = screen.getByPlaceholderText(/Tên bài tập/i);
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    const prioritySelect = screen.getByRole('combobox');
    const submitBtn = screen.getByRole('button', { name: /thêm deadline/i });

    // Người dùng điền thông tin
    await user.type(subjectInput, 'An toàn thông tin');
    await user.type(titleInput, 'Bài lab SQL Injection');
    await user.type(dateInput, '2026-11-20');
    await user.selectOptions(prioritySelect, 'high');

    // Bấm submit
    await user.click(submitBtn);

    // Kiểm tra task đã được thêm vào Redux store
    const tasks = store.getState().deadlines.tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].subject).toBe('An toàn thông tin');
    expect(tasks[0].title).toBe('Bài lab SQL Injection');
    expect(tasks[0].priority).toBe('high');

    // Kiểm tra form đã được reset về trống
    expect(subjectInput).toHaveValue('');
    expect(titleInput).toHaveValue('');
    expect(dateInput).toHaveValue('');
  });
});

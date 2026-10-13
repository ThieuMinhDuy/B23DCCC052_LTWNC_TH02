import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentCard } from '../AssignmentCard';
import { DeadlineTask } from '../../../types';

describe('Component Tests (RTL + userEvent): AssignmentCard', () => {
  const mockTask: DeadlineTask = {
    id: 'card-1',
    subject: 'Lập trình Web nâng cao',
    title: 'Thực hành React Testing',
    dueDate: '2026-12-31T00:00:00.000Z',
    priority: 'high',
    completed: false,
  };

  it('1. Hiển thị đầy đủ thông tin bài tập (tiêu đề, môn học, độ ưu tiên, hạn nộp)', () => {
    render(
      <AssignmentCard
        task={mockTask}
        isPinned={false}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onTogglePin={jest.fn()}
      />
    );

    expect(screen.getByText('Lập trình Web nâng cao')).toBeInTheDocument();
    expect(screen.getByText('Thực hành React Testing')).toBeInTheDocument();
    expect(screen.getByText('Cao')).toBeInTheDocument();
    expect(screen.getByText(/Hạn nộp:/)).toBeInTheDocument();
  });

  it('2. Gọi onToggle khi người dùng click vào nút hoàn thành', async () => {
    const handleToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <AssignmentCard
        task={mockTask}
        isPinned={false}
        onToggle={handleToggle}
        onDelete={jest.fn()}
        onTogglePin={jest.fn()}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /hoàn thành/i });
    await user.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith('card-1');
  });

  it('3. Gọi onTogglePin khi người dùng click vào nút ghim', async () => {
    const handleTogglePin = jest.fn();
    const user = userEvent.setup();

    render(
      <AssignmentCard
        task={mockTask}
        isPinned={false}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onTogglePin={handleTogglePin}
      />
    );

    const pinButton = screen.getByRole('button', { name: /ghim bài tập/i });
    await user.click(pinButton);

    expect(handleTogglePin).toHaveBeenCalledTimes(1);
    expect(handleTogglePin).toHaveBeenCalledWith('card-1');
  });

  it('4. Hiển thị modal xác nhận và gọi onDelete khi click xác nhận xóa', async () => {
    const handleDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <AssignmentCard
        task={mockTask}
        isPinned={true}
        onToggle={jest.fn()}
        onDelete={handleDelete}
        onTogglePin={jest.fn()}
      />
    );

    // Kiểm tra có huy hiệu đã ghim
    expect(screen.getByText(/📌 Đã ghim/i)).toBeInTheDocument();

    // Mở modal xóa
    const deleteButton = screen.getByRole('button', { name: /xóa bài tập/i });
    await user.click(deleteButton);

    expect(screen.getByText(/Xác nhận xóa/i)).toBeInTheDocument();

    // Xác nhận xóa
    const confirmButton = screen.getByRole('button', { name: /xóa luôn/i });
    await user.click(confirmButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('card-1');
  });
});

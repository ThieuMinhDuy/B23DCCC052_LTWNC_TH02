import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addTask } from './deadlinesSlice';
import { DeadlineTask, Priority } from '../../types';

export const DeadlineForm = () => {
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !title || !dueDate) return;

    // Sử dụng Omit type lúc đầu vào (id sinh tự động)
    const newTask: Omit<DeadlineTask, 'id' | 'completed'> & { completed: boolean } = {
      subject,
      title,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      completed: false,
    };

    dispatch(
      addTask({
        ...newTask,
        id: Date.now().toString(), 
      })
    );

    // Reset form
    setSubject('');
    setTitle('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <form className="deadline-form" onSubmit={handleSubmit}>
      <h3>Thêm bài tập mới</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Môn học (VD: Lập trình Web)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Tên bài tập"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn-submit">
        Thêm Deadline
      </button>
    </form>
  );
};

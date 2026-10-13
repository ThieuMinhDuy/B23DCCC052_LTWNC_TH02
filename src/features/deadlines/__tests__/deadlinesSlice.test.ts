import deadlinesReducer, {
  addTask,
  toggleTaskCompletion,
  deleteTask,
  setTasks,
  assignmentsSlice,
  DeadlinesState,
} from '../deadlinesSlice';
import { DeadlineTask } from '../../../types';

describe('Unit Tests: assignmentsSlice / deadlinesSlice Reducer', () => {
  const sampleTask: DeadlineTask = {
    id: 't-1',
    subject: 'Web nâng cao',
    title: 'Làm bài tập Redux',
    dueDate: '2026-10-20T00:00:00.000Z',
    priority: 'high',
    completed: false,
  };

  it('xác nhận assignmentsSlice là alias trỏ tới cùng slice', () => {
    expect(assignmentsSlice.name).toBe('deadlines');
  });

  it('xử lý addTask: thêm bài tập mới vào state', () => {
    const initialState: DeadlinesState = {
      tasks: [],
      status: 'idle',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, addTask(sampleTask));
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0]).toEqual(sampleTask);
  });

  it('xử lý toggleTaskCompletion: đảo trạng thái completed khi id tồn tại', () => {
    const initialState: DeadlinesState = {
      tasks: [{ ...sampleTask, completed: false }],
      status: 'succeeded',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, toggleTaskCompletion('t-1'));
    expect(nextState.tasks[0].completed).toBe(true);

    const toggleBackState = deadlinesReducer(nextState, toggleTaskCompletion('t-1'));
    expect(toggleBackState.tasks[0].completed).toBe(false);
  });

  it('trường hợp biên: toggleTaskCompletion không đổi gì nếu id không tồn tại', () => {
    const initialState: DeadlinesState = {
      tasks: [{ ...sampleTask }],
      status: 'succeeded',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, toggleTaskCompletion('non-existent-id'));
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0].completed).toBe(false);
  });

  it('xử lý deleteTask: xóa bài tập khi id tồn tại', () => {
    const initialState: DeadlinesState = {
      tasks: [sampleTask],
      status: 'succeeded',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, deleteTask('t-1'));
    expect(nextState.tasks).toHaveLength(0);
  });

  it('trường hợp biên: deleteTask không đổi gì khi id không tồn tại', () => {
    const initialState: DeadlinesState = {
      tasks: [sampleTask],
      status: 'succeeded',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, deleteTask('wrong-id'));
    expect(nextState.tasks).toHaveLength(1);
  });

  it('xử lý setTasks: ghi đè danh sách bài tập mới', () => {
    const initialState: DeadlinesState = {
      tasks: [],
      status: 'idle',
      error: null,
    };

    const nextState = deadlinesReducer(initialState, setTasks([sampleTask]));
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0].id).toBe('t-1');
  });
});

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DeadlineTask } from '../../types';
import { fetchInitialTasksApi } from '../../services/mockApi';
import { generateMockTasks } from '../../utils/generateTasks';

export interface DeadlinesState {
  tasks: DeadlineTask[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const isStressActive = typeof window !== 'undefined' && (
  sessionStorage.getItem('stress_10k') === 'true' ||
  window.location.search.includes('stress=true')
);

const initialState: DeadlinesState = {
  tasks: isStressActive ? generateMockTasks(10000) : [],
  status: isStressActive ? 'succeeded' : 'idle',
  error: null,
};

// Async thunk để gọi mock API
export const fetchDeadlines = createAsyncThunk<DeadlineTask[], void>(
  'deadlines/fetchInitial',
  async () => {
    const response = await fetchInitialTasksApi();
    return response.data;
  }
);

const deadlinesSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<DeadlineTask>) => {
      state.tasks.push(action.payload);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setTasks: (state, action: PayloadAction<DeadlineTask[]>) => {
      state.tasks = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Lỗi khi tải dữ liệu';
      });
  },
});

export const { addTask, toggleTaskCompletion, deleteTask, setTasks } = deadlinesSlice.actions;

// Alias để tương thích cả 2 tên gọi deadlinesSlice / assignmentsSlice theo yêu cầu bài lab
export const assignmentsSlice = deadlinesSlice;

export default deadlinesSlice.reducer;

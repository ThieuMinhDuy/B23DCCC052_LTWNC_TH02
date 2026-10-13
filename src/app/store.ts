import { configureStore } from '@reduxjs/toolkit';
import deadlinesReducer from '../features/deadlines/deadlinesSlice';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  collapsed: true,
  predicate: (_getState, action) => action.type !== 'deadlines/setTasks',
});

export const store = configureStore({
  reducer: {
    deadlines: deadlinesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    // Chỉ kích hoạt redux-logger ở môi trường development
    if (import.meta.env.DEV) {
      return middleware.concat(logger);
    }
    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).store = store;
}

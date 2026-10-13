import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchDeadlines } from './features/deadlines/deadlinesSlice';
import { Header } from './components/Header';
import { DeadlineForm } from './features/deadlines/DeadlineForm';
import { DeadlineList } from './features/deadlines/DeadlineList';
import './index.css';

// Kỹ thuật 4 (Phần B): React.lazy và Suspense cho trang/khối Thống kê
const DeadlineStats = lazy(() => import('./features/statistics/DeadlineStats'));

function App() {
  const dispatch = useAppDispatch();
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    // Nếu đang ở chế độ stress test 10k bài thì không cần gọi mock API để tránh delay 1s
    const isStress = sessionStorage.getItem('stress_10k') === 'true' || window.location.search.includes('stress=true');
    if (!isStress) {
      dispatch(fetchDeadlines());
    }
  }, [dispatch]);

  return (
    <div className="app-container">
      <Header />

      <main className="app-main">
        <section className="sidebar">
          <DeadlineForm />
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowStats((prev) => !prev)}
              style={{ width: '100%', padding: '0.6rem' }}
            >
              {showStats ? 'Ẩn thống kê' : '📊 Hiển thị thống kê'}
            </button>
          </div>
        </section>

        <section className="content">
          {showStats && (
            <Suspense fallback={<div className="loading">Đang tải bảng thống kê...</div>}>
              <DeadlineStats />
            </Suspense>
          )}

          <DeadlineList />
        </section>
      </main>
    </div>
  );
}

export default App;

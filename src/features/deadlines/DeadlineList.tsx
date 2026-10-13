import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { toggleTaskCompletion, deleteTask, setTasks } from './deadlinesSlice';
import { AssignmentCard } from './AssignmentCard';
import { usePinStore } from '../../stores/usePinStore';
import { useDebounce } from '../../hooks/useDebounce';
import { isOverdue } from '../../utils/dateHelpers';
import { generateMockTasks } from '../../utils/generateTasks';

export const DeadlineList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, status, error } = useAppSelector((state) => state.deadlines);
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const togglePin = usePinStore((state) => state.togglePin);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'incomplete' | 'overdue' | 'completed'>('all');
  const [useVirtualization, setUseVirtualization] = useState(true);

  // Tự động giữ 10.000 bài tập nếu người dùng đã bấm tạo
  useEffect(() => {
    if (sessionStorage.getItem('stress_10k') === 'true' && tasks.length < 100) {
      dispatch(setTasks(generateMockTasks(10000)));
    }
  }, [dispatch, tasks.length]);

  // Kỹ thuật 2 (Phần B): useDebounce 300ms cho ô tìm kiếm
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Kỹ thuật 1 (Phần B): useCallback cho các handler truyền xuống AssignmentCard đã bọc React.memo
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTaskCompletion(id));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteTask(id));
    },
    [dispatch]
  );

  const handleTogglePin = useCallback(
    (id: string) => {
      togglePin(id);
    },
    [togglePin]
  );

  // Kỹ thuật 2 (Phần B): useMemo cho phần lọc danh sách bài tập
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Lọc theo từ khóa tìm kiếm (đã được debounce 300ms)
    if (debouncedSearchTerm.trim()) {
      const query = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query)
      );
    }

    // Lọc theo Tab trạng thái
    switch (activeTab) {
      case 'incomplete':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      case 'overdue':
        result = result.filter((t) => !t.completed && isOverdue(t.dueDate));
        break;
      case 'all':
      default:
        break;
    }

    // Bài tập đã ghim luôn đưa lên đầu danh sách (Zustand)
    if (pinnedIds.length === 0) {
      return result;
    }
    const pinnedSet = new Set(pinnedIds);
    return [...result].sort((a, b) => {
      const aPinned = pinnedSet.has(a.id);
      const bPinned = pinnedSet.has(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [tasks, debouncedSearchTerm, activeTab, pinnedIds]);

  // Đếm số lượng cho từng Tab bằng 1 vòng lặp duy nhất (Single pass O(N))
  const tabCounts = useMemo(() => {
    let incomplete = 0;
    let overdue = 0;
    let completed = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.completed) {
        completed++;
      } else {
        incomplete++;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due.getTime() < todayTime) {
          overdue++;
        }
      }
    }

    return {
      all: tasks.length,
      incomplete,
      overdue,
      completed,
    };
  }, [tasks]);

  const handleCreate10k = () => {
    sessionStorage.setItem('stress_10k', 'true');
    dispatch(setTasks(generateMockTasks(10000)));
  };

  const handleResetTasks = () => {
    sessionStorage.removeItem('stress_10k');
    dispatch(setTasks([]));
  };

  if (status === 'loading') {
    return <div className="loading">Đang tải danh sách bài tập...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Lỗi: {error}</div>;
  }

  // Kỹ thuật 3 (Phần B): Row renderer cho react-window Virtualization
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const task = filteredTasks[index];
    if (!task) return null;

    return (
      <div style={style} className="virtual-row">
        <AssignmentCard
          task={task}
          isPinned={pinnedIds.includes(task.id)}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
        />
      </div>
    );
  };

  return (
    <div className="deadline-list-container">
      {/* Thanh Stress Test */}
      <div className="stress-test-bar">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-stress-test"
            onClick={handleCreate10k}
            id="btn-stress-10k"
          >
            ⚡ Tạo 10.000 bài tập mẫu
          </button>
          {tasks.length > 50 && (
            <button
              type="button"
              className="btn-cancel"
              onClick={handleResetTasks}
              style={{ fontSize: '0.85rem' }}
            >
              Xóa dữ liệu mẫu
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label className="virtual-toggle">
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
            />
            Bật Virtualization (react-window)
          </label>
          <span className="stress-info-tag">
            Đang hiển thị: <strong>{filteredTasks.length}</strong> / {tasks.length} bài
          </span>
        </div>
      </div>

      {/* Tabs & Tìm kiếm */}
      <div className="tabs-list">
        <div className="tabs-left">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả ({tabCounts.all})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'incomplete' ? 'active' : ''}`}
            onClick={() => setActiveTab('incomplete')}
          >
            Chưa xong ({tabCounts.incomplete})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            Quá hạn ({tabCounts.overdue})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Đã xong ({tabCounts.completed})
          </button>
        </div>

        <div className="tabs-right">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm bài tập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Tìm kiếm bài tập"
          />
        </div>
      </div>

      {/* Danh sách bài tập: Tự động dùng react-window khi có số lượng lớn */}
      <div className="task-list-wrapper">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">Không có bài tập nào phù hợp.</div>
        ) : useVirtualization && filteredTasks.length > 20 ? (
          /* Kỹ thuật 3: Virtualization bằng react-window (chỉ render ~15 items nhìn thấy) */
          <List
            height={600}
            itemCount={filteredTasks.length}
            itemSize={135}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <AssignmentCard
                key={task.id}
                task={task}
                isPinned={pinnedIds.includes(task.id)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineList;

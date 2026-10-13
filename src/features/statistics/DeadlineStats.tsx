import React, { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { calcStats } from '../../utils/dateHelpers';

export const DeadlineStats: React.FC = () => {
  const tasks = useAppSelector((state) => state.deadlines.tasks);
  const stats = useMemo(() => calcStats(tasks), [tasks]);

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="stats-container" data-testid="deadline-stats">
      <div className="stats-header">
        <h3>📊 Thống kê tiến độ học tập</h3>
        <span className="stats-total-badge">Tổng số: {stats.total} bài tập</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Đã hoàn thành</span>
          </div>
        </div>

        <div className="stat-card stat-incomplete">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.incomplete}</span>
            <span className="stat-label">Chưa hoàn thành</span>
          </div>
        </div>

        <div className="stat-card stat-overdue">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <span className="stat-value">{stats.overdue}</span>
            <span className="stat-label">Đã quá hạn</span>
          </div>
        </div>

        <div className="stat-card stat-rate">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{completionRate}%</span>
            <span className="stat-label">Tỷ lệ hoàn thành</span>
          </div>
        </div>
      </div>

      <div className="stats-by-subject">
        <h4>📚 Phân bố bài tập theo môn học:</h4>
        <div className="subject-list">
          {Object.entries(stats.bySubject).length === 0 ? (
            <p className="empty-sub-msg">Chưa có dữ liệu bài tập.</p>
          ) : (
            Object.entries(stats.bySubject).map(([subject, count]) => (
              <div key={subject} className="subject-item">
                <span className="subject-name">{subject}</span>
                <span className="subject-count">{count} bài</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineStats;

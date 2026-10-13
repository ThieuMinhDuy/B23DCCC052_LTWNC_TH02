import React, { useState } from 'react';
import { DeadlineTask } from '../../types';
import { useDeadlineTime } from '../../hooks/useDeadlineTime';

export interface AssignmentCardProps {
  task: DeadlineTask;
  isPinned: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const AssignmentCardInner: React.FC<AssignmentCardProps> = ({
  task,
  isPinned,
  onToggle,
  onDelete,
  onTogglePin,
}) => {
  const timeStatus = useDeadlineTime(task.dueDate);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`deadline-item ${task.completed ? 'completed' : ''} ${
          timeStatus.isOverdue && !task.completed ? 'overdue' : ''
        } ${isPinned ? 'pinned' : ''}`}
        data-testid={`assignment-card-${task.id}`}
      >
        <div className="item-content">
          <div className="item-header">
            <span className="subject">{task.subject}</span>
            <span className={`priority-badge ${task.priority}`}>
              {getPriorityLabel(task.priority)}
            </span>
            {isPinned && (
              <span className="pin-badge" title="Bài tập quan trọng được ghim">
                📌 Đã ghim
              </span>
            )}
          </div>

          <div className="item-body">
            <h4 className="title">{task.title}</h4>

            <div className="meta">
              <span className="date">
                Hạn nộp: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
              </span>
              {!task.completed && (
                <span className={`time-left ${timeStatus.isOverdue ? 'danger' : ''}`}>
                  ({timeStatus.text})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="item-actions">
          {/* Nút Ghim (Zustand) */}
          <button
            type="button"
            className={`btn-pin ${isPinned ? 'active' : ''}`}
            onClick={() => onTogglePin(task.id)}
            title={isPinned ? 'Bỏ ghim' : 'Ghim bài tập'}
            aria-label={isPinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập'}
          >
            📌
          </button>

          {/* Nút Hoàn thành */}
          <button
            type="button"
            className={`btn-toggle ${task.completed ? 'active' : ''}`}
            onClick={() => onToggle(task.id)}
            title={task.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu xong'}
            aria-label={task.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          {/* Nút Xóa */}
          <button
            type="button"
            className="btn-delete"
            onClick={() => setShowDeleteModal(true)}
            title="Xóa bài tập"
            aria-label="Xóa bài tập"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa bài tập <strong>"{task.title}"</strong> không?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleDeleteConfirm}
              >
                Xóa luôn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Kỹ thuật 1: Bọc React.memo để ngăn ngừa re-render không cần thiết khi parent render
export const AssignmentCard = React.memo(AssignmentCardInner);
AssignmentCard.displayName = 'AssignmentCard';

export default AssignmentCard;

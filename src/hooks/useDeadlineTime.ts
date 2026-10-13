import { useMemo } from 'react';

interface DeadlineStatus {
  text: string;
  isOverdue: boolean;
  days: number;
}

export const useDeadlineTime = (dueDateStr: string): DeadlineStatus => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Quá hạn ${Math.abs(diffDays)} ngày`,
        isOverdue: true,
        days: Math.abs(diffDays)
      };
    } else if (diffDays === 0) {
      return {
        text: 'Hết hạn hôm nay',
        isOverdue: false,
        days: 0
      };
    } else {
      return {
        text: `Còn ${diffDays} ngày`,
        isOverdue: false,
        days: diffDays
      };
    }
  }, [dueDateStr]);
};

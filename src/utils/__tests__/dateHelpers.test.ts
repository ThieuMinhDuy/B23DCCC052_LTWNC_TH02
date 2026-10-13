import { isOverdue, calcDaysLeft, calcStats } from '../dateHelpers';
import { DeadlineTask } from '../../types';

describe('Unit Tests: dateHelpers (isOverdue, calcDaysLeft, calcStats)', () => {
  describe('isOverdue', () => {
    it('trả về true khi hạn nộp ở quá khứ', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(isOverdue(yesterday)).toBe(true);
    });

    it('trả về false khi hạn nộp ở tương lai', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(isOverdue(tomorrow)).toBe(false);
    });

    it('trường hợp biên: trả về false khi chuỗi ngày rỗng hoặc không hợp lệ', () => {
      expect(isOverdue('')).toBe(false);
      expect(isOverdue('invalid-date')).toBe(false);
    });
  });

  describe('calcDaysLeft', () => {
    it('tính chính xác số ngày còn lại đến hạn nộp', () => {
      const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(calcDaysLeft(threeDaysLater)).toBeGreaterThanOrEqual(2);
    });

    it('trả về số âm khi đã quá hạn', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      expect(calcDaysLeft(twoDaysAgo)).toBeLessThan(0);
    });

    it('trường hợp biên: trả về 0 khi chuỗi ngày rỗng hoặc không hợp lệ', () => {
      expect(calcDaysLeft('')).toBe(0);
      expect(calcDaysLeft('not-a-date')).toBe(0);
    });
  });

  describe('calcStats', () => {
    it('trường hợp biên: xử lý an toàn khi mảng rỗng hoặc undefined', () => {
      const stats = calcStats([]);
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.overdue).toBe(0);
      expect(stats.incomplete).toBe(0);
      expect(stats.bySubject).toEqual({});
    });

    it('tính đúng số lượng bài hoàn thành, quá hạn và phân loại theo môn', () => {
      const mockTasks: DeadlineTask[] = [
        {
          id: '1',
          subject: 'React',
          title: 'Bài 1',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'high',
          completed: true,
        },
        {
          id: '2',
          subject: 'React',
          title: 'Bài 2',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
          priority: 'medium',
          completed: false,
        },
        {
          id: '3',
          subject: 'Database',
          title: 'Bài 3',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'low',
          completed: false,
        },
      ];

      const stats = calcStats(mockTasks);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.incomplete).toBe(2);
      expect(stats.overdue).toBe(1); // Bài 2 chưa xong và quá hạn
      expect(stats.bySubject['React']).toBe(2);
      expect(stats.bySubject['Database']).toBe(1);
    });
  });
});

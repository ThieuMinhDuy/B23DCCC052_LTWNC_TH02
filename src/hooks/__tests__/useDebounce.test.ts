import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('Hook Tests: useDebounce với fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('1. Trả về giá trị ban đầu ngay lập tức khi khởi tạo', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('2. Không cập nhật giá trị mới trước khi đủ thời gian delay 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'react', delay: 300 },
      }
    );

    // Người dùng gõ thay đổi giá trị
    rerender({ value: 'react-testing', delay: 300 });

    // Trôi qua 150ms (chưa đủ 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Giá trị debounced vẫn giữ nguyên giá trị cũ
    expect(result.current).toBe('react');

    // Tiếp tục trôi qua thêm 150ms nữa (tổng 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Giá trị debounced đã được cập nhật chính xác
    expect(result.current).toBe('react-testing');
  });

  it('3. Reset timer nếu giá trị tiếp tục thay đổi liên tục trước 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Gõ chữ 'b' sau 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'ab' });

    // Gõ tiếp chữ 'c' sau 100ms nữa
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'abc' });

    // Vẫn chưa đạt 300ms kể từ lần gõ cuối cùng
    expect(result.current).toBe('a');

    // Chờ trọn vẹn 300ms kể từ lần gõ 'abc'
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('abc');
  });
});

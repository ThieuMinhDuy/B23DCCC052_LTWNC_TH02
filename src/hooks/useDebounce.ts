import { useState, useEffect } from 'react';

/**
 * Custom hook useDebounce giúp hoãn việc cập nhật giá trị cho đến khi
 * người dùng dừng gõ sau một khoảng delay (mặc định 300ms).
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header-top">
        <h1>Student Deadline Tracker</h1>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}
        >
          {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
        </button>
      </div>
      <p>Quản lý bài tập cá nhân hiệu quả</p>
    </header>
  );
};

export default Header;

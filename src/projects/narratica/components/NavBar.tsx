import React from 'react';
import homeIcon from '../assets/favicon.ico';
import SearchBar from './SearchBar.tsx';

export default function NavBar({ onSearch, showLibrary, showVisualizer }) {
  const handleNavClick = (e, callback) => {
    e.preventDefault();
    callback();
  };
  
  return (
    <header className="sticky top-0 z-10 p-4 bg-[#121286] bg-opacity-80 backdrop-blur-sm">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} className="flex items-center gap-2">
            <img src={homeIcon} alt="Home" width={35} height={35} />
          </a>
        </div>

        <div className="w-full max-w-xs">
          <SearchBar onSearch={onSearch} />
        </div>

        <div>
          <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} title="Visualizer Easter Egg">
            <div className="w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
}
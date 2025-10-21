import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ value, onSearch, placeholder }) {
  return (
    <div className="relative flex items-center w-full">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-narratica-text-secondary" />
      <input
        type="search"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 p-2 rounded-full bg-narratica-gray-dark text-narratica-text-primary placeholder-narratica-text-secondary focus:outline-none focus:ring-2 focus:ring-narratica-green"
      />
    </div>
  );
}
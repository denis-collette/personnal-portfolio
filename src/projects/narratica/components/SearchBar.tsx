import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative flex items-center">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        placeholder="Search title or author..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 p-2 rounded-full bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
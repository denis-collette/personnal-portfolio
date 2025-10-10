import React, { useState } from 'react';
import Card from './components/Card.tsx';
import SkeletonCard from './components/SkeletonCard.tsx';
import SearchBar from './components/SearchBar.tsx';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function Library({
  books,
  isLoading,
  showBookDetail,
  handleNextPage,
  handlePrevPage,
  offset,
  pageSize,
  showFavoritesOnly,
  toggleShowFavorites,
  onSearch,
  searchQuery,
  jumpToPage
}) {
  const [pageInput, setPageInput] = useState('');

  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (pageNum > 0) {
      jumpToPage(pageNum);
      setPageInput('');
    }
  };

  let booksToDisplay = books;
  if (isLoading) {
    return (
      <div>
        <h2 className="text-white font-bold text-3xl mb-10">Searching the archives...</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-white font-bold text-3xl shrink-0">
          {showFavoritesOnly ? 'My Favorites' : 'Browse Audiobooks'}
        </h2>
        <button
          onClick={toggleShowFavorites}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${showFavoritesOnly ? 'bg-indigo-500 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'}`}
        >
          {showFavoritesOnly && <HeartIconSolid className="h-4 w-4" />}
          <span>{showFavoritesOnly ? 'Show All Books' : 'Show Favorites'}</span>
        </button>
        <div className="w-full md:w-auto md:max-w-xs">
          <SearchBar value={searchQuery} onSearch={onSearch} />
        </div>
      </div>

      {booksToDisplay && booksToDisplay.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8">
          {booksToDisplay.map((book) => (
            <div key={book.id} onClick={() => showBookDetail(book.id)} className="cursor-pointer">
              <Card book={book} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          <h3 className="text-xl font-bold">
            {showFavoritesOnly ? 'No Favorites Yet' : 'No Books Found'}
          </h3>
          <p>
            {showFavoritesOnly ? 'Click the heart icon on a book\'s detail page to add it.' : 'Your search returned no results.'}
          </p>
        </div>
      )}

      {!showFavoritesOnly && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button onClick={handlePrevPage} disabled={offset === 0} className="px-4 py-2 bg-neutral-800 rounded-full disabled:opacity-50 hover:bg-neutral-700">
            &larr; Previous
          </button>
          <form onSubmit={handlePageJump} className="flex items-center gap-2">
            <span className="text-gray-400 hidden sm:inline">Page {Math.floor(offset / pageSize) + 1}</span>
            <input
              type="number" min="1" value={pageInput} onChange={(e) => setPageInput(e.target.value)}
              placeholder="Go to..."
              className="w-24 p-2 rounded-full bg-neutral-800 text-white text-center text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 text-sm">
              Go
            </button>
          </form>
          <button onClick={handleNextPage} disabled={!books || books.length < pageSize} className="px-4 py-2 bg-neutral-800 rounded-full disabled:opacity-50 hover:bg-neutral-700">
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
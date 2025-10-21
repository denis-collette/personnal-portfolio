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
  searchType,
  onSearchTypeChange,
  jumpToPage
}) {
  const [pageInput, setPageInput] = useState('');
  const currentPage = Math.floor(offset / pageSize) + 1;

  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      jumpToPage(pageNum);
      setPageInput('');
    }
  };

  let booksToDisplay = books;
  if (showFavoritesOnly && searchQuery && booksToDisplay) {
    const lowercasedQuery = searchQuery.toLowerCase();
    booksToDisplay = booksToDisplay.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(lowercasedQuery);
      const authorMatch = book.authorName
        ? book.authorName.toLowerCase().includes(lowercasedQuery)
        : book.authors?.some(author =>
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(lowercasedQuery)
        );
      return titleMatch || authorMatch;
    });
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-narratica-text-primary font-bold text-3xl mb-10">Searching the archives...</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-5 mb-10">
        {/* Row 1: Title */}
        <h2 className="text-narratica-text-primary font-bold text-3xl">
          {showFavoritesOnly ? 'My Favorites' : 'Browse Audiobooks'}
        </h2>

        {/* Row 2: All Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Search Bar + Toggle Group*/}
          <div className="flex items-center gap-2 w-full flex-grow">
            <SearchBar
              value={searchQuery}
              onSearch={onSearch}
              placeholder={searchType === 'author' ? "Search by author's last name..." : "Search by title..."}
            />
            <div className="flex bg-narratica-gray-dark rounded-full p-1 text-sm shrink-0">
              <button
                onClick={() => onSearchTypeChange('title')}
                className={`px-3 py-1 rounded-full transition-colors ${searchType === 'title' ? 'bg-narratica-green text-narratica-text-primary' : 'text-narratica-text-secondary hover:bg-narratica-gray-light'}`}
              >
                Title
              </button>
              <button
                onClick={() => onSearchTypeChange('author')}
                className={`px-3 py-1 rounded-full transition-colors ${searchType === 'author' ? 'bg-narratica-green text-narratica-text-primary' : 'text-narratica-text-secondary hover:bg-narratica-gray-light'}`}
              >
                Author
              </button>
            </div>
          </div>

          {/* Favorites Button */}
          <button
            onClick={toggleShowFavorites}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-auto ${showFavoritesOnly ? 'bg-narratica-green text-narratica-text-primary' : 'bg-narratica-gray-light text-narratica-text-secondary hover:bg-narratica-gray-dark'}`}
          >
            {showFavoritesOnly && <HeartIconSolid className="h-4 w-4" />}
            <span>{showFavoritesOnly ? 'Show All Books' : 'Show Favorites'}</span>
          </button>
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
        <div className="text-center text-narratica-text-secondary mt-10">
          <h3 className="text-xl font-bold">
            {showFavoritesOnly ? 'No Favorites Found' : 'No Books Found'}
          </h3>
          <p>
            {showFavoritesOnly ? 'Your search returned no results from your favorites.' : 'Your search returned no results.'}
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {!showFavoritesOnly && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 text-sm">
          <button onClick={handlePrevPage} disabled={offset === 0} className="px-4 py-2 bg-narratica-gray-dark rounded-full disabled:opacity-50 hover:bg-narratica-gray-light">
            &larr; Previous
          </button>

          <form onSubmit={handlePageJump} className="flex items-center gap-2">
            <span className="text-narratica-text-secondary hidden sm:inline">Page</span>
            <input
              type="number"
              min="1"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={currentPage.toString()}
              className="w-20 p-2 rounded-full bg-narratica-gray-dark text-narratica-text-primary text-center placeholder-narratica-text-secondary focus:outline-none focus:ring-2 focus:ring-narratica-green"
            />
            <button type="submit" className="px-4 py-2 bg-narratica-green rounded-full hover:bg-narratica-green/80 text-sm">
              Go
            </button>
          </form>

          <button
            onClick={handleNextPage}
            disabled={!books || books.length < pageSize}
            className="px-4 py-2 bg-narratica-gray-dark rounded-full disabled:opacity-50 hover:bg-narratica-gray-light"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
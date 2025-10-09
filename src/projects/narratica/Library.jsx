import React from 'react';
import Card from './components/Card.tsx';
import SkeletonCard from './components/SkeletonCard.tsx';

export default function Library({ books, isLoading, showBookDetail, handleNextPage, handlePrevPage, offset, pageSize, favoriteIds, showFavoritesOnly }) {
  const filteredBooks = showFavoritesOnly
    ? books.filter(book => favoriteIds.has(book.id))
    : books;

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
      <h2 className="text-white font-bold text-3xl mb-10">
        {showFavoritesOnly ? 'My Favorites' : 'Browse Audiobooks'}
      </h2>

      {filteredBooks && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredBooks.map((book) => (
            <div key={book.id} onClick={() => showBookDetail(book.id)} className="cursor-pointer">
              <Card
                book={{
                  id: book.id,
                  url_image: book.url_image,
                  title: book.title,
                  authorName: book.authors[0]?.first_name + ' ' + book.authors[0]?.last_name,
                }}
              />
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

      {/* Pagination Controls */}
      {!showFavoritesOnly && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button onClick={handlePrevPage} disabled={offset === 0} className="px-4 py-2 bg-neutral-800 rounded-full disabled:opacity-50 hover:bg-neutral-700">
            &larr; Previous
          </button>
          <span className="text-gray-400">Page {Math.floor(offset / pageSize) + 1}</span>
          <button onClick={handleNextPage} disabled={!books || books.length < pageSize} className="px-4 py-2 bg-neutral-800 rounded-full disabled:opacity-50 hover:bg-neutral-700">
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
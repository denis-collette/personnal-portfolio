import React from 'react';

interface Book {
  id: string | number;
  cover_art_jpg?: string;
  url_image?: string;
  title: string;
  authorName?: string;
  narratorName?: string;
}

interface Props {
  book: Book;
}

const Card = ({ book }: Props) => {
  const imageUrl = book.url_image || book.cover_art_jpg;
  const secureImageUrl = imageUrl?.replace(/^http:\/\//i, 'https://');

  return (
    <section className='rounded-lg bg-neutral-800 w-full shadow-lg hover:bg-neutral-700 cursor-pointer transition-colors'>
      <section className='relative w-full aspect-square'>
        {secureImageUrl ? (
          <img className='object-cover rounded-t-lg w-full h-full' src={secureImageUrl} alt={`Cover for ${book.title}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-700 rounded-md">
            <svg className="w-1/2 h-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8c2.21 0 4 1.79 4 4s-1.79 4-4 4" opacity="0.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 10c1.105 0 2 .895 2 2s-.895 2-2 2" opacity="0.8" />
            </svg>
          </div>
        )}
      </section>
      <section className='p-3'>
        <h2 className='text-white text-sm font-bold truncate' title={book.title}>
          {book.title}
        </h2>
        <h3 className='text-gray-400 text-xs truncate' title={book.authorName}>
          {book.authorName}
        </h3>
      </section>
    </section>
  );
}

export default Card;
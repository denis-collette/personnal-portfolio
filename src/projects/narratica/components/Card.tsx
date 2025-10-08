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
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-t-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v1.5M12 12.253v6.5M18.364 5.636l-1.06 1.06M6.736 17.264l-1.06 1.06M21.75 12.253h-1.5M3.75 12.253h-1.5M17.304 17.264l-1.06-1.06M7.794 6.696l-1.06-1.06" />
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
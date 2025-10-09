import React from 'react'; // Remove useState
import { PlayIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

export default function BookDetail({ bookDetails, isLoading, setPlaylist, isFavorited, toggleFavorite }) {
  const handlePlay = (track, trackIndex) => {
    const playlistTracks = bookDetails?.tracks || bookDetails?.sections;
    if (playlistTracks) {
      setPlaylist(playlistTracks, bookDetails, trackIndex);
    }
  };

  const cleanDescription = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="w-48 h-48 rounded-lg shadow-lg bg-neutral-700 flex-shrink-0"></div>
          <div className="flex-1 space-y-4 mt-4 md:mt-0">
            <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-700 rounded w-1/2"></div>
            <div className="h-4 bg-neutral-700 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookDetails) {
    return <p className="text-center text-red-500 mt-10">Could not find this audiobook.</p>;
  }

  const secureImageUrl = (bookDetails.rssImage || bookDetails.url_image)?.replace(/^http:\/\//i, 'https');
  const tracks = bookDetails.tracks || bookDetails.sections;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <section className="w-48 h-48 rounded-lg shadow-lg flex-shrink-0">
          {secureImageUrl ? (
            <img className='object-cover rounded-lg w-full h-full' src={secureImageUrl} alt={`Cover for ${bookDetails.title}`} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-lg">
              <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8c2.21 0 4 1.79 4 4s-1.79 4-4 4" opacity="0.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 10c1.105 0 2 .895 2 2s-.895 2-2 2" opacity="0.8" />
              </svg>
            </div>
          )}
        </section>
        <div>
          <h2 className="text-3xl font-bold">{bookDetails.title}</h2>
          <p className="text-lg text-gray-300 mt-2">
            by {bookDetails.authors[0]?.first_name} {bookDetails.authors[0]?.last_name}
          </p>
          <button onClick={toggleFavorite} title="Add to Favorites" className="text-indigo-400 hover:text-white transition-colors">
            {isFavorited ? (
              <HeartIconSolid className="h-7 w-7" />
            ) : (
              <HeartIconOutline className="h-7 w-7" />
            )}
          </button>
          <p className="text-gray-400 mt-4 text-sm max-w-prose">
            {cleanDescription(bookDetails.description)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Chapters</h3>
        <ul className="space-y-2">
          {tracks?.map((track, index) => (
            <li
              key={track.id}
              className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition"
              onClick={() => handlePlay(track, index)}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-gray-400">{track.section_number}.</span>
                <p className="font-medium truncate">{track.title}</p>
              </div>
              <PlayIcon className="h-6 w-6 text-gray-300 flex-shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
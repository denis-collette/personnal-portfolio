import React, { useState } from 'react';
import { PlayIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

export default function BookDetail({ bookDetails, isLoading, setPlaylist }) {
  const [isFavorited, setIsFavorited] = useState(false);

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

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v1.5M12 12.253v6.5M18.364 5.636l-1.06 1.06M6.736 17.264l-1.06 1.06M21.75 12.253h-1.5M3.75 12.253h-1.5M17.304 17.264l-1.06-1.06M7.794 6.696l-1.06-1.06" />
              </svg>
            </div>
          )}
        </section>
        <div>
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
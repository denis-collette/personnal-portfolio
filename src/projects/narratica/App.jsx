import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/narratica.css';
import NavBar from './components/NavBar.tsx';
import AudioPlayerBar from './components/AudioPlayerBar.tsx';
import Library from './Library.jsx';
import BookDetail from './BookDetail.jsx';
import Visualizer from './safeZone/Visualizer.tsx';
import Profile from './components/Profile.jsx';

const PAGE_SIZE = 20;

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState({ page: 'library', id: null });
  const [activeSong, setActiveSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [currentBookDetails, setCurrentBookDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('narratica_favorites');
      return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    }
    return new Set();
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // --- HOOKS for INITIALIZATION and DATA FETCHING ---
  useEffect(() => {
    localStorage.setItem('narratica_favorites', JSON.stringify(Array.from(favoriteIds)));
  }, [favoriteIds]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
  }, []);

  useEffect(() => {
    const fetchCoverImages = async (bookList) => {
      for (const book of bookList) {
        if (book.url_rss) {
          try {
            // UPDATED to POST
            const response = await fetch('/api/librivox', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rss_url: book.url_rss })
            });
            const data = await response.json();
            if (data.imageUrl) {
              setBooks(currentBooks =>
                currentBooks.map(b =>
                  b.id === book.id ? { ...b, url_image: data.imageUrl } : b
                )
              );
            }
          } catch (err) {
            console.error(`Failed to fetch cover for book ID ${book.id}:`, err);
          }
        }
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      if (view.page === 'library') setCurrentBookDetails(null);

      try {
        if (view.page === 'library') {
          const response = await fetch('/api/librivox', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sort_order: 'date_added',
              limit: PAGE_SIZE,
              offset: offset,
              title: searchQuery ? `^${searchQuery}` : undefined
            })
          });
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          const data = await response.json();
          const initialBooks = data.books || [];
          setBooks(initialBooks);
          if (initialBooks.length > 0) fetchCoverImages(initialBooks);

        } else if (view.page === 'bookDetail' && view.id) {
          const bookResponse = await fetch('/api/librivox', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: view.id })
          });
          const bookData = await bookResponse.json();
          if (bookData.books && bookData.books.length > 0) {
            const details = bookData.books[0];
            if (details.url_rss) {
              const rssToJsonApi = `https://api.rss2json.com/v1/api.json?rss_url=`;
              const rssResponse = await fetch(rssToJsonApi + encodeURIComponent(details.url_rss));
              const rssData = await rssResponse.json();
              if (rssData.feed?.image) details.rssImage = rssData.feed.image;
              if (rssData.items) {
                details.tracks = rssData.items.map((item, i) => ({ id: i, title: item.title, mp3: item.enclosure.link, section_number: i + 1 }));
              }
            }
            setCurrentBookDetails(details);
          }
        }
      } catch (err) { console.error("Fetch failed:", err); }
      finally { setIsLoading(false); }
    };

    fetchData();
  }, [view, offset, searchQuery]);

  useEffect(() => {
    if (activeSong && audioRef.current) {
      const audio = audioRef.current;
      audio.src = activeSong.audioSrc;
      audio.play().catch(e => console.error("Playback failed", e));
    }
  }, [activeSong]);

  // --- HANDLER FUNCTIONS ---
  const showProfile = () => setView({ page: 'profile', id: null });

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  const toggleFavorite = (bookId) => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(bookId)) {
        newIds.delete(bookId);
      } else {
        newIds.add(bookId);
      }
      return newIds;
    });
  };

  const toggleShowFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setOffset(0);
  };

  const handleNextPage = () => setOffset(prev => prev + PAGE_SIZE);

  const handlePrevPage = () => setOffset(prev => Math.max(0, prev - PAGE_SIZE));

  const showLibrary = () => setView({ page: 'library', id: null });

  const showBookDetail = (bookId) => setView({ page: 'bookDetail', id: bookId });

  const showVisualizer = () => setView({ page: 'visualizer', id: null });

  const handleSetPlaylist = (tracks, bookDetails, startIndex = 0) => {
    const proxyUrl = '/api/librivox?url=';
    const formattedPlaylist = tracks.map(track => ({
      id: bookDetails.id,
      title: track.title,
      author: bookDetails.authors[0]?.last_name,
      imgUrl: (bookDetails.rssImage || bookDetails.url_image)?.replace(/^http:\/\//i, 'https'),
      audioSrc: `/api/librivox?url=${track.mp3.replace(/^http:\/\//i, 'https')}`,
    }));
    setPlaylist(formattedPlaylist);
    setCurrentTrackIndex(startIndex);
    setActiveSong(formattedPlaylist[startIndex]);
  };

  const handleNextSong = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setActiveSong(playlist[nextIndex]);
  };

  const handlePrevSong = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    setActiveSong(playlist[prevIndex]);
  };

  const handleSeek = (progress) => {
    const audio = audioRef.current;
    if (audio && audio.duration && isFinite(audio.duration)) {
      audio.currentTime = progress * audio.duration;
    }
  };

  const handleSkip = (seconds) => {
    const audio = audioRef.current;
    if (audio && audio.duration && isFinite(audio.duration)) {
      audio.currentTime = Math.max(0, audio.currentTime + seconds);
    }
  };

  const handleSongClick = () => {
    if (activeSong) showBookDetail(activeSong.id);
  };

  const renderCurrentPage = () => {
    switch (view.page) {
      case 'profile':
        const favoriteBooks = books.filter(book => favoriteIds.has(book.id));
        return <Profile
          showLibrary={showLibrary}
          showBookDetail={showBookDetail}
          favoriteBooks={favoriteBooks}
        />;
      case 'bookDetail':
        return <BookDetail
          bookDetails={currentBookDetails}
          isLoading={isLoading}
          setPlaylist={handleSetPlaylist}
          isFavorited={favoriteIds.has(currentBookDetails?.id)}
          toggleFavorite={() => toggleFavorite(currentBookDetails?.id)}
        />;
      case 'visualizer':
        return <Visualizer audioEl={audioRef.current} />;
      case 'library':
      default:
        return (
          <Library
            books={books}
            isLoading={isLoading}
            showBookDetail={showBookDetail}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            offset={offset}
            pageSize={PAGE_SIZE}
            favoriteIds={favoriteIds}
            showFavoritesOnly={showFavoritesOnly}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="relative flex flex-col h-[85vh] min-h-[550px] max-h-[800px] bg-neutral-900 text-white rounded-lg overflow-hidden">
      <NavBar
        showProfile={showProfile}
        showLibrary={showLibrary}
        showVisualizer={showVisualizer}
        isLoggedIn={isLoggedIn}
        toggleLogin={toggleLogin}
        showFavoritesOnly={showFavoritesOnly}
        toggleShowFavorites={toggleShowFavorites}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderCurrentPage()}
      </main>
      {activeSong && (
        <div className="sticky bottom-0 z-10">
          <AudioPlayerBar
            audioEl={audioRef.current}
            activeSong={activeSong}
            onNext={handleNextSong}
            onPrev={handlePrevSong}
            onSeek={handleSeek}
            onSkip={handleSkip}
            onSongClick={handleSongClick}
          />
        </div>
      )}
    </div>
  );
}
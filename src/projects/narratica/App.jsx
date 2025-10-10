import React, { useState, useRef, useEffect } from 'react';
import './styles/narratica.css';
import NavBar from './components/NavBar.tsx';
import AudioPlayerBar from './components/AudioPlayerBar.tsx';
import Library from './Library.jsx';
import BookDetail from './BookDetail.jsx';
import Visualizer from './safeZone/Visualizer.tsx';
import Profile from './components/Profile.jsx';
import { useLocalStorage } from './hooks/useLocalStorage';

const PAGE_SIZE = 20;

const mockUser = {
  username: "DemoUser",
  email: "demo@narratica.app",
  first_name: "Alex",
  last_name: "River",
  date_joined: "2024-01-01T10:00:00Z",
  profile_img: "https://github.com/shadcn.png",
};

export default function App() {
  const [view, setView] = useState({ page: 'library', id: null });
  const [activeSong, setActiveSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [currentBookDetails, setCurrentBookDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const prevSearchType = useRef(searchType);
  const [offset, setOffset] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [paginatedBooks, setPaginatedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userData, setUserData] = useLocalStorage('narratica_user', mockUser);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('narratica_favorites');
      return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    }
    return new Set();
  });

  // --- HOOKS ---
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && !sourceRef.current) {
      const AudioContext = window.AudioContext || (window).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      const resumeContext = () => {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
      };
      audioRef.current.addEventListener('play', resumeContext);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('narratica_favorites', JSON.stringify(Array.from(favoriteIds)));
  }, [favoriteIds]);

  useEffect(() => {
    if (showFavoritesOnly || view.page !== 'library') return;

    if (prevSearchType.current !== searchType && !debouncedQuery) {
      prevSearchType.current = searchType;
      return;
    }

    prevSearchType.current = searchType;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const bodyPayload = {
          sort_order: 'date_added',
          limit: PAGE_SIZE,
          offset
        };

        if (debouncedQuery) {
          bodyPayload[searchType] = `^${debouncedQuery}`;
        }

        const response = await fetch('/api/librivox', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        const initialBooks = data.books || [];
        const coverPromises = initialBooks.map(book => {
          if (!book.url_rss) return Promise.resolve(null);
          return fetch('/api/librivox', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rss_url: book.url_rss })
          }).then(res => res.json());
        });
        const coverResults = await Promise.all(coverPromises);
        const finalBooks = initialBooks.map((book, index) => ({
          ...book,
          authorName: book.authors.map(a => `${a.first_name} ${a.last_name}`).join(', '),
          display_image: coverResults[index]?.imageUrl || book.url_image_archive
        }));
        setPaginatedBooks(finalBooks);
      } catch (err) { console.error("Fetch failed:", err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [view.page, offset, debouncedQuery, showFavoritesOnly, searchType]);

  useEffect(() => {
    const fetchAllFavorites = async () => {
      const idsToFetch = Array.from(favoriteIds);
      if (idsToFetch.length === 0) {
        setFavoriteBooks([]);
        return;
      }
      try {
        const bookPromises = idsToFetch.map(id => fetch('/api/librivox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then(res => res.json()));
        const results = await Promise.all(bookPromises);
        let booksData = results.map(result => result.books[0]).filter(Boolean);
        const coverPromises = booksData.map(book => {
          if (!book.url_rss) return Promise.resolve(null);
          return fetch('/api/librivox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rss_url: book.url_rss }) }).then(res => res.json());
        });
        const coverResults = await Promise.all(coverPromises);
        const finalFavoriteBooks = booksData.map((book, index) => ({
          ...book,
          authorName: book.authors.map(a => `${a.first_name} ${a.last_name}`).join(', '),
          display_image: coverResults[index]?.imageUrl || book.url_image_archive
        }));
        setFavoriteBooks(finalFavoriteBooks);
      } catch (error) { console.error("Failed to fetch all favorite books:", error); }
    };
    fetchAllFavorites();
  }, [favoriteIds]);

  useEffect(() => {
    if (view.page !== 'bookDetail' || !view.id) return;
    const fetchBookDetail = async () => {
      setIsLoading(true);
      try {
        const bookResponse = await fetch('/api/librivox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: view.id }) });
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
      } catch (err) { console.error("Fetch book detail failed:", err); }
      finally { setIsLoading(false); }
    };
    fetchBookDetail();
  }, [view.page, view.id]);

  useEffect(() => {
    if (activeSong && audioRef.current) {
      const audio = audioRef.current;
      audio.src = activeSong.audioSrc;
      audio.play().catch(e => console.error("Playback failed", e));
    }
  }, [activeSong]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  const handleProfileUpdate = (newUserData) => {
    setUserData(newUserData);
  };

  const handleAuthorSearch = (authorName) => {
    setSearchType('author');
    setSearchQuery(authorName);
    setDebouncedQuery(authorName);
    setView({ page: 'library', id: null });
  };

  const toggleFavorite = (bookId) => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(bookId)) { newIds.delete(bookId); }
      else { newIds.add(bookId); }
      return newIds;
    });
  };
  const toggleShowFavorites = () => setShowFavoritesOnly(prev => !prev);
  const handleSearch = (query) => {
    setSearchQuery(query);
    setOffset(0);
  };
  const handleSearchTypeChange = (type) => setSearchType(type);
  const handleNextPage = () => setOffset(prev => prev + PAGE_SIZE);
  const handlePrevPage = () => setOffset(prev => Math.max(0, prev - PAGE_SIZE));
  const jumpToPage = (pageNumber) => setOffset(Math.max(0, (pageNumber - 1) * PAGE_SIZE));
  const showLibrary = () => setView({ page: 'library', id: null });
  const showBookDetail = (bookId) => setView({ page: 'bookDetail', id: bookId });
  const showVisualizer = () => setView({ page: 'visualizer', id: null });
  const showProfile = () => setView({ page: 'profile', id: null });
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const handleSetPlaylist = (tracks, bookDetails, startIndex = 0) => {
    const formattedPlaylist = tracks.map(track => ({
      id: bookDetails.id, title: track.title, author: bookDetails.authors[0]?.last_name,
      imgUrl: (bookDetails.rssImage || bookDetails.url_image)?.replace(/^http:\/\//i, 'https'),
      audioSrc: `/api/librivox?url=${track.mp3.replace(/^http:\/\//i, 'https')}`,
    }));
    setPlaylist(formattedPlaylist);
    setCurrentTrackIndex(startIndex);
    setActiveSong(formattedPlaylist[startIndex]);
  };
  const handleNextSong = () => { if (playlist.length === 0) return; const nextIndex = (currentTrackIndex + 1) % playlist.length; setCurrentTrackIndex(nextIndex); setActiveSong(playlist[nextIndex]); };
  const handlePrevSong = () => { if (playlist.length === 0) return; const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length; setCurrentTrackIndex(prevIndex); setActiveSong(playlist[prevIndex]); };
  const handleSeek = (progress) => { const audio = audioRef.current; if (audio && audio.duration && isFinite(audio.duration)) { audio.currentTime = progress * audio.duration; } };
  const handleSkip = (seconds) => { const audio = audioRef.current; if (audio && audio.duration && isFinite(audio.duration)) { audio.currentTime = Math.max(0, audio.currentTime + seconds); } };
  const handleSongClick = () => { if (activeSong) showBookDetail(activeSong.id); };

  const renderCurrentPage = () => {
    switch (view.page) {
      case 'profile':
        return <Profile
          userData={userData}
          onProfileUpdate={handleProfileUpdate}
          showLibrary={showLibrary}
          showBookDetail={showBookDetail}
          favoriteBooks={favoriteBooks}
          onAuthorSearch={handleAuthorSearch}
        />;
      case 'bookDetail':
        return <BookDetail
          bookDetails={currentBookDetails}
          isLoading={isLoading}
          setPlaylist={handleSetPlaylist}
          isFavorited={favoriteIds.has(currentBookDetails?.id)}
          toggleFavorite={() => toggleFavorite(currentBookDetails?.id)}
          onAuthorSearch={handleAuthorSearch}
        />;
      case 'visualizer':
        return <Visualizer analyser={analyserRef.current} audioEl={audioRef.current} />;
      case 'library':
      default:
        const booksToDisplay = showFavoritesOnly ? favoriteBooks : paginatedBooks;
        const showLoading = isLoading && !showFavoritesOnly;
        return <Library
          books={booksToDisplay}
          isLoading={showLoading}
          showBookDetail={showBookDetail}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          offset={offset} pageSize={PAGE_SIZE}
          showFavoritesOnly={showFavoritesOnly}
          toggleShowFavorites={toggleShowFavorites}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          jumpToPage={jumpToPage}
        />;
    }
  };

  return (
    <div className="relative flex flex-col h-[85vh] min-h-[550px] max-h-[800px] bg-neutral-900 text-white rounded-lg overflow-hidden">
      <NavBar
        userData={userData}
        showProfile={showProfile}
        showLibrary={showLibrary}
        showVisualizer={showVisualizer}
        isLoggedIn={isLoggedIn}
        toggleLogin={toggleLogin}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderCurrentPage()}
      </main>
      {activeSong && (
        <div className="sticky bottom-0 z-10">
          <AudioPlayerBar audioEl={audioRef.current} activeSong={activeSong} onNext={handleNextSong} onPrev={handlePrevSong} onSeek={handleSeek} onSkip={handleSkip} onSongClick={handleSongClick} />
        </div>
      )}
    </div>
  );
}
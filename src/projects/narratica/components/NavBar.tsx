import React, { useState } from 'react';
import homeIcon from '../assets/favicon.ico';
import SearchBar from './SearchBar.tsx';
import { ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

interface NavBarProps {
  onSearch: (query: string) => void;
  showLibrary: () => void;
  showVisualizer: () => void;
  showProfile: () => void;
  isLoggedIn: boolean;
  toggleLogin: () => void;
  showFavoritesOnly: boolean;
  toggleShowFavorites: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  onSearch, showLibrary, showVisualizer, showProfile, 
  isLoggedIn, toggleLogin, showFavoritesOnly, toggleShowFavorites 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mockUser = {
    username: "Demo User",
    avatar: "https://github.com/shadcn.png",
  };

  const handleNavClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    callback();
    setIsMenuOpen(false); // Close menu after a navigation action
  };
  
  const handleFavoritesClick = () => {
    toggleShowFavorites();
    setIsMenuOpen(false); // Close menu after action
  };

  return (
    <header className="sticky top-0 z-20 p-2 px-3.5 bg-narratica-dark text-white bg-opacity-95 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* --- DESKTOP NAVBAR --- */}
        <div className="hidden md:flex flex-grow justify-between items-center gap-4">
          {/* Left Section */}
          <div className="flex gap-2 items-center">
            <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} title="Home" className="flex-shrink-0">
              <img src={homeIcon} alt="Home" style={{ width: 35, height: 35 }} />
            </a>
            {isLoggedIn && (
              <button onClick={toggleShowFavorites} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${showFavoritesOnly ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}>
                Favorites
              </button>
            )}
          </div>

          {/* Center Section */}
          <div className="flex-grow max-w-sm">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Right Section */}
          <section className="flex gap-4 items-center">
            {isLoggedIn ? (
              <>
                <button onClick={toggleLogin} title="Logout" className="px-3 py-2 rounded-full text-sm font-medium transition-all bg-neutral-800 text-white hover:bg-neutral-700">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
                <a href="#" onClick={(e) => handleNavClick(e, showProfile)} title={`Profile: ${mockUser.username}`} className="flex-shrink-0">
                  <img src={mockUser.avatar} alt="User Avatar" className="w-9 h-9 rounded-full" />
                </a>
              </>
            ) : (
              <>
                <button onClick={toggleLogin} className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-800 text-white hover:bg-neutral-700">
                  Login
                </button>
              </>
            )}
            <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} title="Visualizer Easter Egg">
              <div className="w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform opacity-50 hover:opacity-100" />
            </a>
          </section>
        </div>

        {/* --- MOBILE NAVBAR --- */}
        <div className="md:hidden flex justify-between items-center w-full">
           <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} title="Home" className="flex-shrink-0">
              <img src={homeIcon} alt="Home" style={{ width: 35, height: 35 }} />
            </a>
            <span className="text-lg font-bold">Narratica</span>
           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-30">
             {isMenuOpen ? <XMarkIcon className="h-7 w-7"/> : <Bars3Icon className="h-7 w-7"/>}
           </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-narratica-dark flex flex-col items-center justify-center gap-8 text-xl z-20 animate-slideup">
          <div className="w-full max-w-xs mb-8">
            <SearchBar onSearch={onSearch} />
          </div>
          
          {isLoggedIn ? (
            <>
              <button onClick={handleFavoritesClick} className={`px-6 py-3 rounded-full font-medium transition-colors ${showFavoritesOnly ? 'bg-indigo-500' : 'bg-neutral-800'}`}>
                {showFavoritesOnly ? 'Show All' : 'My Favorites'}
              </button>
              <a href="#" onClick={(e) => handleNavClick(e, showProfile)} className="bg-neutral-800 px-6 py-3 rounded-full font-medium">Profile</a>
              <button onClick={toggleLogin} className="bg-neutral-800 px-6 py-3 rounded-full font-medium">Logout</button>
            </>
          ) : (
            <>
              <button onClick={toggleLogin} className="bg-neutral-800 px-6 py-3 rounded-full font-medium">Login</button>
              <button onClick={toggleLogin} className="bg-green-700 px-6 py-3 rounded-full font-medium">Sign Up</button>
            </>
          )}
          <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} className="text-green-500 mt-4">Visualizer</a>
        </div>
      )}
    </header>
  );
};

export default NavBar;
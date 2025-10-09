import React from 'react';
import homeIcon from '../assets/favicon.ico';
import SearchBar from './SearchBar.tsx';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

interface NavBarProps {
  onSearch: (query: string) => void;
  showLibrary: () => void;
  showVisualizer: () => void;
  isLoggedIn: boolean;
  toggleLogin: () => void;
  showProfile: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, showLibrary, showVisualizer, isLoggedIn, toggleLogin, showProfile }) => {
  const mockUser = {
    username: "Demo User",
    avatar: "https://github.com/shadcn.png",
  };

  const handleNavClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    callback();
  };

  return (
    <header className="sticky top-0 z-10 p-2 px-3.5 bg-narratica-dark text-white ...">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-2 items-center">
          <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} title="Home" className="flex-shrink-0">
            <img src={homeIcon} alt="Home" style={{ width: 35, height: 35 }} />
          </a>
          {isLoggedIn && (
            <a href="#" onClick={(e) => e.preventDefault()} className="hidden md:block px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700">
              Favorites
            </a>
          )}
        </div>

        <div className="flex-grow max-w-sm">
          <SearchBar onSearch={onSearch} />
        </div>

        <section className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <button onClick={toggleLogin} title="Click to Logout" className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700">
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </button>
              <a href="#" onClick={(e) => { e.preventDefault(); showProfile(); }} title={`Profile: ${mockUser.username}`} className="flex-shrink-0"> {/* Add flex-shrink-0 */}
                <img src={mockUser.avatar} alt="User Avatar" className="w-9 h-9 rounded-full" />
              </a>
            </>
          ) : (
            <>
              <button onClick={toggleLogin} className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700">
                Login
              </button>
              <button onClick={toggleLogin} className="hidden md:block px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-green-700 text-white hover:bg-green-600">
                Sign Up
              </button>
            </>
          )}
          <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} title="Visualizer Easter Egg">
            <div className="w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform opacity-50 hover:opacity-100" />
          </a>
        </section>
      </div>
    </header>
  );
};

export default NavBar;
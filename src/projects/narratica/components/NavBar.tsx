import React, { useState } from 'react';
import homeIcon from '../assets/favicon.ico';
import { ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface NavBarProps {
  showLibrary: () => void;
  showVisualizer: () => void;
  showProfile: () => void;
  isLoggedIn: boolean;
  toggleLogin: () => void;
  userData: {
    username: string;
    profile_img: string;
  };
}

const NavBar: React.FC<NavBarProps> = ({
  showLibrary,
  showVisualizer,
  showProfile,
  isLoggedIn,
  toggleLogin,
  userData
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

  return (
    <header className="sticky top-0 z-20 p-2 px-3.5 bg-narratica-dark text-narratica-text-primary ...">
      <div className="flex justify-between items-center">
        {/* --- DESKTOP NAVBAR --- */}
        <div className="hidden md:flex flex-grow justify-between items-center gap-4">
          {/* Left Section */}
          <div className="flex gap-4 items-center">
            <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} title="Home" className="flex-shrink-0">
              <img src={homeIcon} alt="Home" style={{ width: 35, height: 35 }} />
            </a>
          </div>

          {/* Center Section */}
          <span className="text-lg font-bold">Narratica</span>

          {/* Right Section */}
          <section className="flex gap-4 items-center">
            {isLoggedIn ? (
              <>
                <button onClick={toggleLogin} title="Logout" className="px-3 py-2 rounded-full text-sm font-medium transition-all bg-narratica-gray-light text-narratica-text-primary hover:bg-narratica-gray-dark">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
                <a href="#" onClick={(e) => handleNavClick(e, showProfile)} title={`Profile: ${userData.username}`} className="flex-shrink-0">
                  <img src={userData.profile_img} alt="User Avatar" className="w-9 h-9 rounded-full object-cover" />
                </a>
              </>
            ) : (
              <>
                <button onClick={toggleLogin} className="px-4 py-2 rounded-full text-sm font-medium bg-narratica-gray-light text-narratica-text-primary hover:bg-narratica-gray-dark">
                  Login
                </button>
                <button onClick={toggleLogin} className="px-4 py-2 rounded-full text-sm font-medium bg-narratica-green text-narratica-text-primary hover:bg-narratica-green/80">
                  Sign Up
                </button>
              </>
            )}
            <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} title="Visualizer Easter Egg">
              <div className="w-3 h-3 bg-narratica-green rounded-full hover:scale-150 transition-transform opacity-50 hover:opacity-100" />
            </a>
          </section>
        </div>

        {/* --- MOBILE NAVBAR --- */}
        <div className="md:hidden flex justify-between items-center w-full">
          <a href="#" onClick={(e) => handleNavClick(e, showLibrary)} title="Home" className="flex-shrink-0">
            <img src={homeIcon} alt="Home" style={{ width: 35, height: 35 }} />
          </a>
          <span className="text-lg font-bold">Narratica</span>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => handleNavClick(e, showVisualizer)} title="Visualizer Easter Egg">
              <div className="w-3 h-3 bg-narratica-green rounded-full" />
            </a>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-30">
              {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-narratica-dark flex flex-col items-center justify-center gap-8 text-xl z-20 animate-slideup">
            {isLoggedIn ? (
              <>
                <a href="#" onClick={(e) => handleNavClick(e, showProfile)} className="bg-narratica-gray-light px-6 py-3 rounded-full font-medium">Profile</a>
                <button onClick={toggleLogin} className="bg-narratica-gray-light px-6 py-3 rounded-full font-medium">Logout</button>
              </>
            ) : (
              <>
                <button onClick={toggleLogin} className="bg-narratica-gray-light px-6 py-3 rounded-full font-medium">Login</button>
                <button onClick={toggleLogin} className="bg-narratica-green px-6 py-3 rounded-full font-medium">Sign Up</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
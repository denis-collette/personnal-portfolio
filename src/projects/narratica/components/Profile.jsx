import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const mockUser = {
  username: "DemoUser",
  email: "demo@narratica.app",
  first_name: "Alex",
  last_name: "River",
  date_joined: "2024-01-01T10:00:00Z",
  profile_img: "https://github.com/shadcn.png",
};

export default function Profile({ showLibrary, showBookDetail, favoriteBooks }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: mockUser.username,
    first_name: mockUser.first_name,
    last_name: mockUser.last_name,
  });
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [favoriteAuthors, setFavoriteAuthors] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    if (favoriteBooks && favoriteBooks.length > 0) {
      const authors = favoriteBooks.flatMap(book => book.authors.map(a => `${a.first_name} ${a.last_name}`));
      const uniqueAuthors = [...new Set(authors)];
      setFavoriteAuthors(uniqueAuthors);
    }
  }, [favoriteBooks]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfileChanges = () => {
    alert("Profile changes 'saved' successfully! (This is a mock interaction)");
    setEditMode(false);
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? (This is a mock interaction)")) {
      alert("Account 'deleted'. Returning to the library.");
      showLibrary();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-neutral-900 text-white h-full overflow-y-auto">
      <button onClick={showLibrary} className="flex items-center gap-2 mb-6 text-indigo-400 hover:text-indigo-300">
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Library
      </button>

      {/* User Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/5 p-6 rounded-lg shadow-xl">
        <img src={mockUser.profile_img} alt="Profile" className="rounded-full h-40 w-40 object-cover border-4 border-neutral-700" />
        <div className="space-y-4 flex-1 text-center md:text-left">
          {editMode ? (
            <>
              <input name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-neutral-800 text-white text-4xl font-bold p-2 rounded" />
              <input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First Name" className="w-full bg-neutral-800 text-white p-2 rounded" />
              <input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-neutral-800 text-white p-2 rounded" />
              <div className="flex gap-4 mt-4 justify-center md:justify-start">
                <button onClick={saveProfileChanges} className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">Save</button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold">{formData.username}</h1>
              <p className="text-gray-400">{mockUser.email}</p>
              <p>Name: {formData.first_name} {formData.last_name}</p>
              <p>Member since: {new Date(mockUser.date_joined).toLocaleDateString()}</p>
              <div className="flex gap-4 pt-2 justify-center md:justify-start">
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">Edit Profile</button>
                <button onClick={deleteAccount} className="px-4 py-2 bg-red-700 rounded hover:bg-red-600">Delete Account</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Your Favorites</h2>
        <h3 className="text-xl font-bold text-indigo-400 mb-3">Favorite Books (Top 5)</h3>

        {favoriteBooks && favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {favoriteBooks.slice(0, 5).map(book => (
              <button key={book.id} onClick={() => showBookDetail(book.id)} className="text-center group">
                <div className="aspect-square overflow-hidden rounded-md shadow-lg">
                  <img
                    src={book.display_image?.replace(/^http:/, 'https')}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-bold mt-2 text-sm truncate">{book.title}</p>
                <p className="text-xs text-gray-400 truncate">{book.authorName}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic mb-8">No books have been added to favorites yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Authors</h3>
            <ul className="list-disc list-inside space-y-1">
              {favoriteAuthors.map(name => <li key={name}>{name}</li>)}
            </ul>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Narrators</h3>
            <p className="text-sm text-gray-400 italic">The Narrator feature is not available in this LibriVox-based version of Narratica.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, CameraIcon } from '@heroicons/react/24/solid';

export default function Profile({ userData, onProfileUpdate, showLibrary, showBookDetail, favoriteBooks, onAuthorSearch }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userData);
  const fileInputRef = useRef(null);

  const [topAuthors, setTopAuthors] = useState([]);
  const [topNarrators, setTopNarrators] = useState([]);

  useEffect(() => {
    if (favoriteBooks && favoriteBooks.length > 0) {
      const calculateTopFive = (key) => {
        const items = favoriteBooks.flatMap(book =>
          (book[key] || []).map(item => `${item.first_name} ${item.last_name}`)
        ).filter(name => name.trim() !== '');

        const counts = items.reduce((acc, name) => {
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});

        return Object.entries(counts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .map(([name]) => name);
      };

      setTopAuthors(calculateTopFive('authors'));
      setTopNarrators(calculateTopFive('readers'));
    }
  }, [favoriteBooks]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    onProfileUpdate(formData);
    setEditMode(false);
  };

  const cancelEdit = () => {
    setFormData(userData);
    setEditMode(false);
  }

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
        <div className="relative group">
          <img src={formData.profile_img} alt="Profile" className="rounded-full h-40 w-40 ..." />
          {editMode && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CameraIcon className="h-10 w-10" />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-4 flex-1 text-center md:text-left">
          {editMode ? (
            <>
              <input name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-neutral-800 text-white text-4xl font-bold p-2 rounded" />
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-neutral-800 text-white text-4xl font-bold p-2 rounded" />
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
              <p className="text-gray-400">{formData.email}</p>
              <p>Name: {formData.first_name} {formData.last_name}</p>
              <p>Member since: {new Date(userData.date_joined).toLocaleDateString()}</p>
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
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Authors (Top 5)</h3>
            <ul className="space-y-1">
              {topAuthors.length > 0 ? topAuthors.map(name => (
                <li key={name}>
                  <button onClick={() => onAuthorSearch(name)} className="text-left hover:text-indigo-300 transition-colors">
                    {name}
                  </button>
                </li>
              )) : <p className="text-sm text-gray-400 italic">No favorite authors yet.</p>}
            </ul>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Narrators (Top 5)</h3>
            <ul className="space-y-1">
              {topNarrators.length > 0 ? topNarrators.map(name => (
                <li key={name}>{name}</li>
              )) : <p className="text-sm text-gray-400 italic">No favorite narrators yet.</p>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const mockUser = {
  username: "DemoUser",
  email: "demo@narratica.app",
  first_name: "Alex",
  last_name: "River",
  date_joined: "2024-10-09T10:00:00Z",
  profile_img: "https://github.com/shadcn.png",
};

const mockFavoriteBooks = [
  { id: '1948', title: 'The Adventures of Sherlock Holmes', authorName: 'Arthur Conan Doyle', url_image: 'https://archive.org/download/sherlock_holmes_2302_librivox/holmes_2302.jpg' },
  { id: '244', title: 'The Call of the Wild', authorName: 'Jack London', url_image: 'https://archive.org/download/call_wild_2208_librivox/callwild_2208.jpg' },
  { id: '1260', title: 'Dracula', authorName: 'Bram Stoker', url_image: 'https://archive.org/download/dracula_2303_librivox/dracula_2303.jpg' },
  { id: '158', title: 'Moby Dick', authorName: 'Herman Melville', url_image: 'https://archive.org/download/moby_dick_2201_librivox/mobydick_2201.jpg' }
];

const mockFavoriteAuthors = [{ id: 1, name: "Arthur Conan Doyle" }, { id: 2, name: "Jack London" }];
const mockFavoriteNarrators = [{ id: 1, name: "David Clarke" }, { id: 2, name: "John Greenman" }];

export default function Profile({ showLibrary }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: mockUser.username,
    first_name: mockUser.first_name,
    last_name: mockUser.last_name,
  });
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      const bookIds = ['1948', '244', '1260', '158'];

      const bookPromises = bookIds.map(id =>
        fetch('/api/librivox', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        }).then(res => res.json())
      );

      try {
        const results = await Promise.all(bookPromises);
        const booksWithAuthors = results.map(result => {
          const book = result.books[0];
          return {
            ...book,
            authorName: book.authors.map(a => `${a.first_name} ${a.last_name}`).join(', ')
          };
        });
        setFavoriteBooks(booksWithAuthors);
      } catch (error) {
        console.error("Failed to fetch favorite books for profile:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

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
      {/* Favorites Section */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Your Favorites</h2>
        <h3 className="text-xl font-bold text-indigo-400 mb-3">Favorite Books</h3>
        
        {isLoadingBooks ? (
          <p>Loading favorite books...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {favoriteBooks.map(book => (
              <div key={book.id} className="text-center">
                <img src={book.url_image_archive?.replace(/^http:/, 'https')} alt={book.title} className="aspect-square object-cover rounded-md shadow-lg" />
                <p className="font-bold mt-2 text-sm truncate">{book.title}</p>
                <p className="text-xs text-gray-400 truncate">{book.authorName}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Authors</h3>
            <ul className="list-disc list-inside space-y-1">{mockFavoriteAuthors.map(a => <li key={a.id}>{a.name}</li>)}</ul>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Favorite Narrators</h3>
            <ul className="list-disc list-inside space-y-1">{mockFavoriteNarrators.map(n => <li key={n.id}>{n.name}</li>)}</ul>
          </div>
        </div>
      </section>
    </div>
  );
}
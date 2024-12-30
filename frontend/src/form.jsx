import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from './components/navbar';

export default function AddSongForm() {
  const [formData, setFormData] = useState({
    name: '',
    spotifyLink: '',
    artists: '',
    album: '',
    lyrics: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const extractSpotifyID = (url) => {
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const spotifyID = extractSpotifyID(formData.spotifyLink);

    if (!spotifyID) {
      setError('Invalid Spotify link. Please provide a valid link.');
      setIsLoading(false);
      return;
    }

    const payload = {
      id: spotifyID,
      name: formData.name,
      album_name: formData.album,
      artists: formData.artists,
      lyrics: formData.lyrics,
      danceability: 0.63,
      energy: 0.6,
      key: 8,
      loudness: -6.3,
      mode: 1,
      speechiness: 0.04,
      acousticness: 0.27,
      instrumentalness: 0.0,
      liveness: 0.12,
      valence: 0.35,
      tempo: 120.0,
      duration_ms: 198000
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/add_document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add song. Please try again.');
      }

      console.log('Submitted data:', payload);
      setSuccess(true);
      setFormData({ name: '', spotifyLink: '', artists: '', album: '', lyrics: '' });
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black p-4 relative">
      <Navbar />
      <h1 className="text-4xl font-semibold mb-6 text-white mt-4" style={{ fontFamily: 'Zen Antique Soft, serif' }}>
        Add New Song
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Song Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="spotifyLink" className="block text-sm font-medium text-gray-300 mb-1">Spotify Link</label>
          <input
            type="url"
            id="spotifyLink"
            name="spotifyLink"
            value={formData.spotifyLink}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="artists" className="block text-sm font-medium text-gray-300 mb-1">Artists (separated by commas)</label>
          <input
            type="text"
            id="artists"
            name="artists"
            value={formData.artists}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="album" className="block text-sm font-medium text-gray-300 mb-1">Album</label>
          <input
            type="text"
            id="album"
            name="album"
            value={formData.album}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="lyrics" className="block text-sm font-medium text-gray-300 mb-1">Lyrics</label>
          <textarea
            id="lyrics"
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Song...' : 'Add Song'}
        </button>
      </form>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <DotLottieReact
            src="/assets/load.lottie"
            loop
            autoplay
            className="w-24 h-24"
          />
          <p className="ml-4 text-lg text-gray-300">Processing...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500 text-white rounded-lg">
          {error}
        </div>
      )}

{success && (
  <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-green-500 text-white rounded-lg shadow-lg z-50">
    Song added successfully!
  </div>
)}
  
    </div>
  );
}

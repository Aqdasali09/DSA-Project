import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from './components/navbar';

export default function AddSongForm() {
  const [formData, setFormData] = useState({
    name: '',
    spotifyLink: '',
    artists: '',
    album: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Submitted data:', formData);
      setSuccess(true);
      setFormData({ name: '', spotifyLink: '', artists: '', album: '' });
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black p-4 relative">
      <Navbar />
      <h1 className="text-4xl font-semibold mb-6 text-white mt-4" style={{ fontFamily: 'Zen Antique Soft, serif' }}>Add New Song</h1>
      
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

        <div className="mb-6">
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
        <div className="mt-4 p-3 bg-green-500 text-white rounded-lg">
          Song added successfully!
        </div>
      )}
    </div>
  );
}

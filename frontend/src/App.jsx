import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Search, Mic } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        setResults(data);
        setError(null);
      } else {
        setError(data.error);
        setResults(null);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setIsLoading(false);
      setError('An error occurred while fetching the data.');
      setResults(null);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-gray-100">
      <h1 className="text-5xl font-bold mb-8 text-white" style={{ fontFamily: 'Zen Antique Soft, serif' }}>Lyrica</h1>
      
      <div className="mb-6 w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter search query"
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-lg text-white placeholder-gray-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="flex mt-4 space-x-4">
          <button
            onClick={handleSearch}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <Link to="/audio-search" className="flex items-center justify-center px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            <Mic className="h-5 w-5 mr-2" />
            Audio Search
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center mt-8">
          <DotLottieReact
            src="/assets/load.lottie"
            loop
            autoplay
            className="w-24 h-24"
          />
          <p className="ml-4 text-lg text-gray-300">Processing...</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Results for "{results.query}":</h2>
          
          <h3 className="text-lg font-semibold text-blue-400">Final Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.final_results.map((result, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                <p>Song: {result.name}</p>
                <p>Artists: {result.artists}</p>
                <p>Album: {result.album_name}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-blue-400 mt-4">Ranked Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.ranked_results.map(([details, score], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                <p>Song: {details.name}</p>
                <p>Artists: {details.artists}</p>
                <p>Album: {details.album_name}</p>
                <p>Score: {score}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


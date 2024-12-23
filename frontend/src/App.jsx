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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-gray-100">
      <h1 className="text-5xl font-bold mb-8 text-blue-400">NeoSearch</h1>
      
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
            className="w-32 h-32"
          />
          <p className="ml-4 text-xl text-blue-300 animate-pulse">Processing your request...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-lg">{error}</p>
        </div>
      )}

      {results && (
        <div className="w-full max-w-6xl mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Results for "{results.query}"</h2>
          
          <div className="mb-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-700 px-6 py-4">
              <h3 className="text-xl text-blue-300">Final Results</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.final_results.map((result, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow">
                    <p className="text-gray-300">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-700 px-6 py-4">
              <h3 className="text-xl text-blue-300">Ranked Results</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.ranked_results.map(([doc_id, score], index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow">
                    <p className="text-gray-300 font-semibold">Document ID: {doc_id}</p>
                    <p className="text-gray-400">Score: {score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


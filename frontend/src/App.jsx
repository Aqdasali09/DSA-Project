import { useState } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-500">Search Engine</h1>
      
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="p-2 border border-gray-700 rounded w-full mb-2 bg-gray-800 text-white placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>

      <Link to="/audio-search" className="text-blue-500 underline mt-4">
        Search by Audio
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-12 w-12 animate-spin"></div>
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
                {result}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-blue-400 mt-4">Ranked Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.ranked_results.map(([doc_id, score], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300">
                <p>Document ID: {doc_id}</p>
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

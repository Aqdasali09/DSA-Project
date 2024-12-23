import { useState } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setError(null);
      } else {
        setError(data.error);
        setResults(null);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching the data.');
      setResults(null);
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Search Engine</h1>
      
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <button
          onClick={handleSearch}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      <Link to="/audio-search" className="text-blue-500 underline mt-4">
        Search by Audio
      </Link>

      {error && <p className="text-red-500">{error}</p>}

      {results && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Results for "{results.query}":</h2>
          
          <h3 className="text-lg font-semibold text-gray-800">Final Results:</h3>
          <ul className="list-disc pl-5">
            {results.final_results.map((result, index) => (
              <li key={index} className="text-gray-700">{result}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">Ranked Results:</h3>
          <ul className="list-disc pl-5">
            {results.ranked_results.map(([doc_id, score], index) => (
              <li key={index} className="text-gray-700">
                Document ID: {doc_id}, Score: {score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

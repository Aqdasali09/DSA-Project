import { useState } from 'react';
import './App.css';

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
    <div className="App">
      <h1>Search Engine</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && (
        <div>
          <h2>Results for "{results.query}":</h2>
          <h3>Final Results:</h3>
          <ul>
            {results.final_results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
          <h3>Ranked Results:</h3>
          <ul>
            {results.ranked_results.map(([doc_id, score], index) => (
              <li key={index}>
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

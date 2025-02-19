import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReciters } from '../../services/mp3QuranApi';

const ReciterList = () => {
  const [reciters, setReciters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReciters = async () => {
      try {
        const data = await fetchReciters();
        const sortedReciters = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setReciters(sortedReciters);
      } catch (error) {
        console.error('Error loading reciters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReciters();
  }, []);

  const filteredReciters = reciters.filter(reciter =>
    reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="ios-card">Loading reciters...</div>;
  }

  return (
    <div>
      <div className="search-bar">
        <svg 
          className="search-icon" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="search"
          placeholder="Search reciters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="divide-y">
        {filteredReciters.map((reciter) => (
          <Link
            key={reciter.id}
            to={`/reciter/${reciter.id}`}
            className="ios-list-item"
          >
            <div>
              <h3 className="font-semibold">{reciter.name.split('(')[0].trim()}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReciterList;

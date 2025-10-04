import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { WeatherService } from '../services/weatherService';

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string; country: string }) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const result = await WeatherService.geocodeLocation(query);
      if (result) {
        onLocationSelect(result);
        setQuery('');
      } else {
        setError('Location not found. Please try a different search.');
      }
    } catch (err) {
      setError('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name or coordinates (e.g., 'Paris' or '48.8566, 2.3522')"
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}

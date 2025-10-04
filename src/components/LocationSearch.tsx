import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { WeatherService } from '../services/weatherService';

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string; country: string }) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ lat: number; lon: number; name: string; country: string; region?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await WeatherService.searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

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
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        setError('Location not found. Try coordinates like "23.4162, 25.6628" for remote areas.');
      }
    } catch (err) {
      setError('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (location: { lat: number; lon: number; name: string; country: string }) => {
    onLocationSelect(location);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
  };

  return (
    <div className="w-full" ref={suggestionsRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter city, region, landmark, or coordinates (e.g., 'Sahara Desert' or '23.4162, 25.6628')"
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isSearching}
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {suggestion.region && suggestion.region !== suggestion.name
                      ? `${suggestion.region}, ${suggestion.country}`
                      : suggestion.country}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
      {error && (
        <div className="mt-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      <div className="mt-3 text-xs text-slate-500">
        <p><span className="font-semibold">Examples:</span> Sahara Desert, Mount Everest, Antarctica, 25.2744, 133.7751 (Australian Outback)</p>
      </div>
    </div>
  );
}

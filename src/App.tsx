import { useState } from 'react';
import { Cloud, Settings as SettingsIcon, Info } from 'lucide-react';
import { LocationSearch } from './components/LocationSearch';
import { DateRangePicker } from './components/DateRangePicker';
import { RiskDashboard } from './components/RiskDashboard';
import { ThresholdSettings } from './components/ThresholdSettings';
import { WeatherService } from './services/weatherService';
import { RiskCalculator, RiskAnalysis } from './services/riskCalculator';
import { RiskThresholds } from './lib/supabase';

function App() {
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string; country: string } | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [thresholds, setThresholds] = useState<RiskThresholds>({
    temp_very_hot: 35,
    temp_very_cold: 0,
    wind_speed_high: 15,
    precipitation_high: 20,
    humidity_uncomfortable: 80,
    feels_like_hot: 40,
    feels_like_cold: -5
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleLocationSelect = async (selectedLocation: { lat: number; lon: number; name: string; country: string }) => {
    setLocation(selectedLocation);
    setError('');
    await analyzeRisk(selectedLocation, startDate, endDate);
  };

  const analyzeRisk = async (
    loc: { lat: number; lon: number; name: string; country: string },
    start: string,
    end: string
  ) => {
    if (!loc || !start || !end) return;

    setIsLoading(true);
    setError('');

    try {
      const forecast = await WeatherService.getForecast(loc.lat, loc.lon, start, end);
      const analysis = RiskCalculator.calculateRisk(forecast, thresholds);
      setRiskAnalysis(analysis);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (newStartDate?: string, newEndDate?: string) => {
    const start = newStartDate || startDate;
    const end = newEndDate || endDate;

    if (newStartDate) setStartDate(newStartDate);
    if (newEndDate) setEndDate(newEndDate);

    if (location && start && end) {
      await analyzeRisk(location, start, end);
    }
  };

  const handleThresholdSave = async (newThresholds: RiskThresholds) => {
    setThresholds(newThresholds);
    if (location && startDate && endDate) {
      await analyzeRisk(location, startDate, endDate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">
                  Weather Risk Predictor
                </h1>
                <p className="text-slate-600 text-lg mt-1">
                  Plan your outdoor activities with confidence
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <SettingsIcon className="w-5 h-5" />
              Settings
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">How it works</p>
              <p>Search for your destination, select your event dates, and get a personalized risk assessment based on weather forecasts. Customize thresholds to match your comfort levels.</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Plan Your Event</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Event Location
              </label>
              <LocationSearch onLocationSelect={handleLocationSelect} />
              {location && (
                <div className="mt-3 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">
                  Selected: <span className="font-semibold">{location.name}, {location.country}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Event Date Range
              </label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => handleDateChange(date, undefined)}
                onEndDateChange={(date) => handleDateChange(undefined, date)}
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-slate-600 font-medium">Analyzing weather conditions...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        {riskAnalysis && location && !isLoading && (
          <RiskDashboard
            analysis={riskAnalysis}
            locationName={`${location.name}, ${location.country}`}
          />
        )}

        {!location && !isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <Cloud className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              Start Your Risk Assessment
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter a location and date range above to get a detailed weather risk analysis for your outdoor event
            </p>
          </div>
        )}
      </div>

      <ThresholdSettings
        thresholds={thresholds}
        onSave={handleThresholdSave}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <footer className="max-w-7xl mx-auto px-4 py-8 mt-16 border-t border-slate-200">
        <div className="text-center text-slate-600 text-sm">
          <p className="mb-2">Weather data provided by Open-Meteo API</p>
          <p>Built for outdoor enthusiasts who take weather seriously</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

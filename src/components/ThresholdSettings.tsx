import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { RiskThresholds } from '../lib/supabase';

interface ThresholdSettingsProps {
  thresholds: RiskThresholds;
  onSave: (thresholds: RiskThresholds) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ThresholdSettings({ thresholds, onSave, isOpen, onClose }: ThresholdSettingsProps) {
  const [localThresholds, setLocalThresholds] = useState<RiskThresholds>(thresholds);

  const handleSave = () => {
    onSave(localThresholds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Risk Thresholds</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-slate-600 mt-2">Customize your personal comfort thresholds</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Very Hot Temperature (°C)
              </label>
              <input
                type="number"
                value={localThresholds.temp_very_hot}
                onChange={(e) => setLocalThresholds({ ...localThresholds, temp_very_hot: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Temperature considered uncomfortably hot</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Very Cold Temperature (°C)
              </label>
              <input
                type="number"
                value={localThresholds.temp_very_cold}
                onChange={(e) => setLocalThresholds({ ...localThresholds, temp_very_cold: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Temperature considered uncomfortably cold</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                High Wind Speed (m/s)
              </label>
              <input
                type="number"
                value={localThresholds.wind_speed_high}
                onChange={(e) => setLocalThresholds({ ...localThresholds, wind_speed_high: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Wind speed considered very windy</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                High Precipitation (mm)
              </label>
              <input
                type="number"
                value={localThresholds.precipitation_high}
                onChange={(e) => setLocalThresholds({ ...localThresholds, precipitation_high: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Total precipitation considered very wet</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Uncomfortable Humidity (%)
              </label>
              <input
                type="number"
                value={localThresholds.humidity_uncomfortable}
                onChange={(e) => setLocalThresholds({ ...localThresholds, humidity_uncomfortable: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Humidity level considered uncomfortable</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Feels Like Hot (°C)
              </label>
              <input
                type="number"
                value={localThresholds.feels_like_hot}
                onChange={(e) => setLocalThresholds({ ...localThresholds, feels_like_hot: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Feels-like temperature threshold for hot</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Feels Like Cold (°C)
              </label>
              <input
                type="number"
                value={localThresholds.feels_like_cold}
                onChange={(e) => setLocalThresholds({ ...localThresholds, feels_like_cold: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Feels-like temperature threshold for cold</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Thresholds
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

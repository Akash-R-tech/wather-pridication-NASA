import { AlertTriangle, Thermometer, Wind, CloudRain, Droplets, ThermometerSun } from 'lucide-react';
import { RiskLevel } from '../services/riskCalculator';

interface RiskCardProps {
  title: string;
  risk: RiskLevel;
  value: string;
  icon: 'hot' | 'cold' | 'wind' | 'rain' | 'humidity';
  description: string;
}

export function RiskCard({ title, risk, value, icon, description }: RiskCardProps) {
  const icons = {
    hot: ThermometerSun,
    cold: Thermometer,
    wind: Wind,
    rain: CloudRain,
    humidity: Droplets
  };

  const Icon = icons[icon];

  const riskConfig = {
    low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Low Risk' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Medium Risk' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'High Risk' },
    severe: { bg: 'bg-red-900', border: 'border-red-900', text: 'text-white', label: 'Severe Risk' }
  };

  const config = riskConfig[risk];

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-xl p-6 transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${config.text} p-3 rounded-lg ${risk === 'severe' ? 'bg-red-800' : 'bg-white'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${config.text}`}>{title}</h3>
            <p className={`text-sm ${config.text} opacity-80`}>{config.label}</p>
          </div>
        </div>
        {risk !== 'low' && (
          <AlertTriangle className={`w-5 h-5 ${config.text}`} />
        )}
      </div>
      <div className={`text-3xl font-bold ${config.text} mb-2`}>
        {value}
      </div>
      <p className={`text-sm ${config.text} opacity-90`}>
        {description}
      </p>
    </div>
  );
}

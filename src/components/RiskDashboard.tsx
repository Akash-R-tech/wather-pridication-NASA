import { RiskAnalysis } from '../services/riskCalculator';
import { RiskCard } from './RiskCard';
import { TrendingUp, Activity } from 'lucide-react';

interface RiskDashboardProps {
  analysis: RiskAnalysis;
  locationName: string;
}

export function RiskDashboard({ analysis, locationName }: RiskDashboardProps) {
  const overallRiskLevel =
    analysis.overallRiskScore >= 75 ? 'severe' :
    analysis.overallRiskScore >= 50 ? 'high' :
    analysis.overallRiskScore >= 25 ? 'medium' : 'low';

  const overallRiskColor =
    overallRiskLevel === 'severe' ? 'text-red-900' :
    overallRiskLevel === 'high' ? 'text-red-600' :
    overallRiskLevel === 'medium' ? 'text-amber-600' : 'text-emerald-600';

  const overallRiskBg =
    overallRiskLevel === 'severe' ? 'bg-red-900' :
    overallRiskLevel === 'high' ? 'bg-red-100' :
    overallRiskLevel === 'medium' ? 'bg-amber-100' : 'bg-emerald-100';

  return (
    <div className="space-y-6">
      <div className={`${overallRiskBg} rounded-2xl p-8 border-2 ${overallRiskLevel === 'severe' ? 'border-red-900 text-white' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${overallRiskLevel === 'severe' ? 'text-white' : overallRiskColor}`}>
              Overall Risk Assessment
            </h2>
            <p className={`text-lg ${overallRiskLevel === 'severe' ? 'text-red-100' : 'text-slate-600'}`}>
              {locationName}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${overallRiskLevel === 'severe' ? 'text-white' : overallRiskColor}`}>
              {analysis.overallRiskScore}
            </div>
            <p className={`text-sm ${overallRiskLevel === 'severe' ? 'text-red-100' : 'text-slate-600'}`}>Risk Score</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 ${overallRiskLevel === 'severe' ? 'text-red-100' : 'text-slate-700'}`}>
            <Activity className="w-5 h-5" />
            <span className="font-semibold">Confidence: {analysis.confidenceLevel}%</span>
          </div>
          <div className={`flex items-center gap-2 ${overallRiskLevel === 'severe' ? 'text-red-100' : 'text-slate-700'}`}>
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Based on weather forecast data</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RiskCard
          title="Very Hot"
          risk={analysis.riskVeryHot}
          value={`${analysis.details.temperature.max.toFixed(1)}°C`}
          icon="hot"
          description={`Maximum temperature expected. Average: ${analysis.details.temperature.avg.toFixed(1)}°C`}
        />
        <RiskCard
          title="Very Cold"
          risk={analysis.riskVeryCold}
          value={`${analysis.details.temperature.min.toFixed(1)}°C`}
          icon="cold"
          description={`Minimum temperature expected. Prepare accordingly.`}
        />
        <RiskCard
          title="Very Windy"
          risk={analysis.riskVeryWindy}
          value={`${analysis.details.wind.max.toFixed(1)} m/s`}
          icon="wind"
          description={`Maximum wind speed expected. Secure loose items.`}
        />
        <RiskCard
          title="Very Wet"
          risk={analysis.riskVeryWet}
          value={`${analysis.details.precipitation.total.toFixed(1)} mm`}
          icon="rain"
          description={`Total precipitation expected. Bring rain gear.`}
        />
        <RiskCard
          title="Uncomfortable"
          risk={analysis.riskUncomfortable}
          value={`${analysis.details.humidity.avg.toFixed(0)}%`}
          icon="humidity"
          description={`Average humidity. Feels like ${analysis.details.feelsLike.max.toFixed(1)}°C max.`}
        />
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-blue-900 mb-4">Weather Summary</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><span className="font-semibold">Temperature Range:</span> {analysis.details.temperature.min.toFixed(1)}°C to {analysis.details.temperature.max.toFixed(1)}°C</p>
            <p><span className="font-semibold">Feels Like:</span> {analysis.details.feelsLike.min.toFixed(1)}°C to {analysis.details.feelsLike.max.toFixed(1)}°C</p>
            <p><span className="font-semibold">Confidence Level:</span> {analysis.confidenceLevel}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

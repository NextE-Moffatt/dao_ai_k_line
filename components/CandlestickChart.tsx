import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line
} from 'recharts';
import { KLinePoint } from '../types';

interface Props {
  data: KLinePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint;
    const isGood = data.close >= data.open;
    return (
      <div className="bg-slate-800 border border-slate-600 p-3 rounded shadow-xl text-xs">
        <p className="font-bold text-amber-500 mb-1">{data.year}年 ({data.age}岁)</p>
        <p className="text-slate-300 italic mb-2">{data.summary}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
          <span>起运: {data.open}</span>
          <span>结运: {data.close}</span>
          <span className="text-green-400">极盛: {data.high}</span>
          <span className="text-red-400">低谷: {data.low}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Prepare data for Recharts <Bar> which usually takes [min, max]
const prepareChartData = (data: KLinePoint[]) => {
  return data.map(d => ({
    ...d,
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    trend: (d.open + d.close + d.high + d.low) / 4 // Simple Moving Average for trend line
  }));
};

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const processedData = prepareChartData(data);

  return (
    <div className="w-full h-[400px] bg-slate-900/50 rounded-lg p-4 border border-slate-700 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex justify-center items-center">
             <div className="w-64 h-64 border-4 border-amber-900 rounded-full"></div>
             <div className="absolute w-48 h-48 border-2 border-amber-900 rounded-full"></div>
        </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={processedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="age" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }} 
            tickFormatter={(val) => `${val}岁`}
          />
          <YAxis 
            stroke="#94a3b8" 
            domain={[0, 100]} 
            tick={{ fontSize: 12 }}
            label={{ value: '运势指数', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* High/Low Whiskers (Simulated with thin bars behind or ErrorBars - using Line here for trend) */}
           <Line 
            type="monotone" 
            dataKey="trend" 
            stroke="#6366f1" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 6 }}
            opacity={0.5}
          />

          {/* Candle Body */}
          <Bar dataKey="body" barSize={12}>
            {
              processedData.map((entry, index) => {
                 const isRising = entry.close >= entry.open;
                 // Amber for rising luck, Slate/Blue for declining
                 return <Cell key={`cell-${index}`} fill={isRising ? '#f59e0b' : '#3b82f6'} strokeWidth={0} />;
              })
            }
          </Bar>
          
          {/* Whiskers (High/Low) - Visualized as a faint Area range behind could be nice, or just rely on tooltip */}
          {/* To properly do whiskers in Recharts without custom shape complexity is hard, so we use Area to show the 'Potential Range' */}
          <Line dataKey="high" stroke="transparent" dot={false} /> {/* Hidden for scale */}
          <Line dataKey="low" stroke="transparent" dot={false} /> {/* Hidden for scale */}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
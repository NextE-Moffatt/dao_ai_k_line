import React from 'react';
import { AnalysisResult } from '../types';
import CandlestickChart from './CandlestickChart';
import { Compass, Sparkles, Scroll, Eye } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<Props> = ({ result, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Summary */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
          天命揭秘
        </h2>
        <p className="text-slate-300 italic max-w-2xl mx-auto leading-relaxed border-l-2 border-amber-800 pl-4 bg-slate-800/30 py-2 rounded-r font-serif">
          "{result.overallDestiny}"
        </p>
      </div>

      {/* The Chart */}
      <div className="bg-slate-800/40 p-1 rounded-xl border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 mb-2">
            <h3 className="font-bold text-amber-500 flex items-center gap-2">
                <Sparkles size={16} /> 人生 K 线 (运势指数)
            </h3>
            <span className="text-xs text-slate-500">0 岁 - 80+ 岁</span>
        </div>
        <CandlestickChart data={result.chartData} />
      </div>

      {/* Detailed Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Ba Zi & Zi Wei */}
        <div className="bg-slate-900/60 p-6 rounded-lg border border-slate-800 hover:border-amber-900/50 transition-colors">
            <h4 className="flex items-center gap-2 text-lg font-serif text-purple-400 mb-4">
                <Compass size={20} /> 命理乾坤 (八字与紫微)
            </h4>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">四柱八字分析</span>
                    <p className="mt-1">{result.systemBreakdown.bazi}</p>
                </div>
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">紫微斗数格局</span>
                    <p className="mt-1">{result.systemBreakdown.ziwei}</p>
                </div>
            </div>
        </div>

        {/* Feng Shui & Qimen */}
        <div className="bg-slate-900/60 p-6 rounded-lg border border-slate-800 hover:border-amber-900/50 transition-colors">
            <h4 className="flex items-center gap-2 text-lg font-serif text-emerald-400 mb-4">
                <Scroll size={20} /> 运筹帷幄 (风水与奇门)
            </h4>
             <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">风水改运建议</span>
                    <p className="mt-1">{result.systemBreakdown.fengshuiAdvice}</p>
                </div>
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">奇门遁甲指引</span>
                    <p className="mt-1">{result.systemBreakdown.qimen}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Physiognomy Section (Conditional) */}
      {result.systemBreakdown.physiognomy && (
        <div className="bg-slate-900/60 p-6 rounded-lg border border-slate-800 hover:border-amber-900/50 transition-colors">
             <h4 className="flex items-center gap-2 text-lg font-serif text-amber-400 mb-4">
                <Eye size={20} /> 相术玄机 (面相/手相)
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
                {result.systemBreakdown.physiognomy}
            </p>
        </div>
      )}

      {/* Final Advice */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-amber-900/30 shadow-lg">
        <h4 className="text-center font-serif text-xl text-amber-500 mb-4">大师箴言</h4>
        <p className="text-center text-slate-300 leading-relaxed">
            {result.advice}
        </p>
      </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={onReset}
            className="px-8 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-white rounded-full transition-all text-sm tracking-widest"
        >
            重新测算
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
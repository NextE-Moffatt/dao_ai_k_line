import React, { useState } from 'react';
import { AppState, UserProfile, AnalysisResult } from './types';
import InputForm from './components/InputForm';
import AnalysisView from './components/AnalysisView';
import { analyzeDestiny } from './services/geminiService';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFormSubmit = async (profile: UserProfile) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg('');
    try {
      const data = await analyzeDestiny(profile);
      setResult(data);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("与天地的连接受到干扰，请稍后重试。" + (err.message || ''));
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAppState(AppState.INPUT);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-900 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-amber-900/20 rounded-full flex items-center justify-center border border-amber-800/50 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="text-amber-500" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-600 tracking-tight text-center">
            道AI · 人生 K 线
          </h1>
          <p className="mt-3 text-slate-500 text-sm tracking-widest uppercase text-center max-w-md">
             AI 驱动的命理运势推演系统
          </p>
        </header>

        <main className="w-full">
          {appState === AppState.INPUT && (
            <div className="animate-fade-in-up">
              <InputForm onSubmit={handleFormSubmit} isLoading={false} />
            </div>
          )}

          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="w-24 h-24 border-4 border-t-amber-500 border-r-transparent border-b-amber-700 border-l-transparent rounded-full animate-spin mb-8"></div>
               <p className="text-xl font-serif text-amber-500">正在推演天机...</p>
               <p className="text-slate-500 text-sm mt-2">排列八字命盘 | 计算紫微星位 | 分析五行生克</p>
            </div>
          )}

          {appState === AppState.RESULT && result && (
            <AnalysisView result={result} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
             <div className="max-w-md mx-auto text-center p-8 bg-red-900/10 border border-red-900/50 rounded-lg">
                <p className="text-red-400 mb-4">{errorMsg}</p>
                <button 
                  onClick={() => setAppState(AppState.INPUT)}
                  className="text-slate-300 hover:text-white underline underline-offset-4"
                >
                  返回重新输入
                </button>
             </div>
          )}
        </main>

        <footer className="mt-20 text-center text-xs text-slate-600 border-t border-slate-900 pt-8">
          <p>
            本应用基于人工智能模拟中国传统命理学原理，结果仅供娱乐与参考。
            <br />
            天行健，君子以自强不息。命运掌握在自己手中。
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
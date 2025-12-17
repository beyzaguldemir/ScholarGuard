import React, { useState, useEffect } from 'react';
import { GraduationCap, ShieldCheck, Info } from 'lucide-react';
import InputArea from './components/InputArea';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AnalysisResult } from './types';
import { analyzeManuscript } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);

  const academicTips = [
    "Gemini, metodoloji bölümündeki mantıksal tutarlılığı kontrol ediyor...",
    "Akademik üslup ve resmiyet düzeyi taranıyor...",
    "Desk Rejection riskleri dergi standartlarına göre simüle ediliyor...",
    "Veri setleriniz tablo ve grafik potansiyeli açısından inceleniyor...",
    "Giriş ve sonuç bölümleri arasındaki argüman bağı test ediliyor...",
    "Atıf formatları ve genel yazım kuralları doğrulanıyor..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % academicTips.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async (text: string, html?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeManuscript(text);
      // Word'den gelen HTML içeriğini sonuca ekle
      setResult({ ...data, htmlContent: html });
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında beklenmedik bir hata oluştu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return <AnalysisDashboard result={result} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      {/* Decorative BG Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 z-[60]"></div>
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-slate-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-tight tracking-tight text-slate-900">ScholarGuard</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-500">Academic Review AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Güvenli Analiz Modu</span>
             </div>
             <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">v2.1 Stable</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
              <Info className="w-3 h-3" /> Akademik Dürüstlük Odaklı İnceleme
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Makalenizi Göndermeden Önce <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">AI Hakem Gözüyle</span> İnceleyin
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Word dosyalarınızı yükleyin; dil, üslup ve desk rejection risklerini saniyeler içinde profesyonel bir editör gibi raporlayalım.
            </p>
        </div>

        {/* Error Display */}
        {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p><span className="font-bold">Analiz Hatası:</span> {error}</p>
            </div>
        )}

        <InputArea onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Gözden Geçir Modu", desc: "Metninizi değiştirmeden sadece yan sütuna yorumlar ekleyerek akademik etik kuralları korur." },
             { title: "Word Entegrasyonu", desc: "Word dosyalarınızı orijinal formatında işleyerek tam sayfa doküman üzerinde inceleme imkanı sunar." },
             { title: "Veri Görselleştirme", desc: "Metindeki ham verileri otomatik algılar ve yayın kalitesinde grafik/tablo önerileri üretir." }
           ].map((feat, i) => (
             <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all group">
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{feat.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
             </div>
           ))}
        </div>

        {/* Loading Overlay */}
        {isAnalyzing && (
            <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-8">
                <div className="relative mb-12">
                   <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-indigo-600" />
                   </div>
                </div>
                <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Kapsamlı İnceleme Başlatıldı</h3>
                  <div className="h-12 flex items-center justify-center">
                    <p className="text-indigo-600 font-bold text-sm tracking-wide transition-all duration-300">
                        {academicTips[loadingTipIndex]}
                    </p>
                  </div>
                  <div className="mt-12 flex justify-center gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((dot) => (
                      <div 
                        key={dot} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${dot === loadingTipIndex ? 'bg-indigo-600 w-6' : 'bg-slate-200'}`}
                      ></div>
                    ))}
                  </div>
                </div>
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 ScholarGuard Academic Tools</p>
         <div className="flex gap-8">
           <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Etik İlkeler</a>
           <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Veri Güvenliği</a>
           <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">İletişim</a>
         </div>
      </footer>
    </div>
  );
};

export default App;
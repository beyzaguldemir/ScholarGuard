import React, { useState } from 'react';
import { AnalysisResult, RiskLevel, ReviewComment, VisualSuggestion } from '../types';
import { 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  Printer,
  X,
  ShieldAlert,
  BarChart,
  Table as TableIcon,
  Download,
  BookOpen
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'visuals' | 'risks' | 'checklist'>('comments');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  const categories = [
    { id: 'all', label: 'Hepsi', color: 'bg-slate-100 text-slate-700' },
    { id: 'Language', label: 'Dil', color: 'bg-blue-100 text-blue-700' },
    { id: 'Style', label: 'Üslup', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'Structure', label: 'Yapı', color: 'bg-purple-100 text-purple-700' },
    { id: 'Format', label: 'Format', color: 'bg-teal-100 text-teal-700' },
    { id: 'Risk', label: 'Risk', color: 'bg-red-100 text-red-700' },
  ];

  const filteredComments = activeCategory === 'all' 
    ? result.comments 
    : result.comments.filter(c => c.category === activeCategory);

  const translateRisk = (level: string) => {
    const map: any = { 'Low': 'Düşük', 'Medium': 'Orta', 'High': 'Yüksek', 'Critical': 'Kritik' };
    return map[level] || level;
  };

  const renderChart = (suggestion: VisualSuggestion) => {
    if (!suggestion.chartData || suggestion.chartData.length === 0) return null;
    const chartData = suggestion.chartData.map(d => ({ name: d.label, value: d.value }));
    const type = suggestion.config?.chartType || 'bar';
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className="h-64 w-full mt-4 bg-white p-2 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <ReBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 9}} />
              <YAxis tick={{fontSize: 9}} />
              <Tooltip contentStyle={{fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          ) : type === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 9}} />
              <YAxis tick={{fontSize: 9}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{r: 4}} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTable = (suggestion: VisualSuggestion) => {
    if (!suggestion.tableData) return null;
    const { headers, rows } = suggestion.tableData;
    return (
      <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-slate-600">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              ScholarGuard <span className="text-slate-400 font-normal">|</span> İnceleme Paneli
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{width: `${result.overallScore}%`}}></div>
                 </div>
                 <span className="text-[10px] font-bold text-indigo-600">%{result.overallScore} HAZIRLIK</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" /> Yazdır
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            YENİ ANALİZ
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Document Viewer (Left) */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-200/40 print:p-0 print:bg-white">
          <div className="max-w-3xl mx-auto bg-white shadow-2xl min-h-[11in] p-16 sm:p-24 rounded-sm border border-slate-300 ring-1 ring-slate-900/5 print:shadow-none print:border-none">
            {result.htmlContent ? (
              <div 
                className="prose prose-slate max-w-none text-slate-800 font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result.htmlContent }}
              />
            ) : (
              <div className="prose prose-slate max-w-none font-serif">
                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed text-lg">
                  {result.manuscriptText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Sidebar (Right) */}
        <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-2xl print:hidden">
          <div className="flex bg-slate-50/50 p-1 m-4 rounded-xl border border-slate-200">
            {[
              { id: 'comments', icon: MessageSquare, label: 'Yorumlar' },
              { id: 'visuals', icon: BarChart, label: 'Görseller' },
              { id: 'risks', icon: ShieldAlert, label: 'Riskler' },
              { id: 'checklist', icon: CheckSquare, label: 'Checklist' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 text-[11px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            {/* Summary Banner */}
            <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Baş Editör Özeti</h3>
              <p className="text-sm font-medium leading-relaxed italic">"{result.summary}"</p>
            </div>

            {/* Content per Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        activeCategory === cat.id ? `${cat.color} ring-1 ring-current` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {filteredComments.map((comment, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-indigo-500 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                        {comment.category} • {comment.severity}
                      </span>
                      <span className="text-[10px] bg-slate-50 text-slate-300 px-1.5 py-0.5 rounded font-mono">#{idx+1}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg mb-3 text-[11px] text-slate-500 italic border-slate-100 border">
                      "...{comment.snippet.substring(0, 100)}..."
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{comment.issue}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{comment.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {result.visualSuggestions.length === 0 ? (
                  <div className="text-center py-20 opacity-30">
                     <BarChart className="w-12 h-12 mx-auto mb-4" />
                     <p className="text-sm font-bold uppercase tracking-widest">Görsel Öneri Yok</p>
                  </div>
                ) : (
                  result.visualSuggestions.map((viz, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        {viz.type === 'Chart' ? <BarChart className="w-4 h-4 text-indigo-600" /> : <TableIcon className="w-4 h-4 text-indigo-600" />}
                        <h4 className="text-sm font-bold text-slate-900">{viz.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{viz.description}</p>
                      {viz.type === 'Chart' ? renderChart(viz) : renderTable(viz)}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {result.deskRejectionRisks.map((risk, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-100 p-5 rounded-2xl flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-red-900">{risk.risk}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-600 text-white rounded-full font-bold uppercase">{translateRisk(risk.level)}</span>
                      </div>
                      <p className="text-xs text-red-700/80 font-medium">Mitigasyon: {risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                {result.checklist.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      item.status === 'Passed' ? 'bg-green-500 border-green-500 text-white' : 
                      item.status === 'Failed' ? 'bg-red-50 border-red-200 text-red-500' : 
                      'border-slate-200'
                    }`}>
                      {item.status === 'Passed' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      {item.status === 'Failed' && <X className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5">{item.task}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/30">
            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
              Analiz Sonu: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
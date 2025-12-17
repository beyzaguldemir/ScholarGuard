import React, { useState, useRef } from 'react';
import { Upload, FileText, FileSearch, CheckCircle2 } from 'lucide-react';
import mammoth from 'mammoth';

interface InputAreaProps {
  onAnalyze: (text: string, html?: string) => void;
  isAnalyzing: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [htmlContent, setHtmlContent] = useState<string | undefined>(undefined);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFileName(file.name);
    const reader = new FileReader();

    try {
      if (file.name.toLowerCase().endsWith('.docx')) {
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          try {
            // AI analizi için ham metin
            const textResult = await mammoth.extractRawText({ arrayBuffer });
            // Dashboard görünümü için HTML
            const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
            
            setText(textResult.value);
            setHtmlContent(htmlResult.value);
            setIsProcessingFile(false);
          } catch (err) {
            console.error("Word file processing error:", err);
            alert("Word dosyası işlenirken bir hata oluştu.");
            setIsProcessingFile(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
          setHtmlContent(undefined);
          setIsProcessingFile(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("File upload error:", error);
      setIsProcessingFile(false);
    }
  };

  const handleClear = () => {
    setText('');
    setHtmlContent(undefined);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Manuscript Dosyası
        </h2>
        <div className="flex items-center gap-3">
          {fileName && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100">
              <CheckCircle2 className="w-3 h-3" />
              {fileName}
            </div>
          )}
          <span className="text-sm text-slate-500 font-medium">{wordCount} kelime</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors font-medium border border-indigo-100"
            disabled={isAnalyzing || isProcessingFile}
          >
            {isProcessingFile ? (
              <span className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isProcessingFile ? 'Okunuyor...' : 'Word (.docx) Yükle'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".docx,.txt,.md"
            className="hidden"
          />
          {text && (
            <button
              onClick={handleClear}
              className="text-sm px-3 py-1.5 text-slate-400 hover:text-red-600 transition-colors"
              disabled={isAnalyzing || isProcessingFile}
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Makalenizi buraya yapıştırın veya üstteki butondan bir Word (.docx) dosyası yükleyin..."
          className="w-full h-80 p-5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-sans text-sm leading-relaxed resize-none transition-all"
          disabled={isAnalyzing || isProcessingFile}
        />
        {isProcessingFile && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl transition-all">
             <div className="flex flex-col items-center gap-3 px-6 py-4 bg-white shadow-xl border border-slate-100 rounded-2xl animate-in zoom-in-95 duration-200">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-800 block">Dosya İşleniyor</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Word to Text</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> HIPAA Uyumlu</div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Şifreli İletişim</div>
        </div>
        <button
          onClick={() => onAnalyze(text, htmlContent)}
          disabled={!text.trim() || isAnalyzing || isProcessingFile}
          className={`
            w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg
            ${!text.trim() || isAnalyzing || isProcessingFile
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95'}
          `}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ANALİZ BAŞLATILDI
            </span>
          ) : (
            'İNCELEMEYİ BAŞLAT'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;
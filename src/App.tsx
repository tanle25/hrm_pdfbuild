import { useState, useEffect } from 'react';
import { INITIAL_DATA, ProfileData, Language } from './types';
import ProfileForm from './components/ProfileForm';
import ProfilePreview from './components/ProfilePreview';
import { Printer, Edit3, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './translations';

export default function App() {
  const [data, setData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('profileData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [selectedLang, setSelectedLang] = useState<Language>('vi');

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(data));
  }, [data]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-red-100 selection:text-red-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-200">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">{translations[selectedLang].navTitle}</h2>
              <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">{translations[selectedLang].navSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedLang('vi')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedLang === 'vi' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="text-lg">🇻🇳</span> <span className="hidden sm:inline">Tiếng Việt</span>
              </button>
              <button
                onClick={() => setSelectedLang('zh')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedLang === 'zh' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="text-lg">🇨🇳</span> <span className="hidden sm:inline">简体中文</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'edit' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">{translations[selectedLang].edit}</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'preview' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{translations[selectedLang].preview}</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl shadow-xl shadow-gray-200 hover:bg-black transition-all font-bold text-sm active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{translations[selectedLang].exportPdf} ({selectedLang.toUpperCase()})</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-2 print:hidden text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {translations[selectedLang].printHint}
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-[calc(100vh-80px)] print:p-0 print:max-w-none print:m-0">
        <AnimatePresence mode="wait">
          {viewMode === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="print:hidden"
            >
              <ProfileForm data={data} onChange={setData} lang={selectedLang} />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex justify-center"
            >
              <div className="bg-white p-4 md:p-8 rounded-3xl shadow-2xl border border-gray-100 print:p-0 print:rounded-none print:shadow-none print:border-none">
                <ProfilePreview data={data} lang={selectedLang} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button for Mobile Print */}
      <button
        onClick={handlePrint}
        className="fixed bottom-8 right-8 z-[60] md:hidden p-4 bg-red-600 text-white rounded-full shadow-2xl shadow-red-300 hover:bg-red-700 active:scale-90 transition-all font-bold print:hidden"
      >
        <Printer className="w-6 h-6" />
      </button>

      {/* Overlay to ensure preview takes full width on print */}
      <div className="hidden print:block print-container bg-white">
        <ProfilePreview data={data} lang={selectedLang} />
      </div>
    </div>
  );
}

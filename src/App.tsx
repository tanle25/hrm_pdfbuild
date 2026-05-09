import { useState, useEffect, useRef } from 'react';
import { INITIAL_DATA, ProfileData, Language } from './types';
import ProfileForm from './components/ProfileForm';
import ProfilePreview from './components/ProfilePreview';
import { Edit3, Eye, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './translations';

type TranslationItem = {
  path: string;
  value: string;
};

type ExportProgress = {
  message: string;
  detail?: string;
  percent: number;
};

export default function App() {
  const [data, setData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('profileData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [selectedLang, setSelectedLang] = useState<Language>('vi');
  const [isExporting, setIsExporting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportData, setExportData] = useState<ProfileData>(data);
  const [exportLangs, setExportLangs] = useState<Language[]>([selectedLang]);
  const pdfSourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!isExporting) {
      setExportData(data);
      setExportLangs([selectedLang]);
    }
  }, [data, isExporting, selectedLang]);

  const waitForNextPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  const getOppositeLang = (lang: Language): Language => (lang === 'vi' ? 'zh' : 'vi');

  const buildTranslationItems = (profile: ProfileData, sourceLang: Language): TranslationItem[] => {
    const items: TranslationItem[] = [];
    const add = (path: string, value: string) => {
      if (value.trim()) items.push({path, value});
    };

    (['companyPrefix', 'companyName', 'slogan', 'market'] as const).forEach((field) => {
      add(field, profile[field][sourceLang]);
    });

    (['name', 'address', 'years', 'rep', 'industry'] as const).forEach((field) => {
      add(`info.${field}`, profile.info[field][sourceLang]);
    });

    (['intro', 'capability', 'achievements', 'strengths', 'needs'] as const).forEach((field) => {
      profile[field][sourceLang].forEach((value, index) => add(`${field}.${index}`, value));
    });

    profile.stats.forEach((stat, index) => {
      add(`stats.${index}.label`, stat.label[sourceLang]);
    });

    profile.products.forEach((product, index) => {
      add(`products.${index}.title`, product.title[sourceLang]);
      add(`products.${index}.desc`, product.desc[sourceLang]);
    });

    return items;
  };

  const applyTranslatedItems = (
    profile: ProfileData,
    targetLang: Language,
    translations: TranslationItem[]
  ): ProfileData => {
    const next: ProfileData = structuredClone(profile);

    translations.forEach(({path, value}) => {
      if (path === 'companyPrefix' || path === 'companyName' || path === 'slogan' || path === 'market') {
        next[path][targetLang] = value;
        return;
      }

      const infoMatch = path.match(/^info\.(name|address|years|rep|industry)$/);
      if (infoMatch) {
        next.info[infoMatch[1] as keyof ProfileData['info']][targetLang] = value;
        return;
      }

      const arrayMatch = path.match(/^(intro|capability|achievements|strengths|needs)\.(\d+)$/);
      if (arrayMatch) {
        const field = arrayMatch[1] as 'intro' | 'capability' | 'achievements' | 'strengths' | 'needs';
        const index = Number(arrayMatch[2]);
        if (next[field][targetLang][index] !== undefined) next[field][targetLang][index] = value;
        return;
      }

      const statLabelMatch = path.match(/^stats\.(\d+)\.label$/);
      if (statLabelMatch) {
        const index = Number(statLabelMatch[1]);
        if (next.stats[index]) next.stats[index].label[targetLang] = value;
        return;
      }

      const productMatch = path.match(/^products\.(\d+)\.(title|desc)$/);
      if (productMatch) {
        const index = Number(productMatch[1]);
        const field = productMatch[2] as 'title' | 'desc';
        if (next.products[index]) next.products[index][field][targetLang] = value;
      }
    });

    next.logoUrl = profile.logoUrl;
    next.heroUrl = profile.heroUrl;
    next.wechatQrUrl = profile.wechatQrUrl;
    next.hotline = profile.hotline;
    next.email = profile.email;
    next.website = profile.website;
    next.stats = next.stats.map((stat, index) => ({
      ...stat,
      num: profile.stats[index]?.num ?? stat.num,
      sup: profile.stats[index]?.sup ?? stat.sup,
    }));
    next.products = next.products.map((product, index) => ({
      ...product,
      img: profile.products[index]?.img ?? product.img,
    }));

    return next;
  };

  const translateProfile = async (profile: ProfileData, sourceLang: Language) => {
    const targetLang = getOppositeLang(sourceLang);
    const items = buildTranslationItems(profile, sourceLang);
    const response = await fetch('/api/translate-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({items, sourceLang, targetLang}),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Failed to translate profile');
    }

    return applyTranslatedItems(profile, targetLang, payload.translations as TranslationItem[]);
  };

  const handleTranslateProfile = async (sourceLang: Language) => {
    if (isTranslating) return;

    const targetLang = getOppositeLang(sourceLang);
    setIsTranslating(true);
    try {
      const translatedData = await translateProfile(data, sourceLang);
      setData(translatedData);
      setExportData(translatedData);
      setSelectedLang(targetLang);
    } catch (error) {
      console.error('Failed to translate profile:', error);
      alert(
        selectedLang === 'vi'
          ? 'Không thể dịch nội dung. Vui lòng kiểm tra GEMINI_API_KEY rồi thử lại.'
          : '无法翻译内容。请检查 GEMINI_API_KEY 后重试。'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const waitForExportAssets = async (element: HTMLElement) => {
    await document.fonts?.ready;

    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  };

  const getPdfFileName = (langs: Language[]) => {
    const companyName = data.companyName[selectedLang] || data.companyName.vi
      .replace(/<[^>]+>/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    return `${companyName || 'company-profile'}-${langs.join('-')}.pdf`;
  };

  const handleExportPdf = async (includeTranslation: boolean) => {
    if (isExporting) return;

    const langs: Language[] = includeTranslation ? [selectedLang, getOppositeLang(selectedLang)] : [selectedLang];
    setIsExporting(true);
    setExportProgress({
      message: selectedLang === 'vi' ? 'Đang chuẩn bị xuất PDF...' : '正在准备导出 PDF...',
      percent: 5,
    });

    try {
      if (includeTranslation) {
        setExportProgress({
          message: selectedLang === 'vi' ? 'Đang dịch nội dung...' : '正在翻译内容...',
          detail: selectedLang === 'vi'
            ? 'Quá trình này có thể mất vài chục giây.'
            : '此过程可能需要几十秒。',
          percent: 15,
        });
        const translatedData = await translateProfile(data, selectedLang);
        setExportData(translatedData);
      } else {
        setExportData(data);
      }

      setExportProgress({
        message: selectedLang === 'vi' ? 'Đang dựng bố cục PDF...' : '正在生成 PDF 布局...',
        percent: includeTranslation ? 45 : 20,
      });
      setExportLangs(langs);
      await waitForNextPaint();

      setExportProgress({
        message: selectedLang === 'vi' ? 'Đang tải công cụ xuất PDF...' : '正在加载 PDF 导出工具...',
        percent: includeTranslation ? 55 : 35,
      });
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const previewPages = Array.from(
        pdfSourceRef.current?.querySelectorAll('.preview-page') ?? []
      ) as HTMLElement[];

      if (previewPages.length === 0) {
        return;
      }

      setExportProgress({
        message: selectedLang === 'vi' ? 'Đang đợi ảnh và font sẵn sàng...' : '正在等待图片和字体加载...',
        percent: includeTranslation ? 65 : 50,
      });
      await waitForExportAssets(pdfSourceRef.current!);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (const [index, page] of previewPages.entries()) {
        const renderBase = includeTranslation ? 70 : 60;
        const renderRange = includeTranslation ? 20 : 30;
        setExportProgress({
          message: selectedLang === 'vi' ? 'Đang render trang PDF...' : '正在渲染 PDF 页面...',
          detail: `${index + 1}/${previewPages.length}`,
          percent: Math.min(95, Math.round(renderBase + (index / previewPages.length) * renderRange)),
        });
        const canvas = await html2canvas(page, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          logging: false,
        });

        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297);
      }

      setExportProgress({
        message: selectedLang === 'vi' ? 'Đang hoàn tất file PDF...' : '正在完成 PDF 文件...',
        percent: 96,
      });
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setExportProgress({
        message: selectedLang === 'vi' ? 'Hoàn tất. Đang mở file PDF...' : '完成。正在打开 PDF 文件...',
        percent: 100,
      });

      const pdfWindow = window.open(pdfUrl, '_blank');
      if (!pdfWindow) {
        pdf.save(getPdfFileName(langs));
      }

      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(
        selectedLang === 'vi'
          ? 'Không thể dịch hoặc xuất PDF. Vui lòng kiểm tra GEMINI_API_KEY, URL ảnh, rồi thử lại.'
          : '无法翻译或导出 PDF。请检查 GEMINI_API_KEY、图片 URL 后重试。'
      );
    } finally {
      window.setTimeout(() => {
        setIsExporting(false);
        setExportProgress(null);
      }, 600);
    }
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
              onClick={() => handleExportPdf(false)}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-bold text-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? selectedLang === 'vi' ? 'Đang xuất...' : '正在导出...'
                  : `${translations[selectedLang].exportPdf} (${selectedLang.toUpperCase()})`}
              </span>
            </button>

            <button
              onClick={() => handleExportPdf(true)}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl shadow-xl shadow-gray-200 hover:bg-black transition-all font-bold text-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? selectedLang === 'vi' ? 'Đang dịch & xuất...' : '正在翻译并导出...'
                  : selectedLang === 'vi' ? 'Xuất kèm bản dịch' : '导出并附翻译'}
              </span>
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
              <ProfileForm
                data={data}
                onChange={setData}
                lang={selectedLang}
                onTranslateProfile={handleTranslateProfile}
                isTranslating={isTranslating}
              />
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
      <div className="fixed bottom-8 right-8 z-[60] md:hidden flex flex-col gap-3 print:hidden">
        <button
          onClick={() => handleExportPdf(false)}
          disabled={isExporting}
          className="p-4 bg-white text-gray-900 rounded-full shadow-2xl hover:bg-gray-50 active:scale-90 transition-all font-bold disabled:cursor-not-allowed disabled:opacity-60 border border-gray-200"
          aria-label={selectedLang === 'vi' ? 'Xuất PDF ngôn ngữ hiện tại' : '导出当前语言 PDF'}
        >
          <Download className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleExportPdf(true)}
          disabled={isExporting}
          className="p-4 bg-red-600 text-white rounded-full shadow-2xl shadow-red-300 hover:bg-red-700 active:scale-90 transition-all font-bold disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={selectedLang === 'vi' ? 'Xuất PDF kèm bản dịch' : '导出 PDF 并附翻译'}
        >
          <Download className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {exportProgress && (
          <motion.div
            key="export-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center px-4 print:hidden"
          >
            <motion.div
              initial={{ y: 12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: 0.98 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-50 text-red-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-black text-gray-900">
                      {selectedLang === 'vi' ? 'Đang xuất PDF' : '正在导出 PDF'}
                    </h3>
                    <span className="text-sm font-black text-red-600">
                      {exportProgress.percent}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {exportProgress.message}
                  </p>
                  {exportProgress.detail && (
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      {exportProgress.detail}
                    </p>
                  )}
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-red-600 transition-all duration-300"
                      style={{ width: `${exportProgress.percent}%` }}
                    />
                  </div>
                  <p className="mt-4 text-xs text-gray-400">
                    {selectedLang === 'vi'
                      ? 'File PDF sẽ tự mở ở tab mới sau khi hoàn tất.'
                      : 'PDF 文件完成后会自动在新标签页打开。'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stable source used for direct PDF export */}
      <div ref={pdfSourceRef} className="pdf-export-source bg-white">
        {exportLangs.map((lang) => (
          <div key={lang}>
            <ProfilePreview data={exportData} lang={lang} />
          </div>
        ))}
      </div>

      {/* Overlay to ensure preview takes full width on print */}
      <div className="hidden print:block print-container bg-white">
        <ProfilePreview data={data} lang={selectedLang} />
      </div>
    </div>
  );
}

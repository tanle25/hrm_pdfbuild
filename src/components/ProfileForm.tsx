import React, { useState, useEffect } from 'react';
import { ProfileData, Stat, Product, Language } from '../types';
import { translations } from '../translations';
import { 
  Building2, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  Globe, 
  Plus, 
  Trash2, 
  LayoutDashboard,
  Megaphone,
  Briefcase,
  Star,
  Users2,
  Languages,
  Sparkles
} from 'lucide-react';

interface Props {
  data: ProfileData;
  onChange: (data: ProfileData) => void;
  lang: Language;
  onTranslateProfile?: (sourceLang: Language) => void;
  isTranslating?: boolean;
}

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
    <div className="bg-gray-50/80 px-6 py-4 border-bottom border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg border border-gray-100 text-red-600 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

export default function ProfileForm({ data, onChange, lang, onTranslateProfile, isTranslating = false }: Props) {
  const [formLang, setFormLang] = useState<Language>(lang);

  // Sync internal formLang with global lang when global lang changes
  useEffect(() => {
    setFormLang(lang);
  }, [lang]);

  const t = translations[lang];

  const updateField = (field: keyof ProfileData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateLocalizedField = (field: keyof ProfileData, value: string) => {
    const current = data[field] as any;
    onChange({ ...data, [field]: { ...current, [formLang]: value } });
  };

  const updateInfoField = (field: keyof ProfileData['info'], value: string) => {
    const current = data.info[field] as any;
    onChange({
      ...data,
      info: { ...data.info, [field]: { ...current, [formLang]: value } }
    });
  };

  const updateArrayEntry = (field: keyof ProfileData, index: number, value: string) => {
    const arrData = (data[field] as any);
    const arr = [...arrData[formLang]];
    arr[index] = value;
    onChange({ ...data, [field]: { ...arrData, [formLang]: arr } });
  };

  const addArrayEntry = (field: keyof ProfileData, defaultValue: string = "") => {
    const arrData = (data[field] as any);
    onChange({ 
      ...data, 
      [field]: { 
        vi: [...arrData.vi, defaultValue],
        zh: [...arrData.zh, defaultValue]
      } 
    });
  };

  const removeArrayEntry = (field: keyof ProfileData, index: number) => {
    const arrData = (data[field] as any);
    const vi = [...arrData.vi];
    const zh = [...arrData.zh];
    vi.splice(index, 1);
    zh.splice(index, 1);
    onChange({ ...data, [field]: { vi, zh } });
  };

  const updateStatLabel = (index: number, value: string) => {
    const stats = [...data.stats];
    stats[index] = { ...stats[index], label: { ...stats[index].label, [formLang]: value } };
    onChange({ ...data, stats });
  };

  const updateStatValue = (index: number, field: 'num' | 'sup', value: string) => {
    const stats = [...data.stats];
    stats[index] = { ...stats[index], [field]: value };
    onChange({ ...data, stats });
  };

  const updateProductText = (index: number, field: 'title' | 'desc', value: string) => {
    const products = [...data.products];
    const currentField = products[index][field] as any;
    products[index] = { 
      ...products[index], 
      [field]: { ...currentField, [formLang]: value } 
    };
    onChange({ ...data, products });
  };

  const updateProductImg = (index: number, value: string) => {
    const products = [...data.products];
    products[index] = { ...products[index], img: value };
    onChange({ ...data, products });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Form Language Toggle */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-red-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t.formEditingHeader}</p>
            <h4 className="font-black text-gray-900">{t.languages[formLang]}</h4>
          </div>
        </div>
        <div className="flex w-full md:w-auto">
          <button
            onClick={() => onTranslateProfile?.(formLang)}
            disabled={isTranslating || !onTranslateProfile}
            className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {isTranslating ? 'Đang dịch...' : 'Dịch thông minh'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.formTitle}</h1>
        <p className="text-gray-500 font-medium">{t.formSubtitle}</p>
      </div>

      <Section title={t.sections.basicInfo} icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.prefix} ({formLang})</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={data.companyPrefix[formLang]}
              onChange={(e) => updateLocalizedField('companyPrefix', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.companyName} ({formLang})</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={data.companyName[formLang]}
              onChange={(e) => updateLocalizedField('companyName', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.slogan} ({formLang})</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            value={data.slogan[formLang]}
            onChange={(e) => updateLocalizedField('slogan', e.target.value)}
          />
        </div>
      </Section>

      <Section title={t.sections.images} icon={ImageIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.logo}</label>
            <div className="flex flex-col gap-3">
              <div className="w-24 h-24 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                {data.logoUrl ? <img src={data.logoUrl} className="w-full h-full object-contain" alt="Logo Preview" /> : <ImageIcon className="text-gray-400" />}
              </div>
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-center font-bold text-sm cursor-pointer hover:bg-red-700 transition-colors">
                  {t.fields.upload}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateField('logoUrl', url))} />
                </label>
                <input 
                  type="text" 
                  placeholder={t.fields.orUrl}
                  className="flex-[2] px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  value={data.logoUrl}
                  onChange={(e) => updateField('logoUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.hero}</label>
            <div className="flex flex-col gap-3">
              <div className="aspect-video bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
                {data.heroUrl ? <img src={data.heroUrl} className="w-full h-full object-cover" alt="Hero Preview" /> : <ImageIcon className="text-gray-400" />}
              </div>
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-center font-bold text-sm cursor-pointer hover:bg-red-700 transition-colors">
                  {t.fields.upload}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateField('heroUrl', url))} />
                </label>
                <input 
                  type="text" 
                  placeholder={t.fields.orUrl}
                  className="flex-[2] px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  value={data.heroUrl}
                  onChange={(e) => updateField('heroUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t.sections.detailedInfo} icon={LayoutDashboard}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.memberOf} ({formLang})</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none min-h-[80px]"
              value={data.info.name[formLang]}
              onChange={(e) => updateInfoField('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.address} ({formLang})</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none min-h-[80px]"
              value={data.info.address[formLang]}
              onChange={(e) => updateInfoField('address', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.years} ({formLang})</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                value={data.info.years[formLang]}
                onChange={(e) => updateInfoField('years', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.rep} ({formLang})</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                value={data.info.rep[formLang]}
                onChange={(e) => updateInfoField('rep', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.industry} ({formLang})</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
              value={data.info.industry[formLang]}
              onChange={(e) => updateInfoField('industry', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title={t.sections.intro} icon={Megaphone}>
        {data.intro[formLang].map((p, i) => (
          <div key={i} className="flex gap-2 items-start mt-2">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.fields.introPara} {i + 1} ({formLang})</label>
              <textarea 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none min-h-[80px]"
                value={p}
                onChange={(e) => updateArrayEntry('intro', i, e.target.value)}
              />
            </div>
            <button 
              onClick={() => removeArrayEntry('intro', i)}
              className="mt-8 p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button 
          onClick={() => addArrayEntry('intro')}
          className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-all font-bold flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t.buttons.addPara}
        </button>
      </Section>

      <Section title={t.sections.stats} icon={Star}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.stats.map((s, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{t.fields.statPlan} {i+1}</span>
                <button onClick={() => {
                   const stats = [...data.stats];
                   stats.splice(i, 1);
                   onChange({ ...data, stats });
                }} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3"/></button>
              </div>
              <div className="flex gap-1">
                <input type="text" placeholder={t.fields.statNum} className="w-12 px-1 py-1 text-center bg-white border rounded text-sm" value={s.num} onChange={(e) => updateStatValue(i, 'num', e.target.value)} />
                <input type="text" placeholder={t.fields.statSup} className="w-8 px-1 py-1 text-center bg-white border rounded text-[10px]" value={s.sup} onChange={(e) => updateStatValue(i, 'sup', e.target.value)} />
              </div>
              <input type="text" placeholder={`${t.fields.statLabel} (${formLang})`} className="w-full px-2 py-1 bg-white border rounded text-[10px]" value={s.label[formLang]} onChange={(e) => updateStatLabel(i, e.target.value)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.sections.products} icon={Briefcase}>
        <div className="space-y-6">
          {data.products.map((p, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group">
              <button 
                onClick={() => {
                  const products = [...data.products];
                  products.splice(i, 1);
                  onChange({ ...data, products });
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.fields.productName} ({formLang})</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={p.title[formLang]}
                    onChange={(e) => updateProductText(i, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.fields.productImg}</label>
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 bg-white rounded border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={p.img || 'https://placehold.co/100x100?text=IMG'} className="w-full h-full object-cover" alt="Product" />
                    </div>
                    <label className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-bold cursor-pointer hover:bg-gray-300 transition-colors">
                      {t.fields.chooseFile}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateProductImg(i, url))} />
                    </label>
                    <input 
                      type="text" 
                      placeholder={t.fields.orUrl}
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-red-500"
                      value={p.img}
                      onChange={(e) => updateProductImg(i, e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.fields.productDesc} ({formLang})</label>
                <textarea 
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none min-h-[60px]"
                  value={p.desc[formLang]}
                  onChange={(e) => updateProductText(i, 'desc', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button 
            onClick={() => {
              const products = [...data.products, { 
                title: { vi: "", zh: "" }, 
                desc: { vi: "", zh: "" }, 
                img: "" 
              }];
              onChange({ ...data, products });
            }}
            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-all font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t.buttons.addProduct}
          </button>
        </div>
      </Section>

      <Section title={t.sections.capability} icon={Star}>
        <div className="space-y-2 mb-6">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.market} ({formLang})</label>
          <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={data.market[formLang]}
              onChange={(e) => updateField('market', { ...data.market, [formLang]: e.target.value })}
            />
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.capabilityList} ({formLang})</label>
          <div className="space-y-3">
            {data.capability[formLang].map((c, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={c}
                  onChange={(e) => updateArrayEntry('capability', i, e.target.value)}
                />
                <button 
                  onClick={() => removeArrayEntry('capability', i)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => addArrayEntry('capability')}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-all font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> {t.buttons.addCapability}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.achievements} ({formLang})</label>
          <div className="space-y-3">
            {data.achievements[formLang].map((a, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={a}
                  onChange={(e) => updateArrayEntry('achievements', i, e.target.value)}
                />
                <button 
                  onClick={() => removeArrayEntry('achievements', i)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => addArrayEntry('achievements')}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-all font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> {t.buttons.addAchievement}
            </button>
          </div>
        </div>
      </Section>

      <Section title={t.sections.strengths} icon={Star}>
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.strengthTitle} ({formLang})</label>
          <div className="grid grid-cols-1 gap-2">
            {data.strengths[formLang].map((s, i) => (
               <div key={i} className="flex gap-2">
                  <input type="text" className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg" value={s} onChange={(e) => updateArrayEntry('strengths', i, e.target.value)} />
                  <button onClick={() => removeArrayEntry('strengths', i)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
               </div>
            ))}
            <button onClick={() => addArrayEntry('strengths')} className="py-2 border-2 border-dashed rounded-lg text-gray-400 font-bold">+ {t.buttons.addStrength}</button>
          </div>

          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block mt-6">{t.fields.needsTitle} ({formLang})</label>
          <div className="grid grid-cols-1 gap-2">
            {data.needs[formLang].map((n, i) => (
               <div key={i} className="flex gap-2">
                  <input type="text" className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg" value={n} onChange={(e) => updateArrayEntry('needs', i, e.target.value)} />
                  <button onClick={() => removeArrayEntry('needs', i)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
               </div>
            ))}
            <button onClick={() => addArrayEntry('needs')} className="py-2 border-2 border-dashed rounded-lg text-gray-400 font-bold">+ {t.buttons.addNeed}</button>
          </div>
        </div>
      </Section>

      <Section title={t.sections.contact} icon={Users2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4" /> {t.fields.hotline}
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={data.hotline}
              onChange={(e) => updateField('hotline', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" /> {t.fields.email}
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> {t.fields.website}
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            value={data.website}
            onChange={(e) => updateField('website', e.target.value)}
          />
        </div>
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.fields.wechatQr}</label>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-white shadow-inner">
              {data.wechatQrUrl ? (
                <img src={data.wechatQrUrl} className="w-full h-full object-contain" alt="QR Preview" />
              ) : (
                <ImageIcon className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm cursor-pointer hover:bg-black transition-colors flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> {t.buttons.uploadQr}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateField('wechatQrUrl', url))} />
                </label>
                <input 
                  type="text" 
                  placeholder={t.fields.orUrl}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  value={data.wechatQrUrl}
                  onChange={(e) => updateField('wechatQrUrl', e.target.value)}
                />
              </div>
              <p className="text-[10px] text-gray-400 italic font-medium">{t.fields.qrHint}</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

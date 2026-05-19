import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { templates } from '../utils/templates';

const AddPage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  
  // Advanced Preview & Layout settings
  const [layoutMode, setLayoutMode] = useState('split'); // 'editor', 'split'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'mobile'
  const [activeEditorTab, setActiveEditorTab] = useState('basic'); // 'basic', 'advanced', 'seo'
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-_\u0600-\u06FF]/g, '') // Support arabic characters if any, but clean spaces
      .replace(/\s+/g, '-');
    setSlug(encodeURIComponent(generatedSlug).slice(0, 50));
  };

  const handleSlugChange = (e) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
    setSlug(val);
  };

  const handleSelectTemplate = (template) => {
    const confirmMsg = `هل أنت متأكد من رغبتك في استيراد "${template.title}"؟\nتنبيه: سيؤدي هذا إلى استبدال كود HTML الحالي بالكامل.`;
    if (window.confirm(confirmMsg)) {
      setHtmlContent(template.html);
      if (!title) {
        setTitle(template.defaultTitle);
        const generatedSlug = template.defaultTitle
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-_\u0600-\u06FF]/g, '')
          .replace(/\s+/g, '-');
        setSlug(encodeURIComponent(generatedSlug).slice(0, 50));
      }
      setShowTemplatesModal(false);
      setLayoutMode('split');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !htmlContent) {
      setError('يرجى ملء جميع الحقول الأساسية المطلوبة.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      await api.post('/pages', {
        title,
        slug,
        html_content: htmlContent,
        meta_title: metaTitle,
        meta_description: metaDescription,
        custom_css: customCss,
        custom_js: customJs,
      });
      setIsSaving(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating page:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ وتدوين الصفحة.');
      setIsSaving(false);
    }
  };

  const getPreviewHtml = () => {
    let rawHtml = htmlContent || `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              background: #0f172a;
              color: #94a3b8;
              font-family: system-ui, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
              direction: rtl;
            }
            .card {
              border: 1px dashed #334155;
              padding: 2rem;
              border-radius: 1rem;
              max-width: 400px;
            }
            h1 { color: #f1f5f9; margin-bottom: 0.5rem; font-size: 1.5rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>المعاينة المباشرة جاهزة 🚀</h1>
            <p>ابدأ بلصق أو كتابة أكواد HTML في المحرر لرؤية النتيجة فوراً.</p>
          </div>
        </body>
      </html>
    `;

    // Inject custom CSS
    if (customCss) {
      const styleTag = `\n<style id="preview-custom-css">\n${customCss}\n</style>\n`;
      if (rawHtml.includes('</head>')) {
        rawHtml = rawHtml.replace('</head>', `${styleTag}</head>`);
      } else {
        rawHtml = styleTag + rawHtml;
      }
    }

    // Inject interactive simulation script
    const previewScript = `
<script>
  (function() {
    document.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('📝 [محاكاة المعاينة] تم اعتراض إرسال النموذج بنجاح! في الصفحة المنشورة، سيتم التقاط هذه البيانات كرسالة عميل محتمل في لوحة التحكم.');
    });
  })();
</script>
`;
    if (rawHtml.includes('</body>')) {
      rawHtml = rawHtml.replace('</body>', `${previewScript}</body>`);
    } else {
      rawHtml = rawHtml + previewScript;
    }

    return rawHtml;
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Top action header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors">مساحة العمل</Link>
            <span>/</span>
            <span className="text-slate-400">إطلاق رابط جديد</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">إطلاق صفحة هبوط جديدة</h2>
          <p className="text-xs text-slate-400 mt-1">قم بتهيئة صفحتك، وعاينها مباشرة، واضبط إعدادات السيو والبرمجة المخصصة.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Layout control switches */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-1 flex items-center">
            <button
              type="button"
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                layoutMode === 'split'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
              <span>شاشة مقسمة</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                layoutMode === 'editor'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span>كامل العرض</span>
            </button>
          </div>

          <Link
            to="/dashboard"
            className="bg-slate-900/40 hover:bg-slate-800 border border-slate-700/60 px-4 py-2 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 stroke-[2] rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="19" y1="12" x2="5" y2="12" />
              <path d="M12 19l7-7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>إلغاء والعودة</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold leading-relaxed">{error}</span>
        </div>
      )}

      {/* Main Grid Workbench */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Form & Editor workbench */}
        <div className={`${layoutMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-8'} space-y-6 flex flex-col`}>
          <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-lg space-y-6 flex-1 flex flex-col">
            
            {/* Editor navigation tabs */}
            <div className="border-b border-slate-700/60 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700/40">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('basic')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeEditorTab === 'basic' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📝 البيانات الأساسية
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('seo')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeEditorTab === 'seo' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔍 إعدادات السيو (SEO)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('advanced')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeEditorTab === 'advanced' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎨 تنسيقات وبرمجة (CSS/JS)
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900/20 px-2.5 py-1.5 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>المحرر جاهز للاستخدام</span>
              </div>
            </div>

            {/* TAB CONTENT: Basic Settings */}
            {activeEditorTab === 'basic' && (
              <div className="space-y-5 animate-[fadeIn_0.2s_ease-out] flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 mr-1">
                      اسم العميل / النشاط التجاري *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: صالون هيلتون الرجالي"
                      value={title}
                      onChange={handleTitleChange}
                      className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 mr-1">
                      مسار الرابط الفرعي / Slug *
                    </label>
                    <div className="flex rounded-xl bg-[#0f172a] border border-slate-700/70 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all font-sans" dir="ltr">
                      <span className="bg-slate-900/60 px-3.5 py-3 text-slate-500 text-xs font-bold select-none border-r border-slate-700/50 flex items-center">
                        /p/
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="helton-salon"
                        value={slug}
                        onChange={handleSlugChange}
                        className="w-full bg-transparent px-3 py-3 text-blue-400 font-semibold font-mono placeholder-slate-500 focus:outline-none text-xs text-left"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mr-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      كود مستند HTML الكامل لصفحة الهبوط *
                    </label>
                    
                    <button
                      type="button"
                      onClick={() => setShowTemplatesModal(true)}
                      className="bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 active:scale-[0.97] duration-200"
                    >
                      ✨ اختيار قالب جاهز
                    </button>
                  </div>
                  
                  <div className="rounded-xl border border-slate-700/70 bg-[#0f172a] overflow-hidden focus-within:border-blue-500 transition-all font-sans flex-1 flex flex-col min-h-[350px]">
                    <div className="h-10 border-b border-slate-700/50 bg-slate-900/40 px-4 flex items-center justify-between text-[10px] text-slate-500 font-semibold select-none" dir="ltr">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="ml-1.5 font-mono text-[9px] text-slate-500">landing_index.html</span>
                      </div>
                      <span className="font-mono text-[9px]">UTF-8 SOURCE</span>
                    </div>

                    <textarea
                      required
                      dir="ltr"
                      placeholder="<!-- الصق الكود المولد هنا أو اختر قالباً جاهزاً -->&#10;..."
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="w-full bg-transparent p-4 text-slate-300 font-mono text-xs focus:outline-none resize-y leading-relaxed text-left placeholder-slate-650 flex-1 min-h-[300px]"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEO Settings */}
            {activeEditorTab === 'seo' && (
              <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 mr-1">
                    عنوان السيو المخصص / Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: صالون هيلتون للرجال - حلاقة وعناية ممتازة بالرياض"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-xs font-semibold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 mr-1 leading-relaxed">
                    يظهر كعنوان رئيسي لصفحتك في نتائج محركات البحث مثل جوجل. الطول المثالي: 50-60 حرفاً.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 mr-1">
                    وصف السيو التعريفي / Meta Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="مثال: احجز موعدك الآن في صالون هيلتون الرجالي واستمتع بأفضل خدمات العناية بالشعر والبشرة بأيدي خبراء حلاقة محترفين بالرياض وبأسعار مناسبة."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-xs font-semibold resize-none"
                  ></textarea>
                  <p className="text-[10px] text-slate-500 mt-1.5 mr-1 leading-relaxed">
                    وصف مختصر وملخص لمحتوى صفحتك يظهر تحت الرابط في محرك البحث. الطول المثالي: 120-160 حرفاً.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Custom Code Settings */}
            {activeEditorTab === 'advanced' && (
              <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                <div>
                  <div className="flex items-center justify-between mb-2 mr-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      تنسيقات CSS مخصصة (تضاف تلقائياً في الرأس)
                    </label>
                    <span className="text-[9px] font-mono text-slate-550 font-bold bg-slate-900/30 px-2 py-0.5 rounded">&lt;style&gt;</span>
                  </div>
                  <textarea
                    rows="6"
                    dir="ltr"
                    placeholder="/* اكتب تنسيقات CSS هنا لتعديل العناصر تلقائياً */&#10;.btn-primary { background: linear-gradient(135deg, #1e3a8a, #3b82f6) !important; }"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl p-4 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 mr-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      سكربت JavaScript مخصص (مثل بكسل فيسبوك أو تتبع Google)
                    </label>
                    <span className="text-[9px] font-mono text-slate-550 font-bold bg-slate-900/30 px-2 py-0.5 rounded">&lt;script&gt;</span>
                  </div>
                  <textarea
                    rows="6"
                    dir="ltr"
                    placeholder="// اكتب أكواد JavaScript مخصصة للتتبع أو التفاعل هنا&#10;console.log('Noor Tracker Active!');"
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl p-4 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Bottom publish bar */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-700/40 pt-5">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-2.5 rounded-xl shadow-lg shadow-blue-600/10 active:scale-[0.98] transition-all flex items-center gap-1.5 text-xs uppercase disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري نشر وإطلاق صفحتك...</span>
                  </>
                ) : (
                  <>
                    <span>نشر وإطلاق الصفحة</span>
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Dynamic Live Preview inside Frame OR Sidebar info */}
        {layoutMode === 'split' ? (
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Viewport bar options */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-700/50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'desktop' ? 'bg-slate-800 text-white border border-slate-750' : 'text-slate-450 hover:text-slate-350'
                  }`}
                >
                  💻 حاسوب
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'mobile' ? 'bg-slate-800 text-white border border-slate-750' : 'text-slate-450 hover:text-slate-350'
                  }`}
                >
                  📱 هاتف
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 bg-slate-900/20 px-2.5 py-1.5 rounded-lg">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span>معاينة تفاعلية فورية</span>
              </div>
            </div>

            {/* Sandbox Render Box */}
            <div className="bg-[#0f172a] border border-slate-700/60 rounded-3xl p-4 flex-1 flex items-center justify-center min-h-[500px] shadow-2xl relative overflow-hidden">
              {previewDevice === 'mobile' ? (
                /* Premium Smartphone Frame mockup */
                <div className="w-[360px] h-[640px] border-[12px] border-slate-800 rounded-[40px] bg-white shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300">
                  {/* Smartphone Speaker & Camera Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center gap-1">
                    <span className="w-10 h-1 bg-slate-700 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-700"></span>
                  </div>
                  <iframe
                    title="Noor Smartphone Live Sandbox"
                    srcDoc={getPreviewHtml()}
                    className="w-full h-full border-none pt-4 bg-white"
                    sandbox="allow-scripts allow-popups"
                  />
                  {/* Smartphone Bottom indicator bar */}
                  <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-300 rounded-full z-20"></div>
                </div>
              ) : (
                /* Full size browser preview */
                <div className="w-full h-full border border-slate-850 rounded-2xl bg-white shadow-xl relative overflow-hidden flex flex-col flex-1">
                  {/* Browser Address Mock Header */}
                  <div className="h-10 border-b border-slate-200 bg-slate-100 px-4 flex items-center gap-2 select-none" dir="ltr">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-lg px-3 py-1 flex items-center gap-1.5 text-[9px] font-mono text-slate-400 flex-1 max-w-sm ml-4 truncate">
                      <svg className="w-3 h-3 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>noor.com/p/{slug || '...'}</span>
                    </div>
                  </div>
                  <iframe
                    title="Noor Sandbox Live Viewer"
                    srcDoc={getPreviewHtml()}
                    className="w-full h-full border-none bg-white flex-1 min-h-[450px]"
                    sandbox="allow-scripts allow-popups"
                  />
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Right Column (Standard Cheat Sheet Sidebar when Split Screen is Off) */
          <div className="lg:col-span-4 space-y-6">
            
            {/* Target simulation */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">الرابط المستهدف النشط</h3>
              
              <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">محاكاة عنوان المتصفح</span>
                </div>
                <div className="bg-[#0f172a] border border-slate-700/60 rounded-lg px-3 py-2 flex items-center gap-1.5 overflow-hidden" dir="ltr">
                  <svg className="w-3.5 h-3.5 text-slate-550 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-mono text-blue-400 truncate font-semibold">
                    noor.com/p/{slug || '...'}
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
                  هذا الرابط يستهدف استضافة خوادم الحافة التابعة لـ نور. بمجرد النشر سيتمكن الزوار من فتح صفحتك فوراً وبسرعة فائقة.
                </p>
              </div>
            </div>

            {/* Quick reference guide */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ورقة الإرشادات السريعة</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                تأكد من أن كود HTML المولد يحتوي على الروابط الصحيحة لربط أزرار الاتصال وحسابات عميلك بنجاح:
              </p>

              <div className="space-y-3">
                <div className="bg-slate-900/40 border border-slate-700/40 p-3 rounded-xl space-y-1.5">
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">زر الواتساب (WhatsApp)</p>
                  <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700/50 font-mono text-[9px] text-slate-450" dir="ltr">
                    <code className="select-all block truncate">href="https://wa.me/2012345..."</code>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-700/40 p-3 rounded-xl space-y-1.5">
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">زر الاتصال الهاتفي المباشر</p>
                  <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700/50 font-mono text-[9px] text-slate-450" dir="ltr">
                    <code className="select-all block truncate">href="tel:+20123456..."</code>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </form>
      
      {/* Pre-made Templates Library Modal Overlay */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-700/60 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8 animate-[fadeIn_0.2s_ease-out] text-right">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-700/50 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">📚 مكتبة القوالب العربية الجاهزة</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">اختر قالباً مصمماً بعناية ليناسب أهداف نشاطك، وسيتم حقن الهيكل فوراً.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-500 hover:text-slate-350 p-1.5 rounded-lg bg-slate-900/20 hover:bg-slate-900/50 transition-all font-sans text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className="group border border-slate-700/40 hover:border-blue-500/50 bg-slate-900/30 hover:bg-slate-900/60 p-4.5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`h-4.5 w-4.5 rounded-full bg-gradient-to-tr ${tpl.previewColor} border border-slate-800`} />
                      <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">
                        {tpl.badge}
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                    <span>استيراد وتعديل الكود</span>
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancel Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-700/50 pt-4">
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="bg-slate-900/50 hover:bg-slate-800 border border-slate-750 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all duration-200"
              >
                إغلاق المكتبة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AddPage;

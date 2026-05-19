import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState('');

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pages');
      setPages(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('تعذر تحميل صفحات الهبوط. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pages/${id}`);
      setPages(pages.filter((page) => page.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('فشل حذف الصفحة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleCopyLink = (slug) => {
    const liveUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(''), 2000);
    });
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = pages.reduce((sum, page) => sum + (page.views || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100">لوحة التحكم العامة</h2>
          <p className="text-xs text-slate-400 mt-1">أدر صفحات الهبوط النشطة وعمليات النشر الفوري لعملائك بنقرة زر.</p>
        </div>

        {/* Sync Info Pill */}
        <div className="self-start md:self-auto flex items-center gap-2 bg-slate-900/35 border border-slate-700/60 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-blue-400">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span>خادم الحافة النشط: متصل ومزامن بالكامل</span>
        </div>
      </div>

      {/* Premium Statistics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card 1 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">صفحات الهبوط النشطة</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{pages.length}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">الصفحات النشطة والمستضافة حالياً على السيرفر</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">إجمالي الزيارات المستلمة</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{totalViews.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">عدد الزيارات الفريدة لكافة صفحات عملائك</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">النطاق الأساسي النشط</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-mono text-blue-400 truncate mt-1.5 font-semibold" dir="ltr">{window.location.host}</h3>
          <p className="text-[10px] text-slate-500 mt-3 font-medium">خادم النشر والتوجيه الرئيسي التابع لنور</p>
        </div>
      </div>

      {/* Query Search and Create Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative group">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
            <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ابحث عن صفحة هبوط أو اسم عميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700/70 rounded-xl pr-10 pl-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs font-semibold"
          />
        </div>

        <Link
          to="/dashboard/add"
          className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>إطلاق صفحة هبوط جديدة</span>
        </Link>
      </div>

      {/* Landing Pages Grid Container */}
      <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl relative">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 tracking-wide">جاري استعلام البيانات من الخادم...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 font-bold text-xs">{error}</div>
        ) : filteredPages.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="h-14 w-14 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-500">
              <svg className="w-7 h-7 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="text-slate-200 font-bold text-sm mb-1">لا توجد صفحات نشطة</h4>
            <p className="text-slate-500 text-[11px] max-w-xs mx-auto mb-5 leading-relaxed">
              {searchQuery ? 'لم نجد أي صفحات مطابقة لمعايير البحث الخاصة بك.' : 'ابدأ بنشر أول صفحة هبوط لعملائك الآن بروابط فورية ومباشرة.'}
            </p>
            {!searchQuery && (
              <Link
                to="/dashboard/add"
                className="bg-slate-800 hover:bg-slate-705 border border-slate-700/60 px-4 py-2 rounded-lg text-[10px] font-bold text-blue-400 transition-colors"
              >
                إنشاء أول صفحة هبوط
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-700/40">
            {/* Mobile View: Cards layout */}
            <div className="block md:hidden divide-y divide-slate-700/30">
              {filteredPages.map((page) => (
                <div key={page.id} className="p-4.5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400 shrink-0 uppercase">
                        {page.title.slice(0, 2)}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-xs text-slate-200 truncate" title={page.title}>{page.title}</h4>
                        <p className="text-[9px] font-mono text-slate-500 truncate">المعرّف: {page.id}</p>
                      </div>
                    </div>
                    
                    <span className="inline-flex bg-slate-900/60 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-350 border border-slate-700/40 font-mono shrink-0">
                      {page.views} زيارة
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-3 flex items-center justify-between gap-3" dir="ltr">
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline truncate font-semibold"
                    >
                      /{page.slug}
                    </a>
                    <div className="relative flex items-center shrink-0">
                      <button
                        onClick={() => handleCopyLink(page.slug)}
                        className="p-1.5 hover:bg-slate-800 border border-transparent hover:border-slate-700/60 rounded-lg text-slate-500 hover:text-slate-350 transition-colors"
                        title="نسخ رابط الصفحة المباشر"
                      >
                        <svg className="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      </button>
                      {copiedSlug === page.slug && (
                        <span className="absolute right-8 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-blue-500 animate-[fadeIn_0.15s_ease-out] z-20 flex items-center gap-1 whitespace-nowrap">
                          تم النسخ!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <div>
                      <span className="text-[9px] text-slate-500">نُشرت في:</span>{' '}
                      <span className="font-semibold text-slate-350">
                        {new Date(page.created_at).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/edit/${page.id}`}
                        className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <svg className="w-3 h-3 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>تعديل</span>
                      </Link>
                      
                      {deleteConfirmId === page.id ? (
                        <div className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 rounded-xl p-0.5 animate-[fadeIn_0.15s_ease-out] z-20">
                          <span className="text-[9px] text-red-200 font-bold px-1">حذف؟</span>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="bg-red-650 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                          >
                            نعم
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-350 px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                          >
                            لا
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(page.id)}
                          className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <svg className="w-3 h-3 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Traditional tabular layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-700/40 bg-slate-900/30">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">اسم الصفحة والعميل</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">مسار الرابط الفرعي</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">الزيارات</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">تاريخ النشر</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-900/10 transition-colors">
                      {/* Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400 shrink-0 uppercase">
                            {page.title.slice(0,2)}
                          </div>
                          <div className="truncate max-w-[200px]">
                            <div className="font-bold text-xs text-slate-200 truncate" title={page.title}>{page.title}</div>
                            <div className="text-[9px] font-mono text-slate-500 truncate">المعرّف: {page.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Slug / Link */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 relative">
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-semibold"
                            dir="ltr"
                          >
                            /{page.slug}
                            <svg className="w-3 h-3 stroke-[2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          
                          {/* Copy Link Module */}
                          <div className="relative flex items-center">
                            <button
                              onClick={() => handleCopyLink(page.slug)}
                              className="p-1 hover:bg-slate-800 border border-transparent hover:border-slate-700/60 rounded-lg text-slate-500 hover:text-slate-350 transition-colors"
                              title="نسخ رابط الصفحة المباشر"
                            >
                              <svg className="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            </button>
                            
                            {/* Animated Tooltip */}
                            {copiedSlug === page.slug && (
                              <span className="absolute right-7 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-blue-500 animate-[fadeIn_0.15s_ease-out] z-20 flex items-center gap-1 whitespace-nowrap">
                                <svg className="w-2.5 h-2.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                تم النسخ!
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex bg-slate-900/60 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-350 border border-slate-700/40 font-mono">
                          {page.views}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-[11px] text-slate-400 font-semibold">
                        {new Date(page.created_at).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dashboard/edit/${page.id}`}
                            className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <svg className="w-3 h-3 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>تعديل</span>
                          </Link>
                          
                          {deleteConfirmId === page.id ? (
                            <div className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 rounded-xl p-0.5 animate-[fadeIn_0.15s_ease-out] z-20">
                              <span className="text-[9px] text-red-200 font-bold px-1">حذف؟</span>
                              <button
                                onClick={() => handleDelete(page.id)}
                                className="bg-red-650 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                              >
                                نعم
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-350 px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                              >
                                لا
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(page.id)}
                              className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                            >
                              <svg className="w-3 h-3 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              <span>حذف</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

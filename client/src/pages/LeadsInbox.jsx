import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const LeadsInbox = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPageFilter, setSelectedPageFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads');
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('تعذر تحميل صندوق الوارد. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead.id !== id));
      setDeleteConfirmId(null);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('فشل حذف العميل. يرجى المحاولة مرة أخرى.');
    }
  };

  // Extract unique landing pages list for filters
  const uniquePages = Array.from(
    new Map(leads.map((l) => [l.page_id, { id: l.page_id, title: l.page_title, slug: l.page_slug }])).values()
  );

  // Filter and search logic
  const filteredLeads = leads.filter((lead) => {
    // 1. Page Filter
    if (selectedPageFilter !== 'all' && String(lead.page_id) !== String(selectedPageFilter)) {
      return false;
    }
    // 2. Search Query
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      (lead.message && lead.message.toLowerCase().includes(query)) ||
      (lead.page_title && lead.page_title.toLowerCase().includes(query)) ||
      (lead.page_slug && lead.page_slug.toLowerCase().includes(query))
    );
  });

  // Calculate statistics
  const leadsCount = leads.length;
  const uniqueContactsCount = new Set(leads.map((l) => l.phone || l.email)).size;
  const latestLeadDate = leads.length > 0 ? new Date(leads[0].created_at) : null;

  // Helper to parse custom data dynamically
  const getCustomFields = (lead) => {
    if (!lead || !lead.data) return [];
    try {
      const parsed = typeof lead.data === 'string' ? JSON.parse(lead.data) : lead.data;
      const ignoredKeys = [
        'name', 'email', 'phone', 'message', 'id', 'page_id', 
        'created_at', 'data', '_slug', 'page_slug', 'submit'
      ];
      
      return Object.keys(parsed)
        .filter((key) => !ignoredKeys.includes(key.toLowerCase().trim()) && !key.startsWith('_'))
        .map((key) => ({
          label: key,
          value: parsed[key]
        }));
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100">صندوق وارد العملاء</h2>
          <p className="text-xs text-slate-400 mt-1">تصفح وراجع طلبات الاتصال والبيانات المستلمة من كافة صفحات الهبوط بنشاط فوري.</p>
        </div>

        {/* Sync Status Info */}
        <div className="self-start md:self-auto flex items-center gap-2 bg-slate-900/35 border border-slate-700/60 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-blue-400">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>تحديث مباشر ونشط</span>
        </div>
      </div>

      {/* Leads Stats Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card 1 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">إجمالي الطلبات المستلمة</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{leadsCount}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">عدد الرسائل والاستمارات المرسلة عبر جميع صفحات الهبوط</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">العملاء المهتمون الفريدون</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{uniqueContactsCount}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">عدد العملاء المنفصلين بناءً على البريد أو الهاتف</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[3px] bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">تاريخ آخر طلب اتصال</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-200 mt-3.5">
            {latestLeadDate ? (
              latestLeadDate.toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            ) : (
              'لا توجد رسائل واردة'
            )}
          </h3>
          <p className="text-[10px] text-slate-500 mt-3 font-medium">توقيت وصول آخر طلب اتصال عبر خوادم نور</p>
        </div>
      </div>

      {/* Filters and Search Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-80 relative group">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
            <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ابحث بالاسم، الهاتف، البريد أو محتوى الرسالة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700/70 rounded-xl pr-10 pl-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs font-semibold"
          />
        </div>

        {/* Filters dropdown */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 self-start sm:self-auto">تصفية حسب الصفحة:</span>
          <select
            value={selectedPageFilter}
            onChange={(e) => setSelectedPageFilter(e.target.value)}
            className="w-full sm:w-60 bg-[#1e293b] border border-slate-700/70 rounded-xl px-3 py-2 text-slate-250 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs font-semibold"
          >
            <option value="all">كافة صفحات الهبوط ({uniquePages.length})</option>
            {uniquePages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (/{p.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table/Grid Container */}
      <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl relative">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 tracking-wide">جاري استعلام رسائل العملاء...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 font-bold text-xs">{error}</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="h-14 w-14 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-500">
              <svg className="w-7 h-7 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.25 0l-2.25 1.5" />
              </svg>
            </div>
            <h4 className="text-slate-200 font-bold text-sm mb-1">صندوق الوارد فارغ</h4>
            <p className="text-slate-500 text-[11px] max-w-xs mx-auto mb-5 leading-relaxed">
              {searchQuery || selectedPageFilter !== 'all' 
                ? 'لم نجد أي طلبات اتصال مطابقة لمعايير البحث والتصفية المحددة.' 
                : 'لم تتلقَ أي استمارات أو طلبات اتصال من صفحات الهبوط بعد. سيتم عرضها هنا فور إرسالها.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/40">
            {/* Mobile View: Cards layout */}
            <div className="block md:hidden divide-y divide-slate-700/30">
              {filteredLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="p-4.5 space-y-3 hover:bg-slate-900/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-200 truncate">{lead.name || 'عميل مهتم غير مسمى'}</h4>
                      <p className="text-[9px] font-mono text-slate-500 truncate" dir="ltr">{lead.phone || lead.email || 'بدون بيانات تواصل مباشرة'}</p>
                    </div>
                    
                    <span className="inline-flex bg-slate-900/60 px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-400 border border-slate-700/40 shrink-0">
                      {lead.page_title}
                    </span>
                  </div>

                  {lead.message && (
                    <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 bg-slate-900/35 border border-slate-700/30 rounded-xl p-2.5">
                      {lead.message}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                    <span>
                      {new Date(lead.created_at).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg font-bold"
                      >
                        معاينة
                      </button>

                      {deleteConfirmId === lead.id ? (
                        <div 
                          className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 rounded-xl p-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[9px] text-red-200 font-bold px-1">حذف؟</span>
                          <button
                            onClick={(e) => handleDelete(lead.id, e)}
                            className="bg-red-650 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                          >
                            نعم
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-350 px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                          >
                            لا
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(lead.id);
                          }}
                          className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 p-1 rounded-lg"
                        >
                          <svg className="w-3.5 h-3.5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Tabular Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-700/40 bg-slate-900/30">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">العميل المهتم</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">بيانات الاتصال</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">مصدر صفحة الهبوط</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">محتوى الرسالة</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">تاريخ الاستلام</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-900/10 cursor-pointer transition-colors"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'AD'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-200 truncate max-w-[150px]" title={lead.name}>
                              {lead.name || 'عميل غير مسمى'}
                            </div>
                            <div className="text-[9px] font-mono text-slate-500">المعرف: {lead.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5 text-right">
                          {lead.phone && (
                            <div className="text-xs font-semibold text-slate-300 font-mono" dir="ltr">
                              {lead.phone}
                            </div>
                          )}
                          {lead.email ? (
                            <div className="text-[10px] text-slate-400 font-mono" dir="ltr">
                              {lead.email}
                            </div>
                          ) : (
                            !lead.phone && <span className="text-[10px] text-slate-500 italic">لا توجد بيانات</span>
                          )}
                        </div>
                      </td>

                      {/* Landing Page */}
                      <td className="px-5 py-4">
                        <div className="max-w-[160px]">
                          <div className="font-bold text-xs text-slate-200 truncate" title={lead.page_title}>
                            {lead.page_title}
                          </div>
                          <a
                            href={`/${lead.page_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-mono text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-0.5"
                            dir="ltr"
                          >
                            /{lead.page_slug}
                          </a>
                        </div>
                      </td>

                      {/* Message preview */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-450 truncate max-w-[200px]" title={lead.message}>
                          {lead.message || <span className="text-slate-600 italic">لا توجد رسالة مرفقة</span>}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-[10px] text-slate-400 font-semibold">
                        {new Date(lead.created_at).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4 text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>معاينة</span>
                          </button>

                          {deleteConfirmId === lead.id ? (
                            <div className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 rounded-xl p-0.5 animate-[fadeIn_0.15s_ease-out] z-20">
                              <span className="text-[9px] text-red-200 font-bold px-1">حذف؟</span>
                              <button
                                onClick={(e) => handleDelete(lead.id, e)}
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
                              onClick={() => setDeleteConfirmId(lead.id)}
                              className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 p-1.5 rounded-xl transition-all"
                              title="حذف الطلب"
                            >
                              <svg className="w-3.5 h-3.5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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

      {/* Stunning Detail Inspector Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#1e293b] border border-slate-700 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl animate-[scaleUp_0.2s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-700/60 bg-slate-900/30 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">تفاصيل العميل والطلب</span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{selectedLead.name || 'عميل بدون اسم'}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Meta information row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/35 border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[9px] text-slate-500 block mb-1">مصدر صفحة الهبوط</span>
                  <span className="text-xs font-bold text-slate-200">{selectedLead.page_title}</span>
                  <a
                    href={`/${selectedLead.page_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-blue-400 hover:underline block mt-1"
                    dir="ltr"
                  >
                    /{selectedLead.page_slug}
                  </a>
                </div>

                <div className="bg-slate-900/35 border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[9px] text-slate-500 block mb-1">تاريخ الاستلام والوقت</span>
                  <span className="text-xs font-bold text-slate-200 block">
                    {new Date(selectedLead.created_at).toLocaleDateString('ar-EG', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1" dir="ltr">
                    {new Date(selectedLead.created_at).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Core Contact info cards */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">بيانات التواصل الأساسية</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone */}
                  <div className="bg-slate-900/20 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-slate-500 block">رقم الهاتف</span>
                      <span className="text-xs font-bold text-slate-200 font-mono" dir="ltr">
                        {selectedLead.phone || 'غير متوفر'}
                      </span>
                    </div>
                    {selectedLead.phone && (
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-xs"
                        title="اتصال مباشر"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-slate-900/20 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-slate-500 block">البريد الإلكتروني</span>
                      <span className="text-xs font-bold text-slate-200 font-mono truncate max-w-[180px] block" dir="ltr" title={selectedLead.email}>
                        {selectedLead.email || 'غير متوفر'}
                      </span>
                    </div>
                    {selectedLead.email && (
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-xs"
                        title="إرسال بريد إلكتروني"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Message text block */}
              {selectedLead.message && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">الرسالة أو الملاحظات</h4>
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                </div>
              )}

              {/* Serialized Custom Payload Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  الحقول المخصصة الإضافية المستلمة
                </h4>
                {getCustomFields(selectedLead).length > 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
                    {getCustomFields(selectedLead).map((field, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center text-xs gap-3">
                        <span className="font-bold text-slate-400">{field.label}</span>
                        <span className="font-mono text-slate-200 text-left bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700/30 break-all select-all font-semibold" dir="auto">
                          {typeof field.value === 'object' ? JSON.stringify(field.value) : String(field.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic bg-slate-900/10 border border-slate-800/40 p-3 rounded-xl">
                    لم تتلقَ هذه الاستمارة أي حقول مخصصة إضافية.
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-700/60 bg-slate-900/40 flex justify-between items-center gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                إغلاق المعاينة
              </button>

              <button
                onClick={(e) => handleDelete(selectedLead.id, e)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>حذف الطلب بشكل نهائي</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsInbox;

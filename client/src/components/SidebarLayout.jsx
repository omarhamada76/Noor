import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    {
      name: 'لوحة التحكم',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      name: 'صندوق الوارد',
      path: '/dashboard/leads',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      )
    },
    {
      name: 'إطلاق صفحة جديدة',
      path: '/dashboard/add',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
    }
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex relative overflow-hidden">
      {/* Desktop Sidebar (Floating right panel) */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-l border-slate-700/60 bg-[#1e293b] relative z-40">
        
        {/* App Branding */}
        <div className="p-5 h-20 flex items-center gap-3 border-b border-slate-700/40">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            <svg className="w-5 h-5 text-white stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 uppercase">
              منصة <span className="text-blue-400 font-extrabold">نور</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">لوحة المسؤول</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">القائمة الرئيسية</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group overflow-hidden ${
                  isActive
                    ? 'text-blue-400 bg-slate-900/40 border border-slate-700/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/20 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-3.5 bottom-3.5 w-[3px] bg-blue-500 rounded-full"></div>
                )}
                <span className={`transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-350'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Connection Details */}
        <div className="px-4 py-3.5 mx-3 mb-3 rounded-xl bg-slate-900/30 border border-slate-700/40 space-y-3">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">النطاق النشط</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-mono text-blue-400 truncate font-semibold" dir="ltr" title={window.location.host}>
                {window.location.host}
              </span>
            </div>
          </div>
          
          <div className="h-[1px] bg-slate-700/40"></div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">حالة قاعدة البيانات</p>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[11px] font-bold text-slate-400">مزامنة نشطة وآمنة</span>
            </div>
          </div>
        </div>

        {/* Admin User Account details and Logout */}
        <div className="p-3.5 border-t border-slate-700/40 bg-slate-900/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.email?.split('@')[0] || 'المسؤول'}</p>
              <p className="text-[10px] font-mono text-slate-500 truncate" dir="ltr">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="p-1.5 hover:bg-slate-800 border border-transparent hover:border-slate-700/40 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            title="تسجيل الخروج"
          >
            <svg className="w-4 h-4 stroke-[2] rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 18.1046 12.1046 19 11 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H11C12.1046 5 13 5.89543 13 7V8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-slate-700/60 bg-[#1e293b] flex items-center justify-between px-5 z-40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            ن
          </div>
          <span className="font-bold text-sm text-slate-200">منصة نور</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
        >
          {isMobileOpen ? (
            <svg className="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-[#0f172a] z-35 flex flex-col p-5 space-y-5">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">القائمة الرئيسية</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-blue-400 bg-slate-800 border border-slate-750'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-[1px] bg-slate-800"></div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">تفاصيل الاستضافة</p>
            <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div>
                <p className="text-[10px] text-slate-500">رابط النطاق</p>
                <p className="text-xs font-mono text-blue-400 font-semibold" dir="ltr">{window.location.host}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">الحساب النشط</p>
                <p className="text-xs font-semibold text-slate-300 truncate" dir="ltr">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-950/30 border border-red-500/20 hover:border-red-500/30 text-red-300 font-bold py-3 rounded-xl text-xs transition-colors"
            >
              <svg className="w-4 h-4 stroke-[2] rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 18.1046 12.1046 19 11 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H11C12.1046 5 13 5.89543 13 7V8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0 min-h-screen">
        <main className="flex-1 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;

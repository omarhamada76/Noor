import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-[400px] animate-[fadeIn_0.3s_ease-out]">
        
        {/* Simplified professional header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg mb-3">
            <svg className="w-6 h-6 text-white stroke-[2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            لوحة تحكم نور
          </h1>
          <p className="mt-1 text-slate-400 text-xs font-semibold">بوابة إطلاق وإدارة صفحات الهبوط للعملاء</p>
        </div>

        {/* Simplified Flat Slate Card */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-700/40 pb-4">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <svg className="w-4 h-4 text-blue-400 stroke-[2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11M5 11H19C20.1046 11 21 11.8954 21 13V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">دخول المسؤول</h2>
              <p className="text-[11px] text-slate-400">يرجى إدخال بيانات الاعتماد للوصول</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-400 shrink-0 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mr-1">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors z-10">
                  <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-10 pr-3.5 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-xs font-semibold text-left font-sans"
                  placeholder="admin@noor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mr-1">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors z-10">
                  <svg className="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11M5 11H19C20.1046 11 21 11.8954 21 13V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V13C3 11.8954 3.89543 11 5 11Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  dir="ltr"
                  className="w-full bg-[#0f172a] border border-slate-700/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-10 pr-3.5 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-all text-xs font-semibold text-left font-sans"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <svg className="w-3.5 h-3.5 stroke-[2.5] rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Clean Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-[10px] tracking-wide">
            نظام تشفير آمن وحماية متكاملة لمسؤول المنصة
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

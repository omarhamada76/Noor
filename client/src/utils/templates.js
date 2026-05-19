// Noor Page Builder - Premium Pre-made Arabic Tailwind Templates
export const templates = [
  {
    id: 'bio-link',
    title: 'رابط بيو ذكي احترافي (Smart Bio Link)',
    description: 'مثالي للمؤثرين وأصحاب المشاريع لعرض حسابات التواصل الاجتماعي واستقبال رسائل العملاء في صفحة واحدة جذابة.',
    badge: 'الأكثر شعبية',
    previewColor: 'from-[#0f172a] to-[#1e1b4b]',
    defaultTitle: 'روابط التواصل والاتصال - أحمد خالد',
    html: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Tajawal', sans-serif;
    }
  </style>
</head>
<body class="bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] text-slate-200 min-h-screen pb-16">
  
  <div class="max-w-md mx-auto px-4 pt-12 text-center">
    <!-- Profile Image Mockup -->
    <div class="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-xl">
      <div class="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-900">
        <span class="text-3xl">💼</span>
      </div>
      <span class="absolute bottom-0 right-0 bg-emerald-500 h-5.5 w-5.5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] p-0.5">✓</span>
    </div>

    <!-- Personal Name & Bio -->
    <h1 class="text-xl font-black text-white tracking-wide">المهندس أحمد خالد</h1>
    <p class="text-xs text-indigo-300 font-semibold mt-1">مستشار تطوير الأعمال والحلول الرقمية</p>
    <p class="text-xs text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed">
      أساعد الشركات الناشئة ورواد الأعمال على تنمية أعمالهم وتصميم استراتيجيات تسويقية رقمية مبتكرة.
    </p>

    <!-- Social / Contact Links List -->
    <div class="mt-8 space-y-3.5">
      
      <!-- WhatsApp Link Button -->
      <a href="https://wa.me/966500000000" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-950/20">
        <div class="flex items-center gap-3">
          <span class="text-xl">💬</span>
          <span class="text-xs">تواصل معي مباشرة عبر واتساب</span>
        </div>
        <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold">نشط الآن</span>
      </a>

      <!-- Portfolio Link Button -->
      <a href="#leads-section" className="flex items-center justify-between p-4 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-950/20">
        <div class="flex items-center gap-3">
          <span class="text-xl">📅</span>
          <span class="text-xs">احجز موعد استشارتك المجانية</span>
        </div>
        <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold">مجاني</span>
      </a>

      <!-- LinkedIn / Website Link Button -->
      <a href="https://linkedin.com" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-100 font-bold transition-all duration-300 transform hover:-translate-y-0.5">
        <div class="flex items-center gap-3">
          <span class="text-xl">🌐</span>
          <span class="text-xs">تصفح موقعي الشخصي ومعرض أعمالي</span>
        </div>
        <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>

    </div>

    <!-- Interactive Capture Form Section -->
    <div id="leads-section" class="mt-10 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 text-right shadow-2xl">
      <h3 class="text-sm font-bold text-white mb-1">دعنا نعمل معاً 🤝</h3>
      <p class="text-[11px] text-slate-450 mb-4 leading-relaxed">
        اترك اسمك ورقم هاتفك وسأتواصل معك شخصياً لمناقشة كيفية تسريع نمو مشروعك.
      </p>

      <form class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">الاسم الكريم</label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="مثال: محمد العتيبي" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">رقم الجوال أو واتساب</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            placeholder="مثال: +966500000000" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors text-right"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-indigo-950/50 active:scale-[0.98] transition-all duration-300 mt-2"
        >
          طلب استشارة تواصل مجانية
        </button>
      </form>
    </div>

    <!-- Small Footer Accent -->
    <div class="mt-12 text-[10px] text-slate-550 flex items-center justify-center gap-1">
      <span>تأسس الرابط بواسطة</span>
      <span class="font-bold text-blue-500">نور</span>
    </div>

  </div>

</body>
</html>`
  },
  {
    id: 'product-landing',
    title: 'صفحة هبوط لمنتج (Product Landing Page)',
    description: 'تصميم احترافي لعرض منتج واحد مميز مع تفاصيل الفوائد، وآراء العملاء، ونموذج سريع لطلب وحجز الشراء.',
    badge: 'الأكثر مبيعاً',
    previewColor: 'from-[#0f172a] to-[#064e3b]',
    defaultTitle: 'مجموعة العناية بالشعر الفاخرة',
    html: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Tajawal', sans-serif;
    }
  </style>
</head>
<body class="bg-[#0f172a] text-slate-300 min-h-screen">

  <!-- Promo Navbar -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold text-center py-2 shadow-md">
    🔥 عرض خاص لفترة محدودة: شحن مجاني لجميع مناطق المملكة اليوم فقط!
  </div>

  <div class="max-w-md mx-auto px-4 py-8 space-y-8">
    
    <!-- Hero Block -->
    <div class="text-center space-y-4">
      <div class="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
        ✨ المنتج الأصلي الأكثر طلباً
      </div>
      <h1 class="text-2xl font-black text-white leading-tight">مجموعة العناية العضوية المتكاملة لحيوية شعرك</h1>
      <p class="text-xs text-slate-400 leading-relaxed">
        تركيبة طبيعية 100% فريدة وغنية بالفيتامينات الأساسية لتقوية بصيلات الشعر وزيادة لمعانه وكثافته خلال 14 يوماً فقط!
      </p>
    </div>

    <!-- Product Image Mockup Banner -->
    <div class="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/10 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
      <div class="absolute top-4 left-4 bg-red-650 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-md animate-pulse">
        وفر 40%
      </div>
      <div class="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-850 shadow-2xl mb-4">
        <span class="text-5xl">🌿</span>
      </div>
      <div class="flex items-center justify-center gap-2">
        <span class="text-lg font-black text-white">199 ريال</span>
        <span class="text-xs text-slate-500 line-through">299 ريال</span>
      </div>
      <p class="text-[10px] text-emerald-400 font-bold mt-1">✓ متوفر في المستودع - جاهز للشحن السريع</p>
    </div>

    <!-- Features / Benefits List -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-1 mr-1">لماذا تختار هذه المجموعة؟</h3>
      
      <div class="flex gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-850">
        <span class="text-emerald-500 text-lg">✓</span>
        <div>
          <h4 class="text-xs font-bold text-white">خالٍ تماماً من السيليكون والبارابين</h4>
          <p class="text-[10px] text-slate-450 mt-0.5 leading-relaxed">تركيبة طبيعية آمنة للبشرة الحساسة ولجميع أنواع الشعر المعالج.</p>
        </div>
      </div>

      <div class="flex gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-850">
        <span class="text-emerald-500 text-lg">✓</span>
        <div>
          <h4 class="text-xs font-bold text-white">تغذية عميقة ومظهر صحي جذاب</h4>
          <p class="text-[10px] text-slate-450 mt-0.5 leading-relaxed">يقوي ألياف الشعر من الجذور حتى الأطراف ويمنع التقصف تماماً.</p>
        </div>
      </div>
    </div>

    <!-- Lead / Order capture Form -->
    <div id="order-form" class="p-5 rounded-3xl bg-slate-900 border border-emerald-500/20 text-right shadow-2xl space-y-4">
      <div>
        <h3 class="text-sm font-bold text-white mb-0.5">اطلب الآن قبل نفاد الكمية! 🛒</h3>
        <p class="text-[10px] text-slate-400 leading-relaxed">
          املأ بياناتك أدناه للتواصل معك وتأكيد العنوان لتوصيل شحنتك فوراً. الدفع عند الاستلام.
        </p>
      </div>

      <form class="space-y-3.5">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">اسمك الكامل</label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="الاسم الثلاثي" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">رقم الجوال لتأكيد الشحن</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            placeholder="مثال: +966500000000" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors text-right"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">المدينة وعنوان الشحن بالتفصيل</label>
          <textarea 
            name="address" 
            rows="2"
            required 
            placeholder="الرياض - حي الياسمين - شارع العليا" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/60 active:scale-[0.98] transition-all duration-300"
        >
          أريد الشراء الآن والدفع عند الاستلام
        </button>
      </form>
    </div>

    <!-- Small Testimonials Slider mock -->
    <div class="text-center space-y-3.5 bg-slate-900/30 p-4 rounded-2xl border border-slate-850">
      <span class="text-2xl text-yellow-500">★★★★★</span>
      <p class="text-[11px] text-slate-400 italic">
        "النتيجة فاقت توقعاتي تماماً! المنتج رائع ورائحة المجموعة خيالية، الشحن كان سريعاً واستلمتها في أقل من 24 ساعة."
      </p>
      <span class="block text-[9px] font-bold text-slate-500">- أم فيصل (عميلة مؤكدة)</span>
    </div>

  </div>

</body>
</html>`
  },
  {
    id: 'consult-booking',
    title: 'حجز استشارة وجدولة مواعيد (Consultation Booking)',
    description: 'مناسب للأطباء، والمحامين، والمدربين، والمستشارين المستقلين لحجز موعد جلسة وتدوين بيانات الاتصال بسهولة.',
    badge: 'تصميم فاخر',
    previewColor: 'from-[#0f172a] to-[#1e293b]',
    defaultTitle: 'طلب حجز جلسة استشارية خاصة',
    html: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Tajawal', sans-serif;
    }
  </style>
</head>
<body class="bg-[#0f172a] text-slate-350 min-h-screen">

  <div class="max-w-md mx-auto px-4 py-12 space-y-8">
    
    <!-- Professional Header Badge -->
    <div class="text-center space-y-3">
      <div class="w-20 h-20 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-xl">
        <span class="text-4xl">👨‍🏫</span>
      </div>
      <h1 class="text-xl font-bold text-white">احجز استشارتك الاستراتيجية الخاصة</h1>
      <p class="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto">
        جلسة تدريبية مكثفة عبر الفيديو مدتها 45 دقيقة لمناقشة أهدافك المهنية ووضع خريطة طريق متكاملة للنجاح.
      </p>
    </div>

    <!-- Booking Highlights -->
    <div class="grid grid-cols-3 gap-3 text-center">
      <div class="bg-slate-900/50 border border-slate-850 p-3 rounded-2xl">
        <span class="block text-lg">⏳</span>
        <span class="block text-[9px] font-bold text-slate-450 mt-1">45 دقيقة</span>
      </div>
      <div class="bg-slate-900/50 border border-slate-850 p-3 rounded-2xl">
        <span class="block text-lg">💻</span>
        <span class="block text-[9px] font-bold text-slate-450 mt-1">أونلاين (Zoom)</span>
      </div>
      <div class="bg-slate-900/50 border border-slate-850 p-3 rounded-2xl">
        <span class="block text-lg">💡</span>
        <span class="block text-[9px] font-bold text-slate-450 mt-1">حلول مخصصة</span>
      </div>
    </div>

    <!-- Form Section -->
    <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
      <div>
        <h3 class="text-sm font-bold text-white">تعبئة طلب الحجز 📅</h3>
        <p class="text-[10px] text-slate-500">سوف نقوم بالتواصل معك لتحديد موعد ومشاركتك رابط اللقاء.</p>
      </div>

      <form class="space-y-3.5">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">الاسم الكريم</label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="مثال: صالح الرويلي" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">رقم واتساب أو الجوال</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            placeholder="مثال: +966500000000" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none transition-colors text-right"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">البريد الإلكتروني</label>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="username@domain.com" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none transition-colors text-left"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 mr-1">نوع الاستشارة المطلوبة</label>
          <select 
            name="consultation_type" 
            class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none transition-colors"
          >
            <option>استشارة تسويق رقمي وتنمية مبيعات</option>
            <option>استشارة تأسيس وبناء وتدريب الشركات الناشئة</option>
            <option>جلسة إرشاد مهني وتطوير ذاتي</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-650 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-blue-950/60 active:scale-[0.98] transition-all duration-300"
        >
          تأكيد طلب حجز الاستشارة
        </button>
      </form>
    </div>

  </div>

</body>
</html>`
  }
];

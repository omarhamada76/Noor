import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { apiUrl } from '../api/config';

const PublicPage = () => {
  const { slug } = useParams();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicPage = async () => {
      try {
        setLoading(true);
        // Call the direct backend endpoint to fetch the public page by slug
        // and automatically trigger view count increments!
        const response = await api.get(`/pages/public/${slug}`);
        
        // Process page data and inject customized CSS, JS and Leads tracker
        const prepared = prepareHtml(response.data);
        setHtmlContent(prepared);
        
        // Dynamic tab title syncing
        if (response.data.meta_title || response.data.title) {
          document.title = response.data.meta_title || response.data.title;
        }

        // Dynamic description meta update
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = response.data.meta_description || 'صفحة هبوط احترافية تم إنشاؤها بواسطة تطبيق نور';

        setLoading(false);
      } catch (err) {
        console.error('Error fetching public landing page:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchPublicPage();
  }, [slug]);

  // Function to compile custom code, scripts, styles, and form interception before rendering
  const prepareHtml = (pageData) => {
    let rawHtml = pageData.html_content || '';

    // 1. Inject custom CSS styles
    if (pageData.custom_css) {
      const cssStyleTag = `<style id="noor-custom-css">\n${pageData.custom_css}\n</style>`;
      if (rawHtml.includes('</head>')) {
        rawHtml = rawHtml.replace('</head>', `${cssStyleTag}\n</head>`);
      } else {
        rawHtml = cssStyleTag + rawHtml;
      }
    }

    const leadsSubmitUrl = apiUrl('/leads/submit');

    // 2. Build and inject form interception script + user custom javascript
    const interceptScript = `
<script id="noor-form-interceptor">
  (function() {
    // A. Intercept contact form submits automatically
    document.addEventListener('submit', function(e) {
      const form = e.target;
      e.preventDefault();

      // Serialize input elements into flat data JSON
      const formData = {};
      const elements = form.querySelectorAll('input, textarea, select');
      elements.forEach(function(el) {
        if (!el.name) return;
        if (el.type === 'checkbox') {
          formData[el.name] = el.checked;
        } else if (el.type === 'radio') {
          if (el.checked) {
            formData[el.name] = el.value;
          }
        } else {
          formData[el.name] = el.value;
        }
      });

      // Append page slug to associate lead in the database
      formData['_slug'] = window.location.pathname.split('/').pop();

      // Visual button loading feedback
      const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('button');
      const originalText = submitBtn ? submitBtn.innerText : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'جاري إرسال معلوماتك...';
      }

      // POST lead data to server
      fetch('${leadsSubmitUrl}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }

        // Show premium alert popover
        const alertEl = document.createElement('div');
        alertEl.style.position = 'fixed';
        alertEl.style.bottom = '32px';
        alertEl.style.left = '50%';
        alertEl.style.transform = 'translateX(-50%)';
        alertEl.style.backgroundColor = '#059669'; // Emerald-600
        alertEl.style.color = '#ffffff';
        alertEl.style.padding = '14px 28px';
        alertEl.style.borderRadius = '16px';
        alertEl.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.1)';
        alertEl.style.fontSize = '14px';
        alertEl.style.fontWeight = '600';
        alertEl.style.zIndex = '999999';
        alertEl.style.direction = 'rtl';
        alertEl.style.fontFamily = 'Tajawal, system-ui, sans-serif';
        alertEl.style.transition = 'all 0.3s ease';
        alertEl.innerText = data.message || 'تم إرسال معلوماتك بنجاح! شكرًا لك.';

        document.body.appendChild(alertEl);
        form.reset();

        setTimeout(function() {
          alertEl.style.opacity = '0';
          setTimeout(function() {
            alertEl.remove();
          }, 300);
        }, 3500);
      })
      .catch(function(err) {
        console.error('Lead submitting error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
        alert('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى إعادة المحاولة.');
      });
    });

    // B. Inject custom javascript provided by the user
    try {
      ${pageData.custom_js || ''}
    } catch (err) {
      console.error('Error executing landing custom js:', err);
    }
  })();
</script>
`;

    if (rawHtml.includes('</body>')) {
      rawHtml = rawHtml.replace('</body>', `${interceptScript}\n</body>`);
    } else {
      rawHtml = rawHtml + interceptScript;
    }

    return rawHtml;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium">جاري تحميل صفحة نور الهبوط...</p>
      </div>
    );
  }

  if (error || !htmlContent) {
    return (
      <div className="min-h-screen bg-[#060814] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(239,68,68,0.1),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-2xl mb-6 animate-bounce">
          ⚠️
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">الصفحة غير موجودة</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-md">
          الرابط المطلوب <code className="text-indigo-400 font-mono">/{slug}</code> غير موجود أو قد تم تعطيله من قِبل المشرف.
        </p>
        <Link
          to="/"
          className="mt-8 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-300 active:scale-95"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  // Render raw HTML using fully isolated iframe to allow native Javascript, CSS styling, responsive viewports, and custom media.
  return (
    <iframe
      title="Noor Public Viewer"
      srcDoc={htmlContent}
      className="w-screen h-screen border-none m-0 p-0 block bg-white"
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
    />
  );
};

export default PublicPage;

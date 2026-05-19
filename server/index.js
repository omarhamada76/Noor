const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const leadRoutes = require('./routes/leads');
const initDatabase = require('./config/initDb');
const db = require('./config/db');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;

// Middleware
app.use(cors({ origin: corsOrigins, credentials: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use(express.json({ limit: '10mb' })); // Support larger HTML content payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/leads', leadRoutes);

// Optional: serve built client when frontend and API share one host
if (process.env.SERVE_CLIENT === 'true') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Server-Side Dynamic SEO (only when SERVE_CLIENT=true)
app.get('/p/:slug', async (req, res) => {
  if (process.env.SERVE_CLIENT !== 'true') {
    return res.status(404).json({ message: 'Not found' });
  }
  const { slug } = req.params;
  const cleanSlug = slug.trim().toLowerCase();

  try {
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    
    // If the built file doesn't exist, we can't rewrite it. Send 404 or a fallback
    if (!fs.existsSync(indexPath)) {
      return res.status(503).send('Client build files not ready yet.');
    }

    // Fetch page SEO metadata from database
    const [pages] = await db.query(
      'SELECT title, meta_title, meta_description FROM pages WHERE slug = ?',
      [cleanSlug]
    );

    let html = fs.readFileSync(indexPath, 'utf8');

    if (pages.length > 0) {
      const page = pages[0];
      const finalTitle = page.meta_title || page.title || 'Noor Page Builder';
      const finalDesc = page.meta_description || 'صفحة هبوط احترافية تم إنشاؤها بواسطة تطبيق نور';

      // 1. Rewrite <title> tags
      html = html.replace(/<title>.*?<\/title>/gi, `<title>${finalTitle}</title>`);

      // 2. Rewrite or Inject description meta tags
      if (html.includes('<meta name="description"')) {
        html = html.replace(/<meta name="description".*?>/gi, `<meta name="description" content="${finalDesc}">`);
      } else {
        html = html.replace(/<\/head>/i, `<meta name="description" content="${finalDesc}">\n</head>`);
      }
    }

    res.send(html);

  } catch (err) {
    console.error('Server SEO interceptor error:', err);
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

// SPA fallback when frontend is served from the same host
if (process.env.SERVE_CLIENT === 'true') {
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ message: 'API Route Not Found' });
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Initialize Database and Start Server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Noor Server running in environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Backend Listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize database. Server not started:', err);
});

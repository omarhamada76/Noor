const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Helper to validate slug (alphanumeric and dashes/underscores)
const isValidSlug = (slug) => {
  return /^[a-zA-Z0-9-_]+$/.test(slug);
};

// 1. GET /api/pages (Protected) - List all pages (without long html_content to optimize bandwidth)
router.get('/', auth, async (req, res) => {
  try {
    const [pages] = await db.query(
      'SELECT id, slug, title, views, created_at, updated_at FROM pages ORDER BY created_at DESC'
    );
    res.json(pages);
  } catch (err) {
    console.error('Fetch pages error:', err);
    res.status(500).json({ message: 'Error fetching pages.' });
  }
});

// 2. GET /api/pages/:id (Protected) - Get single page complete info
router.get('/:id', auth, async (req, res) => {
  try {
    const [pages] = await db.query('SELECT * FROM pages WHERE id = ?', [req.params.id]);
    if (pages.length === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }
    res.json(pages[0]);
  } catch (err) {
    console.error('Fetch single page error:', err);
    res.status(500).json({ message: 'Error fetching page details.' });
  }
});

// 3. POST /api/pages (Protected) - Create new page
router.post('/', auth, async (req, res) => {
  const { slug, title, html_content, meta_title, meta_description, custom_css, custom_js } = req.body;

  if (!slug || !html_content) {
    return res.status(400).json({ message: 'Slug and HTML content are required.' });
  }

  const cleanSlug = slug.trim().toLowerCase();

  if (!isValidSlug(cleanSlug)) {
    return res.status(400).json({ message: 'Slug must contain only alphanumeric characters, dashes, or underscores.' });
  }

  try {
    // Check if slug already exists
    const [existing] = await db.query('SELECT id FROM pages WHERE slug = ?', [cleanSlug]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'A page with this URL slug already exists.' });
    }

    const [result] = await db.query(
      'INSERT INTO pages (slug, title, html_content, meta_title, meta_description, custom_css, custom_js) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cleanSlug, title || cleanSlug, html_content, meta_title || null, meta_description || null, custom_css || null, custom_js || null]
    );

    res.status(201).json({
      message: 'Page created successfully!',
      pageId: result.insertId,
      slug: cleanSlug
    });
  } catch (err) {
    console.error('Create page error:', err);
    res.status(500).json({ message: 'Error saving the landing page.' });
  }
});

// 4. PUT /api/pages/:id (Protected) - Update page
router.put('/:id', auth, async (req, res) => {
  const { slug, title, html_content, meta_title, meta_description, custom_css, custom_js } = req.body;

  if (!slug || !html_content) {
    return res.status(400).json({ message: 'Slug and HTML content are required.' });
  }

  const cleanSlug = slug.trim().toLowerCase();

  if (!isValidSlug(cleanSlug)) {
    return res.status(400).json({ message: 'Slug must contain only alphanumeric characters, dashes, or underscores.' });
  }

  try {
    // Check if slug already exists on a DIFFERENT page
    const [existing] = await db.query('SELECT id FROM pages WHERE slug = ? AND id != ?', [cleanSlug, req.params.id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'A page with this URL slug already exists.' });
    }

    const [result] = await db.query(
      'UPDATE pages SET slug = ?, title = ?, html_content = ?, meta_title = ?, meta_description = ?, custom_css = ?, custom_js = ? WHERE id = ?',
      [cleanSlug, title || cleanSlug, html_content, meta_title || null, meta_description || null, custom_css || null, custom_js || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }

    res.json({ message: 'Page updated successfully!' });
  } catch (err) {
    console.error('Update page error:', err);
    res.status(500).json({ message: 'Error updating the landing page.' });
  }
});

// 5. DELETE /api/pages/:id (Protected) - Delete page
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM pages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }
    res.json({ message: 'Page deleted successfully!' });
  } catch (err) {
    console.error('Delete page error:', err);
    res.status(500).json({ message: 'Error deleting the landing page.' });
  }
});

// 6. GET /api/pages/public/:slug (Public) - Public page access (no auth, increments views)
router.get('/public/:slug', async (req, res) => {
  const { slug } = req.params;
  const cleanSlug = slug.trim().toLowerCase();

  try {
    const [pages] = await db.query('SELECT title, html_content, meta_title, meta_description, custom_css, custom_js FROM pages WHERE slug = ?', [cleanSlug]);
    if (pages.length === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }

    // Atomically increment views in the background
    db.query('UPDATE pages SET views = views + 1 WHERE slug = ?', [cleanSlug]).catch(err => {
      console.error('Error incrementing views:', err);
    });

    res.json(pages[0]);
  } catch (err) {
    console.error('Fetch public page error:', err);
    res.status(500).json({ message: 'Error loading the page.' });
  }
});

module.exports = router;

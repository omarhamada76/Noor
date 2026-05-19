const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// 1. POST /api/leads/submit (Public) - Receive contact form submits from landing pages
router.post('/submit', async (req, res) => {
  const payload = req.body;
  const slug = payload._slug || payload.page_slug;

  if (!slug) {
    return res.status(400).json({ message: 'Page identifier (_slug or page_slug) is required to capture a lead.' });
  }

  const cleanSlug = slug.trim().toLowerCase();

  try {
    // 1. Resolve page ID from slug
    const [pages] = await db.query('SELECT id FROM pages WHERE slug = ?', [cleanSlug]);
    if (pages.length === 0) {
      return res.status(404).json({ message: `Landing page with slug /${cleanSlug} not found.` });
    }
    const pageId = pages[0].id;

    // 2. Dynamically extract common fields
    const nameKeys = ['name', 'الاسم', 'اسم', 'full_name', 'fullname', 'username', 'client_name'];
    const emailKeys = ['email', 'البريد', 'البريد الإلكتروني', 'البريد الالكتروني', 'mail', 'email_address'];
    const phoneKeys = ['phone', 'الهاتف', 'رقم الهاتف', 'تلفون', 'tel', 'mobile', 'cell', 'جوال', 'رقم الجوال'];
    const messageKeys = ['message', 'الرسالة', 'رسالة', 'notes', 'تعليق', 'comment', 'ملاحظات'];

    let name = null;
    let email = null;
    let phone = null;
    let message = null;

    // Search case-insensitively
    for (const key of Object.keys(payload)) {
      if (key.startsWith('_')) continue; // Skip helper keys
      const lowerKey = key.toLowerCase().trim();
      const val = payload[key] ? String(payload[key]).trim() : null;

      if (!val) continue;

      if (nameKeys.includes(lowerKey) || nameKeys.some(k => lowerKey.includes(k))) {
        if (!name) name = val;
      } else if (emailKeys.includes(lowerKey) || emailKeys.some(k => lowerKey.includes(k))) {
        if (!email) email = val;
      } else if (phoneKeys.includes(lowerKey) || phoneKeys.some(k => lowerKey.includes(k))) {
        if (!phone) phone = val;
      } else if (messageKeys.includes(lowerKey) || messageKeys.some(k => lowerKey.includes(k))) {
        if (!message) message = val;
      }
    }

    // 3. Keep a serialized JSON payload of the entire request body to save custom attributes
    const extraData = JSON.stringify(payload);

    // 4. Save into database
    await db.query(
      'INSERT INTO leads (page_id, name, email, phone, message, data) VALUES (?, ?, ?, ?, ?, ?)',
      [pageId, name, email, phone, message, extraData]
    );

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح وسنقوم بالتواصل معك قريباً!'
    });

  } catch (err) {
    console.error('Lead capture error:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء حفظ رسالتك. يرجى المحاولة مرة أخرى.' });
  }
});

// 2. GET /api/leads (Protected) - List all received leads for admin
router.get('/', auth, async (req, res) => {
  try {
    const [leads] = await db.query(`
      SELECT l.*, p.title AS page_title, p.slug AS page_slug 
      FROM leads l
      JOIN pages p ON l.page_id = p.id
      ORDER BY l.created_at DESC
    `);
    res.json(leads);
  } catch (err) {
    console.error('Fetch leads error:', err);
    res.status(500).json({ message: 'Error fetching leads inbox.' });
  }
});

// 3. DELETE /api/leads/:id (Protected) - Delete single lead from inbox
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.json({ message: 'تم حذف الرسالة بنجاح.' });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ message: 'Error deleting lead.' });
  }
});

module.exports = router;

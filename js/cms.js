/**
 * CMS adapter — a Google Sheet as the content backend. Free, no API key,
 * no login. Each row in the sheet is one blog post.
 *
 * Set GSHEET_ID below (and GSHEET_GID if your posts aren't on the first tab)
 * once you've made your sheet. Leave GSHEET_ID null to keep running on the
 * local demo data in js/posts.js. See setup notes at the bottom of this file.
 *
 * Expected columns (any order, matched by header name — case-insensitive):
 *   slug | title | excerpt | category | author | date | coverImage | content
 * "content" is written in Markdown (headings, **bold**, *italic*, links,
 * bullet lists, blank-line paragraphs, > blockquotes).
 */
const GSHEET_ID = "1vF0H02gOCkeuuFkGzS4sAoEXH6-xrrSg6OTt-FIL2Ys";
const GSHEET_GID = "0"; // the tab's gid, "0" is the first tab

/**
 * Write path for the admin page (admin.html). This points at a small Google
 * Apps Script Web App bound to the same sheet — free, no API key, nothing to
 * host. See "Apps Script setup" notes at the bottom of this file.
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyFhsj3b8ROrK7JlBJ0uxMXPcDg--fZ9Ux1b1pdoF5QLz8X7XWBylQSfg391IhpNYuf/exec";
const ADMIN_SECRET = "Password"; // must match SHARED_SECRET in the Apps Script

let cachedRows = null;

function gsheetCsvUrl() {
  return `https://docs.google.com/spreadsheets/d/${GSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GSHEET_GID}`;
}

/** Parses RFC4180-ish CSV (quoted fields, embedded commas/newlines, "" escapes). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip, \n handles the row break
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).filter((r) => r.some((c) => c.trim() !== "")).map((r) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (r[i] || "").trim()));
    return obj;
  });
}

async function loadSheetRows() {
  if (cachedRows) return cachedRows;
  const res = await fetch(gsheetCsvUrl());
  if (!res.ok) throw new Error("Failed to load posts from Google Sheets — check the sheet is shared as 'Anyone with the link can view'.");
  const text = await res.text();
  cachedRows = rowsToObjects(parseCsv(text));
  return cachedRows;
}

/**
 * Normalizes an image URL so common copy-paste mistakes still work:
 * - A Google Drive "share" link (view page, not raw bytes) is rewritten to
 *   the direct-image host.
 * - A local file:// path (only exists on the editor's own computer) is
 *   dropped, since no other viewer could ever load it.
 */
function resolveImageUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith("file://")) return "";

  const patterns = [/drive\.google\.com\/file\/d\/([^/?]+)/, /drive\.google\.com\/open\?id=([^&]+)/, /[?&]id=([^&]+)/];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match && trimmed.includes("drive.google.com")) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return trimmed;
}

/** Minimal Markdown → HTML renderer (headings, bold/italic, links, images, lists, blockquotes, paragraphs). */
function renderMarkdown(md) {
  if (!md) return "";
  const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function inline(text) {
    let html = escapeHtml(text);
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => `<img src="${resolveImageUrl(url)}" alt="${alt}" loading="lazy" />`);
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return html;
  }

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const htmlParts = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      htmlParts.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      htmlParts.push(`<blockquote>${inline(quoteLines.join(" "))}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i++;
      }
      htmlParts.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const paraLines = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6})\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^[-*]\s+/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    htmlParts.push(`<p>${inline(paraLines.join(" "))}</p>`);
  }

  return htmlParts.join("");
}

function estimateReadTime(plainText) {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes >= 15 ? "15+ min" : `${minutes} min`;
}

function normalizeSheetRow(row) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || row.content.slice(0, 160),
    category: row.category || "General",
    categoryId: row.category || null,
    date: row.date || new Date().toISOString(),
    readTime: estimateReadTime(row.content || ""),
    author: row.author || "Adamas Tech",
    coverImage: resolveImageUrl(row.coverimage) || "assets/card-photo-1.jpg",
    content: renderMarkdown(row.content || ""),
  };
}

async function cmsFetchCategories() {
  if (!GSHEET_ID) {
    // Demo data uses this fixed set of 4 pills.
    return CATEGORIES.map((name) => ({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, "-") }));
  }
  // Live mode: pills are derived from whatever categories actually appear in the sheet.
  const rows = await loadSheetRows();
  const seen = new Set();
  const categories = [];
  rows.forEach((r) => {
    const name = (r.category || "").trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      categories.push({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, "-") });
    }
  });
  return categories;
}

async function cmsFetchPosts({ categoryId = null, page = 1, perPage = 6 } = {}) {
  if (!GSHEET_ID) {
    let posts = getAllPosts();
    if (categoryId) posts = posts.filter((p) => p.category === categoryId);
    const start = (page - 1) * perPage;
    return { posts: posts.slice(start, start + perPage), totalPages: Math.max(1, Math.ceil(posts.length / perPage)) };
  }
  const rows = await loadSheetRows();
  let posts = rows.map(normalizeSheetRow).sort((a, b) => new Date(b.date) - new Date(a.date));
  if (categoryId) posts = posts.filter((p) => p.category === categoryId);
  const start = (page - 1) * perPage;
  return { posts: posts.slice(start, start + perPage), totalPages: Math.max(1, Math.ceil(posts.length / perPage)) };
}

async function cmsFetchPostBySlug(slug) {
  if (!GSHEET_ID) {
    return getPostBySlug(slug) || null;
  }
  const rows = await loadSheetRows();
  const row = rows.find((r) => r.slug === slug);
  return row ? normalizeSheetRow(row) : null;
}

async function cmsFetchRelatedPosts(post, limit = 3) {
  if (!GSHEET_ID) {
    return getRelatedPosts(post.slug, limit);
  }
  const rows = await loadSheetRows();
  return rows
    .filter((r) => r.slug !== post.slug && (!post.categoryId || r.category === post.categoryId))
    .slice(0, limit)
    .map(normalizeSheetRow);
}

/**
 * Used by admin.html to publish a new post. Sends a plain-text body (not
 * application/json) on purpose — that keeps it a CORS "simple request" so
 * the browser doesn't need to preflight against Apps Script, which doesn't
 * handle OPTIONS requests.
 */
async function cmsCreatePost(fields) {
  if (!APPS_SCRIPT_URL) {
    throw new Error("APPS_SCRIPT_URL isn't set yet — see the Apps Script setup notes in js/cms.js.");
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...fields, secret: ADMIN_SECRET }),
  });
  const data = await res.json().catch(() => ({ ok: false, error: "Unexpected response from Apps Script" }));
  if (!data.ok) throw new Error(data.error || "Failed to publish post");
  cachedRows = null; // force a fresh read next time posts are listed
  return data;
}

/**
 * ── Google Sheets setup notes ───────────────────────────────────────────
 * 1. Create a Google Sheet. First row = headers, one column per field:
 *      slug | title | excerpt | category | author | date | coverImage | content
 *    - slug: URL-safe id, e.g. "five-marketing-trends" (no spaces)
 *    - category: must exactly match one of the 4 pills — Future of Search,
 *      Digital Marketing, Paid Ads, Industrial Sales
 *    - date: any format like 2025-02-14
 *    - coverImage: a public image URL
 *    - content: written in Markdown — blank line between paragraphs,
 *      "# Heading", "**bold**", "*italic*", "- bullet", "> quote"
 * 2. Share → General access → "Anyone with the link" → Viewer.
 * 3. Copy the Sheet ID from its URL:
 *      docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
 * 4. Paste it into GSHEET_ID above. If your posts are on a tab other than
 *    the first one, open that tab and copy the "gid=..." number from the
 *    URL into GSHEET_GID.
 *
 * ── Apps Script setup (lets admin.html publish posts) ──────────────────
 * 1. Open your sheet → Extensions → Apps Script.
 * 2. Delete any starter code and paste this in:
 *
 *      const SHEET_NAME = "Sheet1";      // your tab's name
 *      const SHARED_SECRET = "changeme"; // must match ADMIN_SECRET above
 *
 *      function doPost(e) {
 *        try {
 *          const payload = JSON.parse(e.postData.contents);
 *          if (payload.secret !== SHARED_SECRET) {
 *            return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Unauthorized" }))
 *              .setMimeType(ContentService.MimeType.JSON);
 *          }
 *          const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
 *          const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
 *            .map((h) => h.toString().trim().toLowerCase());
 *          const row = headers.map((h) => payload[h] || "");
 *          sheet.appendRow(row);
 *          return ContentService.createTextOutput(JSON.stringify({ ok: true }))
 *            .setMimeType(ContentService.MimeType.JSON);
 *        } catch (err) {
 *          return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
 *            .setMimeType(ContentService.MimeType.JSON);
 *        }
 *      }
 *
 * 3. Change SHARED_SECRET to something only your team knows (a simple
 *    shared password — this isn't bank-grade security, just enough to stop
 *    a random person who finds the URL from posting spam).
 * 4. Deploy → New deployment → gear icon → "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, authorize it with your Google account, then copy the
 *    "Web app URL" (ends in /exec).
 * 5. Paste that URL into APPS_SCRIPT_URL above, and set ADMIN_SECRET to the
 *    same value you used for SHARED_SECRET in step 3.
 * 6. If you ever edit the script, you must create a new deployment (or
 *    "Manage deployments" → edit → new version) for changes to go live.
 */

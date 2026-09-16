/**
 * CMS adapter — WordPress REST API as the content backend.
 * Posts are written in wp-admin like normal; this site just reads them.
 *
 * Leave WP_API_BASE null to run on local demo data from js/posts.js instead
 * (useful for previewing this frontend without a live WordPress site).
 */
const WP_API_BASE = "https://adamastechconsulting.com/wp-json/wp/v2";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}

function estimateReadTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes >= 15 ? "15+ min" : `${minutes} min`;
}

function normalizeWpPost(wp) {
  const embedded = wp._embedded || {};
  const media = embedded["wp:featuredmedia"] && embedded["wp:featuredmedia"][0];
  const terms = embedded["wp:term"] ? embedded["wp:term"].flat() : [];
  const category = terms.find((t) => t.taxonomy === "category");
  const author = embedded.author && embedded.author[0];

  return {
    slug: wp.slug,
    title: stripHtml(wp.title.rendered),
    excerpt: stripHtml(wp.excerpt.rendered),
    category: category ? category.name : "General",
    categoryId: category ? category.id : null,
    date: wp.date,
    readTime: estimateReadTime(wp.content.rendered),
    author: author ? author.name : "Adamas Tech",
    coverImage: media ? media.source_url : "assets/card-photo-1.jpg",
    content: wp.content.rendered,
  };
}

async function cmsFetchCategories() {
  if (!WP_API_BASE) {
    return CATEGORIES.map((name) => ({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, "-") }));
  }
  const res = await fetch(`${WP_API_BASE}/categories?per_page=50&hide_empty=true`);
  if (!res.ok) throw new Error("Failed to load categories from WordPress");
  const data = await res.json();
  return data.filter((c) => c.slug !== "uncategorized").map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

async function cmsFetchPosts({ categoryId = null, page = 1, perPage = 6 } = {}) {
  if (!WP_API_BASE) {
    let posts = getAllPosts();
    if (categoryId) posts = posts.filter((p) => p.category === categoryId);
    const start = (page - 1) * perPage;
    return { posts: posts.slice(start, start + perPage), totalPages: Math.max(1, Math.ceil(posts.length / perPage)) };
  }
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage), _embed: "1" });
  if (categoryId) params.set("categories", String(categoryId));
  const res = await fetch(`${WP_API_BASE}/posts?${params}`);
  if (!res.ok) throw new Error("Failed to load posts from WordPress");
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
  const data = await res.json();
  return { posts: data.map(normalizeWpPost), totalPages };
}

async function cmsFetchPostBySlug(slug) {
  if (!WP_API_BASE) {
    return getPostBySlug(slug) || null;
  }
  const res = await fetch(`${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
  if (!res.ok) throw new Error("Failed to load post from WordPress");
  const data = await res.json();
  return data[0] ? normalizeWpPost(data[0]) : null;
}

async function cmsFetchRelatedPosts(post, limit = 3) {
  if (!WP_API_BASE) {
    return getRelatedPosts(post.slug, limit);
  }
  const params = new URLSearchParams({ per_page: String(limit + 1), _embed: "1" });
  if (post.categoryId) params.set("categories", String(post.categoryId));
  const res = await fetch(`${WP_API_BASE}/posts?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data
    .filter((p) => p.slug !== post.slug)
    .slice(0, limit)
    .map(normalizeWpPost);
}

/**
 * ── WordPress setup notes ────────────────────────────────────────────────
 * 1. wp-admin → Settings → Permalinks → "Post name" (clean slugs, needed
 *    for the REST API to work well).
 * 2. wp-admin → Posts → Categories → create the categories you want as
 *    filter pills. They show up here automatically, no code changes.
 * 3. Set a Featured Image on every post — it becomes the blog card photo.
 * 4. This site is hosted on a different domain (GitHub Pages) than
 *    WordPress, so the browser will block the request unless WordPress
 *    allows it. Add this to your theme's functions.php:
 *
 *      add_action('rest_api_init', function () {
 *        header('Access-Control-Allow-Origin: *');
 *      });
 *
 *    (If you ever host this blog on the same domain as WordPress instead
 *    of GitHub Pages, this step becomes unnecessary.)
 */

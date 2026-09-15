(function () {
  const form = document.getElementById("postForm");
  const titleField = document.getElementById("fieldTitle");
  const slugField = document.getElementById("fieldSlug");
  const categoryField = document.getElementById("fieldCategory");
  const categoryOptions = document.getElementById("categoryOptions");
  const dateField = document.getElementById("fieldDate");
  const coverField = document.getElementById("fieldCoverImage");
  const coverPreview = document.getElementById("coverPreview");
  const contentField = document.getElementById("fieldContent");
  const slugWarning = document.getElementById("slugWarning");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const togglePreviewBtn = document.getElementById("togglePreview");
  const previewPane = document.getElementById("previewPane");

  let slugManuallyEdited = false;
  let existingSlugs = new Set();

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  dateField.value = new Date().toISOString().slice(0, 10);

  titleField.addEventListener("input", () => {
    if (!slugManuallyEdited) {
      slugField.value = slugify(titleField.value);
      checkSlug();
    }
  });

  slugField.addEventListener("input", () => {
    slugManuallyEdited = true;
    checkSlug();
  });

  function checkSlug() {
    const slug = slugField.value.trim();
    slugWarning.hidden = !slug || !existingSlugs.has(slug);
  }

  coverField.addEventListener("input", () => {
    const url = coverField.value.trim();
    const resolved = typeof resolveImageUrl === "function" ? resolveImageUrl(url) : url;
    if (resolved) {
      coverPreview.src = resolved;
      coverPreview.hidden = false;
    } else {
      coverPreview.hidden = true;
    }
  });
  coverPreview.addEventListener("error", () => {
    coverPreview.hidden = true;
  });

  document.querySelectorAll(".admin-toolbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      insertMarkdown(btn.dataset.md);
    });
  });

  function insertMarkdown(kind) {
    const el = contentField;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || "text";
    let before = "",
      after = "";

    if (kind === "bold") {
      before = "**";
      after = "**";
    } else if (kind === "italic") {
      before = "*";
      after = "*";
    } else if (kind === "h2") {
      before = "\n## ";
      after = "\n";
    } else if (kind === "link") {
      before = "[";
      after = "](https://)";
    } else if (kind === "ul") {
      before = "\n- ";
      after = "";
    } else if (kind === "quote") {
      before = "\n> ";
      after = "";
    }

    const newValue = el.value.slice(0, start) + before + selected + after + el.value.slice(end);
    el.value = newValue;
    el.focus();
    const cursor = start + before.length + selected.length;
    el.setSelectionRange(cursor, cursor);
  }

  togglePreviewBtn.addEventListener("click", () => {
    const showing = !previewPane.hidden;
    if (showing) {
      previewPane.hidden = true;
      togglePreviewBtn.textContent = "Show preview";
    } else {
      previewPane.innerHTML = typeof renderMarkdown === "function" ? renderMarkdown(contentField.value) : contentField.value;
      previewPane.hidden = false;
      togglePreviewBtn.textContent = "Hide preview";
    }
  });

  function showStatus(kind, message) {
    statusEl.hidden = false;
    statusEl.className = `admin-status admin-status--${kind}`;
    statusEl.textContent = message;
  }

  async function init() {
    try {
      const categories = await cmsFetchCategories();
      categoryOptions.innerHTML = categories.map((c) => `<option value="${c.name}"></option>`).join("");
    } catch (err) {
      console.error("Couldn't load existing categories", err);
    }

    if (typeof GSHEET_ID !== "undefined" && GSHEET_ID) {
      try {
        const rows = await loadSheetRows();
        existingSlugs = new Set(rows.map((r) => r.slug));
      } catch (err) {
        console.error("Couldn't load existing posts to check slugs", err);
      }
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof APPS_SCRIPT_URL === "undefined" || !APPS_SCRIPT_URL) {
      showStatus("error", "This form isn't connected yet — APPS_SCRIPT_URL is not set in js/cms.js. See the Apps Script setup notes at the bottom of that file.");
      return;
    }

    const slug = slugField.value.trim();
    if (!slug) {
      showStatus("error", "Please add a URL slug.");
      return;
    }
    if (existingSlugs.has(slug)) {
      showStatus("error", `The slug "${slug}" is already used by another post. Please choose a different one.`);
      return;
    }

    const payload = {
      title: titleField.value.trim(),
      slug,
      excerpt: document.getElementById("fieldExcerpt").value.trim(),
      category: categoryField.value.trim(),
      author: document.getElementById("fieldAuthor").value.trim(),
      date: dateField.value,
      coverimage: coverField.value.trim(),
      content: contentField.value,
    };

    submitBtn.disabled = true;
    showStatus("loading", "Publishing…");

    try {
      await cmsCreatePost(payload);
      showStatus("success", `Published! "${payload.title}" is now live on the blog.`);
      existingSlugs.add(slug);
      form.reset();
      slugManuallyEdited = false;
      dateField.value = new Date().toISOString().slice(0, 10);
      coverPreview.hidden = true;
      previewPane.hidden = true;
      togglePreviewBtn.textContent = "Show preview";
    } catch (err) {
      console.error(err);
      showStatus("error", err.message || "Something went wrong publishing this post.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  init();
})();

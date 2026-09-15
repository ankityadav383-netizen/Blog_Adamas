(function () {
  const PAGE_SIZE = 6;

  const grid = document.getElementById("blogGrid");
  const filterNav = document.getElementById("categoryFilter");
  const loadMoreWrap = document.getElementById("loadMoreWrap");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let activeCategoryId = null;
  let currentPage = 1;
  let totalPages = 1;
  let loadedPosts = [];

  function cardTemplate(post) {
    return `
      <article class="blog-card" data-slug="${post.slug}">
        <div class="blog-card__image">
          <img src="${post.coverImage}" alt="" loading="lazy" />
        </div>
        <div class="blog-card__meta">
          <span>${post.category}</span>
          <span class="dot"></span>
          <span>${formatDate(post.date)}</span>
          <span class="dot"></span>
          <span>${post.readTime}</span>
        </div>
        <p class="blog-card__title">${post.title}</p>
        <p class="blog-card__author">-${post.author}</p>
      </article>
    `;
  }

  function renderGrid() {
    if (loadedPosts.length === 0) {
      grid.innerHTML = `<p class="empty-state">No posts in this category yet.</p>`;
      loadMoreWrap.style.display = "none";
      return;
    }

    grid.innerHTML = loadedPosts.map(cardTemplate).join("");

    grid.querySelectorAll(".blog-card").forEach((card) => {
      card.addEventListener("click", () => {
        window.location.href = `post.html?slug=${encodeURIComponent(card.dataset.slug)}`;
      });
    });

    loadMoreWrap.style.display = currentPage >= totalPages ? "none" : "flex";
  }

  async function loadPage(page) {
    const { posts, totalPages: tp } = await cmsFetchPosts({
      categoryId: activeCategoryId,
      page,
      perPage: PAGE_SIZE,
    });
    totalPages = tp;
    currentPage = page;
    loadedPosts = page === 1 ? posts : loadedPosts.concat(posts);
    renderGrid();
  }

  async function renderFilters() {
    const categories = await cmsFetchCategories();
    filterNav.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "pill";
      btn.textContent = cat.name;
      btn.setAttribute("aria-pressed", String(activeCategoryId === cat.id));
      btn.addEventListener("click", () => {
        activeCategoryId = activeCategoryId === cat.id ? null : cat.id;
        [...filterNav.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
        if (activeCategoryId) btn.setAttribute("aria-pressed", "true");
        loadPage(1).catch(showError);
      });
      filterNav.appendChild(btn);
    });
  }

  function showError(err) {
    console.error(err);
    grid.innerHTML = `<p class="empty-state">Couldn't load posts right now. Please try again shortly.</p>`;
    loadMoreWrap.style.display = "none";
  }

  loadMoreBtn.addEventListener("click", () => {
    loadPage(currentPage + 1).catch(showError);
  });

  renderFilters().catch(showError);
  loadPage(1).catch(showError);
})();

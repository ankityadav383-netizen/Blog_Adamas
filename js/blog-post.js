(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  async function init() {
    const post = (slug && (await cmsFetchPostBySlug(slug))) || getAllPosts()[0];
    if (!post) {
      document.getElementById("articleContent").innerHTML = `<p>We couldn't find that post.</p>`;
      return;
    }

    document.getElementById("pageTitle").textContent = `${post.title} | Adamas Tech Consulting`;
    document.getElementById("breadcrumbTitle").textContent =
      post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title;
    document.getElementById("readTime").textContent = `Read time : ${post.readTime}`;
    document.getElementById("articleTitle").textContent = post.title;
    document.getElementById("articleAuthor").textContent = post.author;
    document.getElementById("articleCover").src = post.coverImage;
    document.getElementById("articleCover").alt = post.title;
    document.getElementById("articleContent").innerHTML = post.content;

    const relatedList = document.getElementById("relatedList");
    const related = await cmsFetchRelatedPosts(post, 3);
    relatedList.innerHTML = related
      .map(
        (p) => `
          <div class="related-item" data-slug="${p.slug}">
            <p class="title">${p.title}</p>
            <p class="date">${formatDate(p.date)}</p>
          </div>
        `
      )
      .join("");

    relatedList.querySelectorAll(".related-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.href = `post.html?slug=${encodeURIComponent(el.dataset.slug)}`;
      });
    });
  }

  init().catch((err) => {
    console.error(err);
    document.getElementById("articleContent").innerHTML = `<p>Couldn't load this post right now. Please try again shortly.</p>`;
  });
})();

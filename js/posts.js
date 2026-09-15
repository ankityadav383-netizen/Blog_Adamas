/**
 * Mock CMS data layer.
 * Shape mirrors what a real headless CMS (e.g. Sanity/Strapi/Contentful) would return,
 * so swapping this file for a fetch('/api/posts') call later is a drop-in replacement.
 */
const POSTS = [
  {
    slug: "openai-alignment-division",
    title: "OpenAI launches new alignment division to tackle risks of superintelligent AI",
    excerpt: "A look inside OpenAI's newest research group and what it means for the future of safe AI development.",
    category: "Web Development",
    date: "2025-02-14",
    readTime: "15+ min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-2.jpg",
    content: `
      <p>OpenAI has announced the formation of a dedicated alignment division tasked with researching how to keep increasingly capable AI systems safe, controllable, and aligned with human intent as they approach and potentially surpass human-level reasoning.</p>
      <h2>Why now</h2>
      <p>As frontier models grow more capable, the gap between what a system can do and what we can reliably verify about its behavior has widened. The new division is meant to close that gap with dedicated research, tooling, and evaluation infrastructure.</p>
      <p>The team will focus on three areas: scalable oversight, interpretability, and robustness testing under adversarial conditions.</p>
      <h2>What it means for the industry</h2>
      <p>Other labs are expected to follow suit, formalizing alignment research as its own discipline rather than a subset of general model development. This mirrors how security teams became standard practice in software engineering.</p>
      <blockquote>"Alignment isn't a checkbox — it's an ongoing discipline that has to scale with model capability," said one researcher familiar with the initiative.</blockquote>
      <p>For now, the division is starting with a small team of researchers and engineers, with plans to grow significantly over the next year.</p>
    `,
  },
  {
    slug: "future-of-search-ai-answers",
    title: "The future of search: how AI-generated answers are reshaping discovery",
    excerpt: "Search engines are shifting from link lists to direct answers. Here's what that means for businesses.",
    category: "Future of Search",
    date: "2025-02-10",
    readTime: "10+ min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-1.jpg",
    content: `
      <p>Search is undergoing its biggest shift since the introduction of the ten blue links. AI-generated answers are increasingly the first thing users see, changing how content needs to be structured to be discoverable.</p>
      <h2>What's changing</h2>
      <p>Instead of scanning a results page, users are getting synthesized answers pulled from multiple sources. This rewards structured, authoritative content and penalizes thin, keyword-stuffed pages.</p>
      <p>Businesses that want to stay visible need to think beyond traditional SEO and toward being a trustworthy source an AI system would cite.</p>
    `,
  },
  {
    slug: "digital-marketing-trends-2025",
    title: "Five digital marketing trends worth your budget in 2025",
    excerpt: "From AI-assisted creative to first-party data strategy, here's where marketing spend is heading.",
    category: "Digital Marketing",
    date: "2025-02-05",
    readTime: "8 min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-2.jpg",
    content: `
      <p>Marketing budgets are being reallocated fast. Here are five trends we're seeing win real budget in 2025, not just attention.</p>
      <h2>1. AI-assisted creative production</h2>
      <p>Teams are using AI tools to cut creative production time without cutting quality, freeing budget for testing more variations.</p>
      <h2>2. First-party data strategy</h2>
      <p>With third-party cookies fading, brands are investing directly in owned data collection and clean rooms.</p>
    `,
  },
  {
    slug: "paid-ads-efficiency-playbook",
    title: "The paid ads efficiency playbook: getting more from a flat budget",
    excerpt: "Practical tactics for squeezing better ROAS out of your paid campaigns without increasing spend.",
    category: "Paid Ads",
    date: "2025-01-28",
    readTime: "12 min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-1.jpg",
    content: `
      <p>When budgets are flat, efficiency is the only lever left. Here's the playbook we use to improve ROAS without spending more.</p>
      <h2>Audit before you optimize</h2>
      <p>Most inefficiency hides in overlapping audiences and stale creative. Start there before touching bids.</p>
    `,
  },
  {
    slug: "industrial-sales-digital-transformation",
    title: "Why industrial sales teams are finally going digital",
    excerpt: "B2B industrial buyers now expect the same digital experience as consumer shoppers. Here's how sales teams are adapting.",
    category: "Industrial Sales",
    date: "2025-01-20",
    readTime: "9 min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-2.jpg",
    content: `
      <p>Industrial buyers increasingly research and shortlist vendors online before ever talking to a sales rep. Sales teams that haven't adapted are losing deals before the first call.</p>
      <h2>The new buyer journey</h2>
      <p>Self-serve product information, transparent pricing signals, and responsive digital channels are now table stakes even in traditionally relationship-driven industrial sales.</p>
    `,
  },
  {
    slug: "cloud-modernization-checklist",
    title: "A practical checklist for cloud modernization on AWS",
    excerpt: "Before you lift-and-shift, here's what to check to avoid re-platforming twice.",
    category: "Web Development",
    date: "2025-01-12",
    readTime: "11 min",
    author: "Ankit Yadav",
    coverImage: "assets/card-photo-1.jpg",
    content: `
      <p>Cloud modernization projects fail most often not from bad execution, but from skipping the assessment phase. Here's the checklist we run before any migration.</p>
      <h2>Assess before you migrate</h2>
      <p>Inventory dependencies, classify workloads by criticality, and identify anything with hard compliance constraints before picking a migration pattern.</p>
    `,
  },
];

const CATEGORIES = ["Future of Search", "Digital Marketing", "Paid Ads", "Industrial Sales"];

function getAllPosts() {
  return POSTS;
}

function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug);
}

function getRelatedPosts(slug, limit = 3) {
  return POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

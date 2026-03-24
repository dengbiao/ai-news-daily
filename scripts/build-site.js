const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'dengbiao'; // TODO: 替换为你的GitHub用户名

function generateHTML(data) {
  const { date, articles } = data;
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const articlesHTML = articles.map((article, index) => {
    const entityTags = article.entities 
      ? article.entities.map(e => `<span class="entity-tag">${e}</span>`).join('')
      : '';
    
    return `
      <article class="news-card">
        <div class="card-header">
          <span class="rank">${String(index + 1).padStart(2, '0')}</span>
          <span class="source">${article.source}</span>
          <span class="score" title="Relevance Score">★ ${article.score}</span>
        </div>
        <h2 class="card-title">
          <a href="${article.link}" target="_blank" rel="noopener">${article.title}</a>
        </h2>
        <p class="card-desc">${article.description}</p>
        <div class="card-footer">
          <div class="entities">${entityTags}</div>
          <time datetime="${article.pubDate}">${new Date(article.pubDate).toLocaleDateString()}</time>
        </div>
      </article>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Daily News — ${dateStr}</title>
  <meta name="description" content="Daily curated AI news, 10 articles max. Curated, credible, traceable.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="AI Daily News — ${dateStr}">
  <meta property="og:description" content="10 curated AI news articles for ${dateStr}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://${GITHUB_USERNAME}.github.io/">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="AI Daily News — ${dateStr}">
  
  <link rel="canonical" href="https://${GITHUB_USERNAME}.github.io/">
  <link rel="alternate" type="application/rss+xml" title="AI Daily News RSS" href="/feed.xml">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="hero">
    <div class="container">
      <h1 class="title">
        <span class="gradient-text">AI Daily</span>
        <span class="subtitle">Your daily source for cutting-edge AI breakthroughs</span>
      </h1>
      <div class="meta">
        <time class="date" datetime="${date}">${dateStr}</time>
        <span class="separator">•</span>
        <span class="count">${articles.length} articles</span>
      </div>
      <nav class="archive-nav">
        <a href="/daily/${date}" class="current">Today</a>
        <a href="/archive.html">Archive</a>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="articles">
      ${articlesHTML}
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>Curated with <span class="heart">♥</span> by AI | <a href="https://github.com/${GITHUB_USERNAME}/ai-news-daily" target="_blank" rel="noopener">Source</a></p>
      <p class="disclaimer">Content belongs to original publishers. Links open in new tabs.</p>
    </div>
  </footer>

  <script>
    // 简单的交互增强
    document.querySelectorAll('.news-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.classList.add('hovered'));
      card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });
  </script>
</body>
</html>`;
}

function generateArchiveHTML(archives) {
  const archiveLinks = archives.map(arch => {
    const dateObj = new Date(arch.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return `<a href="/daily/${arch.date}" class="archive-item">
      <time datetime="${arch.date}">${dateStr}</time>
      <span class="count">${arch.count} articles</span>
    </a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Archive — AI Daily News</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <style>
    .archive-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      padding: 2rem 0;
    }
    .archive-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      text-decoration: none;
      color: var(--text);
      transition: all 0.2s ease;
    }
    .archive-item:hover {
      background: var(--card-hover);
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .archive-item time {
      font-weight: 500;
    }
    .archive-item .count {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <header class="hero hero-sm">
    <div class="container">
      <h1 class="title">
        <a href="/" class="gradient-text" style="text-decoration: none;">AI Daily</a>
        <span class="subtitle">Archive</span>
      </h1>
      <nav class="archive-nav">
        <a href="/">Today</a>
        <a href="/archive.html" class="current">Archive</a>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  </header>
  <main class="container">
    <div class="archive-grid">
      ${archiveLinks}
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      <p>Curated with <span class="heart">♥</span> by AI | <a href="https://github.com/${GITHUB_USERNAME}/ai-news-daily" target="_blank" rel="noopener">Source</a></p>
    </div>
  </footer>
</body>
</html>`;
}

function buildSite() {
  const dataDir = path.join(__dirname, 'data');
  const siteDir = path.join(__dirname, 'site');
  
  // 创建site目录
  if (!fs.existsSync(siteDir)) {
    fs.mkdirSync(siteDir, { recursive: true });
  }
  
  // 读取最新数据
  const latestPath = path.join(dataDir, 'latest.json');
  if (!fs.existsSync(latestPath)) {
    console.error('No data found. Run "npm run crawl" first.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
  
  // 生成首页
  const html = generateHTML(data);
  fs.writeFileSync(path.join(siteDir, 'index.html'), html);
  
  // 生成每日文章页 (英文路由)
  const dailyDir = path.join(siteDir, 'daily');
  if (!fs.existsSync(dailyDir)) {
    fs.mkdirSync(dailyDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dailyDir, `${data.date}.index.html`), html);
  
  // 生成归档页
  const archives = [];
  const files = fs.readdirSync(dataDir);
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'latest.json') {
      const archData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      archives.push({ date: archData.date, count: archData.articles.length });
    }
  });
  archives.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const archiveHTML = generateArchiveHTML(archives);
  fs.writeFileSync(path.join(siteDir, 'archive.html'), archiveHTML);
  
  // 生成RSS feed
  const rss = generateRSS(data);
  fs.writeFileSync(path.join(siteDir, 'feed.xml'), rss);
  
  console.log('✓ Site built successfully!');
  console.log(`  - index.html`);
  console.log(`  - daily/${data.date}.index.html`);
  console.log(`  - archive.html`);
  console.log(`  - feed.xml`);
}

function generateRSS(data) {
  const items = data.articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.link}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.pubDate).toUTCString()}</pubDate>
      <source>${article.source}</source>
    </item>
  `).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Daily News</title>
    <description>Daily curated AI news, 10 articles max. Curated, credible, traceable.</description>
    <link>https://${GITHUB_USERNAME}.github.io/</link>
    <atom:link href="https://${GITHUB_USERNAME}.github.io/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

buildSite();
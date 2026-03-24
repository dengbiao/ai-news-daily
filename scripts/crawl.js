const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

// 加载数据
const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
const articles = [];
const seenUrls = new Set();

// 清理标题
function cleanTitle(title) {
  if (!title) return '';
  // 移除多余空格和换行
  return title.replace(/\s+/g, ' ').trim();
}

// 清理描述
function cleanDescription(desc) {
  if (!desc) return '';
  // 移除HTML标签
  let text = desc.replace(/<[^>]*>/g, '');
  // 移除多余空格
  text = text.replace(/\s+/g, ' ').trim();
  // 截断到合理长度
  if (text.length > 300) {
    text = text.substring(0, 297) + '...';
  }
  return text;
}

// 判断内容是否与AI相关
function isAIRelated(title, description) {
  const keywords = [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
    'llm', 'large language model', 'gpt', 'claude', 'gemini', 'openai', 'anthropic',
    'neural', 'transformer', 'model', 'training', 'nlp', 'nlu', 'computer vision',
    'multimodal', 'rag', 'fine-tuning', 'inference', 'deployment', 'agent',
    'autonomous', 'robotics', 'automation', 'generative', 'diffusion', 'stable diffusion',
    'midjourney', 'sora', 'video generation', 'text to image', 'speech', 'voice',
    'chatbot', 'conversational', 'token', 'embedding', 'vector', 'dataset'
  ];
  
  const text = (title + ' ' + (description || '')).toLowerCase();
  return keywords.some(kw => text.includes(kw));
}

// 从描述提取实体
function extractEntities(title, description) {
  const companies = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Microsoft', 'Apple', 
    'Amazon', 'NVIDIA', 'AMD', 'Intel', 'Mistral', 'Cohere', 'Stability AI',
    'Hugging Face', 'DeepMind', 'xAI', 'Inflection', 'Character AI', 'Midjourney'];
  const products = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Stable Diffusion',
    'Sora', 'DALL-E', 'Midjourney', 'Copilot', 'Bard', 'ChatGPT', 'O1', 'O3', 'O4'];
  
  const text = (title + ' ' + (description || ''));
  const found = [];
  
  companies.forEach(c => {
    if (text.toLowerCase().includes(c.toLowerCase())) found.push(c);
  });
  products.forEach(p => {
    if (text.toLowerCase().includes(p.toLowerCase())) found.push(p);
  });
  
  return [...new Set(found)].slice(0, 5);
}

// 评分算法
function scoreArticle(title, description, sourcePriority, category) {
  let score = 5;
  
  // 来源优先级加分
  if (sourcePriority === 'high') score += 3;
  else if (sourcePriority === 'medium') score += 1;
  
  // 类别优先级
  if (category === 'company') score += 2;
  else if (category === 'research') score += 1;
  
  // 内容质量
  if (title && title.length > 20) score += 1;
  if (description && description.length > 100) score += 1;
  
  // 热门关键词加分
  const hotKeywords = ['gpt-5', 'o1', 'o3', 'o4', 'claude 4', 'gemini 2', 
    'reasoning', 'agent', 'sora', 'video generation', 'benchmark', 'sota'];
  const text = (title + ' ' + (description || '')).toLowerCase();
  hotKeywords.forEach(kw => {
    if (text.includes(kw)) score += 2;
  });
  
  return Math.min(score, 10);
}

async function crawlSource(source) {
  try {
    console.log(`Crawling: ${source.name}`);
    const feed = await parser.parseURL(source.url);
    
    feed.items.slice(0, 15).forEach(item => {
      if (!item.link || seenUrls.has(item.link)) return;
      if (!isAIRelated(item.title, item.contentSnippet || item.content)) return;
      
      seenUrls.add(item.link);
      
      const article = {
        title: cleanTitle(item.title),
        description: cleanDescription(item.contentSnippet || item.content || item.summary),
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        source: source.name,
        sourceCategory: source.category,
        entities: extractEntities(item.title, item.contentSnippet || item.content),
        score: scoreArticle(item.title, item.contentSnippet || item.content, source.priority, source.category)
      };
      
      articles.push(article);
    });
  } catch (error) {
    console.error(`Error crawling ${source.name}:`, error.message);
  }
}

async function main() {
  console.log('Starting AI News aggregation...\n');
  
  // 并发爬取所有源
  await Promise.all(sources.sources.map(crawlSource));
  
  // 按评分排序，取前10
  articles.sort((a, b) => b.score - a.score);
  const top10 = articles.slice(0, 10);
  
  // 保存数据
  const today = new Date().toISOString().split('T')[0];
  const dataDir = path.join(__dirname, 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'latest.json'),
    JSON.stringify({ date: today, articles: top10 }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(dataDir, `${today}.json`),
    JSON.stringify({ date: today, articles: top10 }, null, 2)
  );
  
  console.log(`\n✓ Collected ${top10.length} articles`);
  console.log(`Date: ${today}`);
}

main().catch(console.error);
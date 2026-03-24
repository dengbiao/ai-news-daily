# AI Daily News 项目

**位置:** `~/workspace/ai-news-daily/`

## 项目文件
- `sources.json` - RSS 源配置（10个高质量源）
- `scripts/crawl.js` - RSS 抓取脚本（自动过滤、评分、精选10条）
- `scripts/build-site.js` - 静态站点生成（英文路由）
- `site/style.css` - 暗色主题样式，流畅动画
- `.github/workflows/daily-crawl.yml` - 自动部署 workflow

## 部署步骤
1. Fork 项目到你的 GitHub
2. 修改 `scripts/build-site.js` 中的 `YOUR_GITHUB_USERNAME`
3. 启用 GitHub Pages（Settings → Pages → main branch）
4. 启用 GitHub Actions
5. 手动触发首次运行

## 特性
- ✅ 精选10条高质量 AI 资讯
- ✅ 可信来源（OpenAI, Anthropic, Google, Meta, Hugging Face 等）
- ✅ 可溯源（保留原始链接）
- ✅ 英文路由 `/daily/2026-03-24`
- ✅ 每天北京时间 8:00 自动更新

## 本地测试
```bash
cd ai-news-daily
npm install
npm run crawl
npm run build
npm run dev
```
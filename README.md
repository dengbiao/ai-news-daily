# AI Daily News

> Your daily source for cutting-edge AI breakthroughs. Curated, credible, traceable.

一个精选的 AI 资讯日报站点，每天自动从可信来源抓取 10 条高质量 AI 新闻。

![Preview](https://img.shields.io/badge/Live-Demo-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-2ea44f)

## ✨ 特性

- 📰 **精选 10 条** - 每天最多 10 条高质量 AI 资讯
- 🎯 **可信来源** - 来自 OpenAI、Anthropic、Google AI、Meta、Hugging Face 等权威源
- 🔍 **可溯源** - 每条资讯保留原始链接和来源
- 🌐 **英文路由** - `/daily/2026-03-24` 格式，URL 更干净
- 🎨 **美观界面** - 现代化暗色主题，流畅动画
- ⚡ **自动更新** - 每天北京时间 8:00 自动抓取部署
- 📱 **响应式** - 完美支持移动端

## 🚀 快速开始

### 1. Fork 本项目

点击右上角 **Fork** 按钮。

### 2. 替换 GitHub 用户名

编辑 `scripts/build-site.js`，将 `YOUR_GITHUB_USERNAME` 替换为你的 GitHub 用户名：

```javascript
const GITHUB_USERNAME = '你的用户名';
```

### 3. 启用 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **main**，目录选择 **/ (root)**
4. Save

### 4. 启用 GitHub Actions

进入仓库 **Actions**，点击 **Enable GitHub Actions**。

### 5. 手动触发首次部署

进入 **Actions** → **Daily AI News** → **Run workflow** → **Run workflow**

## 📁 项目结构

```
ai-news-daily/
├── .github/workflows/
│   └── daily-crawl.yml    # 自动抓取 workflow
├── data/
│   ├── latest.json        # 最新数据
│   └── YYYY-MM-DD.json    # 历史存档
├── scripts/
│   ├── crawl.js           # RSS 抓取脚本
│   └── build-site.js      # 静态站点生成
├── site/
│   ├── index.html         # 首页
│   ├── style.css          # 样式
│   └── daily/             # 每日文章页
├── sources.json           # RSS 源配置
├── package.json
└── README.md
```

## ⚙️ 自定义

### 修改 RSS 源

编辑 `sources.json`：

```json
{
  "sources": [
    {
      "name": "你的源名称",
      "url": "https://example.com/rss.xml",
      "category": "company",
      "priority": "high"
    }
  ]
}
```

### 本地开发

```bash
npm install
npm run crawl   # 抓取新闻
npm run build   # 生成站点
npm run dev     # 本地预览
```

### 调整抓取数量

编辑 `.github/workflows/daily-crawl.yml`：

```yaml
env:
  CONFIDENCE_THRESHOLD: '0.35'  # 数值越高，筛选越严格
```

## 🌐 访问

部署完成后访问：`https://你的用户名.github.io/ai-news-daily/`

## 📄 License

MIT License © 2026
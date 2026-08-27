# The Ninth Anomaly · 第九类异体 — 在线阅读站

基于 **Astro 5 Content Layer** 的纯静态阅读站点（无 UI 框架、手写 CSS）。
正文原稿存放于仓库 `books/the-ninth-anomaly/`（内容层用 `glob` loader
直接读取 `../books/...`，并不复制或改写任何原稿文件）。

正文永远是**英文原稿**；i18n 只作用于界面文案（站点脚手架）。

## 页面与路由

| 路由 | 说明 |
| --- | --- |
| `/` · `/zh/` | 首页：CSS 氛围 hero + 章节目录（含每章阅读时长，按英文 ~230 词/分钟估算） |
| `/chapters/chapter-NN/` · `/zh/chapters/chapter-NN/` | 章节阅读页（1–18）：左侧章节侧栏、阅读进度条、上一章/下一章导航、亮暗双主题 |

- `en` 为默认语言且不加前缀（`/`、`/chapters/...`）；中文界面位于 `/zh/` 前缀下。
- 共 38 个静态页面：英文 19（首页 + 18 章）+ 中文 19。

## 本地开发

```sh
cd site
npm install          # 首次
npm run dev          # 开发服务器 http://localhost:4321
npm run build        # 构建产物输出到 site/dist/
npm run preview      # 本地预览构建产物（部署前检查用）
```

> 注意：改动内容层相关代码（如 `src/lib/rehype-book-headings.ts` 等）后，
> 构建前请执行 `rm -rf .astro` 清掉内容层缓存，否则旧渲染结果会被复用。

## i18n 与语言自动识别

- 所有界面文案集中在 `src/i18n/ui.ts` 的字典（`ui.en` / `ui.zh`），组件通过
  `t(locale, key, vars?)` 取文案，无散落硬编码。书名 "The Ninth Anomaly" 两
  种界面都保留英文主标题；中文界面额外展示副标题「第九类异体」。
- **语言自动识别**：`BaseLayout` 的 `<head>` 内联脚本在首屏渲染前执行——用户
  若从未手动选择过语言（localStorage `tna-lang` 无值），按 `navigator.language`
  判断：`zh-*` 浏览器跳转到 `/zh/` 对应页面，其余留在 `/`；跳转会保留当前
  路径（章节页对章节页）。用户一旦点击页眉「EN / 中文」切换按钮，
  `tna-lang` 被写入，此后始终尊重手动选择、不再自动跳转。
- 语言切换按钮位于页眉（主题按钮左侧），在当前页面两个语言版本间跳转
  （`/` ↔ `/zh/`、`/chapters/chapter-01/` ↔ `/zh/chapters/chapter-01/`）。
- 主题：`data-theme` 记入 `tna-theme`，默认跟随 `prefers-color-scheme`，同样由
  页眉按钮控制、head 内联脚本防闪烁。

## 章节侧栏

章节阅读页（桌面 ≥1120px）左侧为固定章节列表（mdBook/VitePress 风格），
当前章高亮；正文阅读栏在剩余内容区居中，保持 38–42rem 舒适宽度。
移动端侧栏收起为抽屉：页眉汉堡按钮唤出，点章节或遮罩、按 Esc 关闭。
首页目录保持原有列表样式。

## 目录结构

```
site/
├── astro.config.mjs        # markdown rehype 插件 + i18n 路由配置
├── netlify.toml            # Netlify 构建配置（base 目录 = site/ 时生效）
├── public/                 # favicon 等静态资源
└── src/
    ├── content.config.ts   # Content Layer：glob 读取 ../books/...（chapters）
    ├── i18n/ui.ts          # 界面文案字典（en/zh）+ t() 取值与路径助手
    ├── lib/
    │   ├── book.ts                 # 章节解析 / 阅读时长 / 排序辅助
    │   └── rehype-book-headings.ts # 移除章节正文首个 h1（标题由页面 chrome 渲染）
    ├── layouts/BaseLayout.astro    # 全局布局：页眉 / 语言+主题切换 / FOUC 防闪与语言识别脚本
    ├── components/
    │   ├── HomeView.astro          # 首页 hero + 目录（两种语言共用）
    │   ├── ChapterView.astro       # 章节页文章主体（侧栏 + 正文 + 上/下章导航）
    │   ├── ChapterSidebar.astro    # 章节侧栏（桌面固定栏 / 移动端抽屉）
    │   ├── SidebarToggle.astro     # 汉堡按钮（移动端唤出侧栏抽屉）
    │   ├── ThemeToggle.astro       # 亮暗主题切换
    │   └── ProgressBar.astro       # 章节页顶部细阅读进度条
    ├── pages/
    │   ├── index.astro             # en 首页（/）
    │   ├── chapters/[slug].astro   # en 章节页（/chapters/...，18 个静态路由）
    │   ├── zh/index.astro          # zh 首页（/zh/）
    │   └── zh/chapters/[slug].astro# zh 章节页（/zh/chapters/...）
    └── styles/global.css           # 亮/暗两套配色（CSS 自定义属性）+ 排印 + 侧栏
```

## 部署

仓库是一个 monorepo（`site/` 是唯一的站点子目录，正文在 `books/`），
章节数据通过相对路径 `../books/...` 读取，因此部署平台必须在 `site/` 目录
里执行 `npm run build`。两种平台配置如下。

### Netlify

`site/netlify.toml` 已提供构建命令与发布目录。部署步骤（二选一）：

1. **仪表盘一键导入**（推荐）：
   - Add new site → Import an existing project → 选择本仓库；
   - 若出现「检测到多个站点/目录」列表，选择 `base-directory: site` 所在项，
     Netlify 会自动填好构建设置；若未自动识别，按下一条手动配置；
   - Save & Deploy。
2. **手动配置**：
   - 在 **Site configuration → Build & deploy → Build settings** 里把
     **Base directory** 设为 `site`（Netlify 会自动在 base 目录找到
     `site/netlify.toml`，无需在 UI 重复填写命令）；
   - 若不用 toml，可在 UI 直接填：Build command = `npm run build`，
     Publish directory = `dist`（均相对于 base 目录）。

Netlify 查找配置文件的顺序：Package directory → Base directory → Root，
所以 `site/netlify.toml` 配合 Base directory = `site` 即可生效。

### Vercel

Vercel 的 monorepo 子目录需要手动指定根目录（Root Directory）：

- Import Project → 选择本仓库；
- 在项目配置中把 **Root Directory** 设为 `site`（Vercel 会自动检测到
  Astro 框架，无需写配置文件）；
- Framework Preset 应显示为 **Astro**，Build Command = `npm run build`，
  Output Directory = `dist`（均为相对 Root Directory 的默认值，确认即可）；
- Deploy。

构建产物体积约几百 KB，字体（Source Serif 4）已通过 `@fontsource`
自托管并打包进站点静态资源，无外部字体请求。

## 校验

```sh
cd site && rm -rf .astro && npm run build
# 期望：38 个页面（en / + 18 章，zh /zh/ + 18 章），无 /full
```
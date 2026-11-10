# rain.blog

这是我的个人网站 [raincraft.dev](https://raincraft.dev) 的代码。

我在这里放三样东西：随手记下的**随笔**，写得比较完整的**文章**，还有正在做的**作品**（目前是投研 Agent Uteki）。网站本身用 Next.js 写，内容放在另一个仓库 [rain.blog.repo](https://github.com/Rain1601/rain.blog.repo) 里，两边分开：改样式不用碰内容，写东西也不用重新部署。

## 网站里有什么

- **首页 `/`**：左边是我，右边是最近写的东西。最新的一篇放在最上面，下面分成文章、随笔两栏，一屏能看全。点「个人介绍」会把右边换成我的经历。
- **随笔 `/notes`**：短的想法和记录，按时间排。可以搜索、按月份或标签筛选，也能附视频和链接。
- **文章 `/articles`**：长文。最上面的精选像一本书，可以一页页往后翻；左边是主题和目录，标题旁边可以搜索。
- **作品 `/product`**：项目介绍，现在只有 Uteki。
- **后台 `/admin`**：我自己写随笔、改个人介绍的地方，只有我的 GitHub 账号能登录。

另外，`/posts` 下有几篇早期的 MDX 文章，里面可以直接在浏览器里跑 Python（基于 Pyodide）。

## 内容放在哪

所有正文都在 [rain.blog.repo](https://github.com/Rain1601/rain.blog.repo)，网站每 5 分钟去拉一次；从后台发布的话会立刻刷新。

**文章**放在 `posts/年/月/` 下，用 front matter 写元信息：

```markdown
---
title: 文章标题
date: 2026-01-11
summary: 一两句话的摘要，会显示在卡片上
tags: [Agent, 译文]
---

正文……
```

`summary` 和 `tags` 都可以不写，但写了会好看很多：没有摘要时卡片会从正文开头截一段，没有标签就不会出现在主题筛选里。

文章可以做中英对照：两篇 Markdown 分别写 `lang: en`、`lang: zh`，并用 `translationPath` 指向对方在内容仓库中的完整路径。未配对的文章会显示「暂无译文」；两边互相指向后，文章页会显示「原文 / 译文」和 `EN / 中` 切换，中文篇也会自动进入「翻译」主题。例如英文篇写：

```yaml
lang: en
translationPath: posts/2026/01/example-zh.md
```

对应中文篇写 `lang: zh` 和 `translationPath: posts/2026/01/example-en.md`。路径必须与仓库中的实际文件一致。

要给正文段落添加文章批注，在段落后面加一行 Markdown 注释，右侧会显示批注，正文不会显示标记：

```markdown
这是一段正文，里面也可以有[链接](https://example.com)。

<!-- rain-comment: 这里写对这段的补充说明。 -->
```

也支持把标记放在段落同一行的末尾。对于从外部同步来的 HTML 文章，直接在对应的段落标签上写 `<p data-rain-comment="批注内容">正文</p>`。每条批注跟随它所在的段落，不需要另外维护编号或位置。

**随笔**放在 `notes/年/月/日期-名字.md`，通常直接在后台写，不用手动建文件：

```markdown
---
date: 2026-11-05
tags: [AI, Coding agent]
video: /notes/2026-11-05-claude-codex.mp4
poster: /notes/2026-11-05-claude-codex.jpg
---

正文……标题可以不写，列表里会用第一句话代替。
```

随笔用到的视频和封面放在本仓库的 `public/notes/` 里。

## 本地跑起来

需要 Node.js 18 以上。

```bash
npm install
npm run dev
```

然后打开 <http://localhost:3001>。如果内容仓库里还没有随笔，本地开发时会显示几条示例，线上不会出现。

其他常用命令：

```bash
npm run build      # 生产构建，推送前最好跑一下
npm run lint
npm run new-post   # 交互式新建一篇本地 MDX 文章
```

## 环境变量

本地放在 `.env.local`（已被 git 忽略），线上放在 Vercel 的 Production 环境里。

| 变量 | 用途 |
|---|---|
| `GITHUB_TOKEN` | 读写内容仓库。只读的话不配也能跑，但 GitHub 每小时只给 60 次请求；后台发布必须有。建议用 Fine-grained token，只给 `rain.blog.repo` 的 Contents 读写权限 |
| `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` | 后台的 GitHub 登录。OAuth App 的回调地址填 `https://raincraft.dev/api/admin/auth/callback`，本地再加一条 `http://localhost:3001/api/admin/auth/callback` |
| `ADMIN_SECRET` | 给登录 cookie 签名的随机字符串，可以用 `openssl rand -base64 32` 生成。换掉它会让所有登录失效 |

## 代码大概在哪

```
src/
├── app/
│   ├── page.tsx, HomeClient.tsx   首页
│   ├── notes/                     随笔
│   ├── articles/                  文章列表
│   ├── blog/[id]/                 文章详情（构建时静态生成）
│   ├── product/                   作品
│   ├── admin/                     后台
│   └── api/admin/auth/            GitHub 登录
├── components/                    导航、Markdown 渲染、目录等
├── content/
│   ├── intro.ts                   首页「个人介绍」的内容
│   └── product/config.ts          作品页的数据
└── utils/
    ├── github.ts                  从内容仓库读文章、随笔
    ├── github-write.ts            后台写回内容仓库
    └── notes-format.ts            随笔的 front matter 格式
```

想改首页的介绍文字，改 `src/content/intro.ts` 和 `HomeClient.tsx` 顶部的 `PROFILE` 就行。

## 部署

推到 `main` 之后 Vercel 会自动部署。部署前跑一遍 `npm run build`：Vercel 上的构建遇到 lint 或类型错误（比如没用到的变量）会直接失败。

## 给以后的自己

- `CLAUDE.md` 和 `AGENTS.md` 是写给 AI 编程助手看的项目说明，内容保持一致，改了一个记得同步另一个。
- 页面最外层用的是 `overflow-x: clip` 而不是 `hidden`，切页动画结束后也不能留下 `transform`。不然侧栏的 sticky 和 fixed 会失效，滚动时跟着跑掉。
- GitHub 接口被限流时，文章列表会退回演示数据。看到奇怪的示例文章，先检查 `GITHUB_TOKEN`。

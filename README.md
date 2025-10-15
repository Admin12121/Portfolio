# My Blog - Built with Fumadocs & MDX

A personal blog and portfolio built with Next.js 15, Fumadocs, and MDX support.

## 🚀 Features

- ✅ **MDX Support** - Write content in MDX with full TypeScript support
- ✅ **Type-Safe** - Zod schema validation for frontmatter
- ✅ **Beautiful UI** - Pre-built components from Fumadocs UI
- ✅ **Full-Text Search** - Built-in search functionality
- ✅ **Code Highlighting** - Syntax highlighting with Shiki
- ✅ **Dark Mode** - Built-in theme switching
- ✅ **Table of Contents** - Auto-generated TOC for posts

## 📁 Project Structure

```
blog/
├── app/
│   ├── api/search/route.ts      # Search API endpoint
│   ├── blog/
│   │   ├── [[...slug]]/page.tsx # Dynamic blog post pages
│   │   └── layout.tsx           # Blog layout with sidebar
│   └── page.tsx                 # Homepage
├── content/blog/                # MDX blog posts go here
│   ├── getting-started.mdx
│   └── advanced-features.mdx
├── lib/source.ts                # Fumadocs source configuration
├── mdx-components.tsx           # MDX component mappings
└── source.config.ts             # MDX collection configuration
```

## 🛠️ Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## 📝 Writing Content

Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: My New Post
description: A brief description
author: Your Name
date: 2025-10-14
tags: [tutorial, guide]
---

# My New Post

Your content here with **markdown** support!

<Callout type="info">
  Use Fumadocs components!
</Callout>
```

## 🎨 Available Components

- **Cards** - Display features or content cards
- **Callouts** - Info, warning, error callouts
- **Tabs** - Tabbed content
- **Code Blocks** - Syntax highlighted code

## 📚 Documentation

- [Fumadocs Documentation](https://fumadocs.vercel.app)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com)

## 🚀 Deploy

Deploy easily on [Vercel](https://vercel.com) or any platform that supports Next.js.

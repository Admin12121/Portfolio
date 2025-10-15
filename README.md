# Portfolio & Blog

A modern, minimal portfolio and blog platform built with Next.js 15, showcasing projects, certifications, and technical writing.

Check out the live site: [biki.com.np]

## 🚀 Overview

### Tech Stack

- **Next.js 15** with Turbopack for blazing-fast development
- **Tailwind CSS v4** for modern styling
- **Fumadocs** for documentation and MDX content
- **Radix UI** for accessible components
- **Framer Motion** for smooth animations
- **TypeScript** for type safety

### ✨ Features

- 🎨 **Clean & Modern Design** - Minimalist interface with attention to detail
- 🌓 **Dark/Light Theme** - Animated theme switching with custom transitions
- 📝 **MDX Blog** - Full-featured blog with syntax highlighting and interactive components
- 💼 **Portfolio** - Showcase projects, certifications, and GitHub contributions
- 🔍 **Full-Text Search** - Built-in search functionality for blog posts
- 📱 **Responsive** - Mobile-first design that works on all devices
- ⚡ **Performance Optimized** - Static generation for lightning-fast page loads

### 📝 Blog Features

- MDX & Markdown support with TypeScript integration
- Syntax highlighting powered by Shiki
- Interactive components (Tabs, Callouts, Code Blocks, Accordions)
- Auto-generated Table of Contents
- Reading time estimates
- Dynamic OG Images for social sharing
- Access raw markdown by adding `.mdx` to any blog URL

### 💼 Portfolio Features

- **Projects Showcase** - Display your best work with descriptions and links
- **Certifications** - Professional certifications and achievements
- **GitHub Contributions** - Interactive contribution graph
- **Profile Panel** - Clean presentation of your professional identity

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── (app)/               # Main app routes
│   │   ├── page.tsx         # Homepage with portfolio
│   │   └── blog/            # Blog section
│   └── api/                 # API routes
├── components/              # Reusable UI components
│   ├── global/             # Global components (animations, etc.)
│   ├── navbar/             # Navigation components
│   └── ui/                 # shadcn/ui components
├── content/blog/           # MDX blog posts
├── features/               # Feature-specific components
│   ├── blog/              # Blog-related features
│   └── profile/           # Portfolio/profile features
├── lib/                   # Utilities and configurations
└── public/               # Static assets
```

## 📝 Writing Content

Create a new blog post in `content/blog/`:

```mdx
---
title: Your Post Title
description: A brief description
author: Your Name
date: 2025-10-15
---

# Your Post Title

Write your content here with full MDX support!

<Callout type="info">
  Use interactive components in your posts!
</Callout>
```

## 🎨 Component Registry

Built-in component registry with reusable components:

- **Flip Sentences** - Animated text rotation
- **Contribution Graph** - GitHub-style contribution visualization
- **Interactive Cards** - Feature showcases
- **Custom Markdown** - Enhanced markdown rendering

## � License

Licensed under the MIT license.

You're free to use this code! Just make sure to remove all personal information before publishing your website.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Fumadocs](https://fumadocs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Framer Motion](https://www.framer.com/motion)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

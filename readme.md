<!-- Badges -->
![Last Deploy](https://img.shields.io/github/last-commit/AhoyLemon/xyz?label=Last%20Deploy&style=for-the-badge)
![Build Status](https://img.shields.io/github/actions/workflow/status/AhoyLemon/xyz/static.yml?branch=main&style=for-the-badge)
![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fahoylemon.xyz&style=for-the-badge)
![Activity](https://img.shields.io/github/commit-activity/m/AhoyLemon/xyz?style=for-the-badge)

<!-- Extended Badges -->
![Contributors](https://img.shields.io/github/contributors/AhoyLemon/xyz?style=for-the-badge)
[![Stars](https://img.shields.io/github/stars/AhoyLemon/xyz?style=for-the-badge)](https://github.com/AhoyLemon/xyz/stargazers)
![Watchers](https://img.shields.io/github/watchers/AhoyLemon/xyz?style=for-the-badge)
![Sponsor](https://img.shields.io/github/sponsors/AhoyLemon?style=for-the-badge)

![Open Issues](https://img.shields.io/github/issues/AhoyLemon/xyz?label=OPEN%20ISSUES&style=for-the-badge&color=orange)  ![Closed Issues](https://img.shields.io/github/issues-closed/AhoyLemon/xyz?label=&style=for-the-badge&color=555)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Open PRs](https://img.shields.io/github/issues-pr/AhoyLemon/xyz?label=OPEN%20PRS&style=for-the-badge&color=orange)  ![Closed PRs](https://img.shields.io/github/issues-pr-closed/AhoyLemon/xyz?label=&style=for-the-badge&color=555)


![ahoylemon.xyz](https://ahoylemon.xyz/android-chrome-512x512.png)
#### (A Site Lemon Built To Show Sites Lemon Built)

### What is this?
A simple site that showcases other sites I made.

### That's all?
Yeah.

### What's this written in?
* [Pug](https://pugjs.org)
* [Sass](http://sass-lang.com/)

## Development Setup

This project uses npm scripts to handle Pug and Sass compilation with live reloading.

### Prerequisites
- Node.js (for npm and build tools)

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This will:
   - Watch for changes to `.pug` files and compile to HTML
   - Watch for changes to `.scss` files and compile to CSS with autoprefixer
   - Start a local server at http://localhost:3000 with live reloading

⚡ **Fast Development Mode** (Recommended for active development):
   ```bash
   npm run dev
   ```
   Features optimized build performance with:
   - Debounced file watching (prevents excessive rebuilds)
   - Targeted Pug compilation (only rebuilds changed files)
   - Fast Sass compilation (no source maps in dev mode)
   - Optimized browser sync configuration

🔧 **Legacy Mode** (If you encounter issues):
   ```bash
   npm run dev:legacy  
   ```
   Uses the original build pipeline for compatibility.

### Individual Build Commands

- **Build all files:** `npm run build`
- **Build Pug files:** `npm run build:pug`
- **Build Sass files:** `npm run build:sass`
- **Build Sass (production):** `npm run build:sass:prod` (compressed + source maps)
- **Watch files (optimized):** `npm run watch:optimized`
- **Watch Pug files:** `npm run watch:pug`
- **Watch Sass files:** `npm run watch:sass`
- **Start dev server:** `npm run serve`
- **Start fast dev server:** `npm run serve:fast`

### File Structure & Compilation

**Pug Files:**
- `pug/index.pug` → `index.html`
- `pug/clients.pug` → `clients/index.html`
- `pug/decks.pug` → `decks.html`
- `pug/talks.pug` → `talks.html`
- `pug/feed.pug` → `feed.xml`
- `pug/sitemap.pug` → `sitemap.xml`
- `pug/uses.pug` → `uses/index.html`

**Sass Files:**
- `sass/ahoylemon.scss` → `css/ahoylemon.css` (with autoprefixer and source maps)

**Partials:** Changes to any file in `pug/partials/` or `sass/partials/` or `sass/globals/` will trigger recompilation of the main files that depend on them.

### Error Handling
If there are syntax errors in your Pug or Sass files, you'll see clear error messages in the console indicating exactly what went wrong and where. The build will continue watching for changes, so you can fix the error and it will automatically retry.

### Notes
- The npm dependencies are only for development - the final site consists only of HTML and CSS files
- Live reloading works automatically when you make changes to source files
- Source maps are included for easier debugging of Sass files
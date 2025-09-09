# Scripts Documentation

This folder contains build system configuration and scripts for the ahoylemon.xyz website.

## npm/ folder

Contains npm-based build system scripts and configuration files:

### Build Scripts
- **build-sass.js** - Compiles Sass/SCSS files to CSS with PostCSS processing and autoprefixing. Supports compression and source maps for production builds.
- **build-pug.js** - Compiles Pug templates to HTML files. Handles all main pages: index, talks, decks, clients, uses, feed (XML), and sitemap (XML).

### Configuration Files
- **bs-config.js** - Browser-sync configuration for local development server with live reload functionality.
- **postcss.config.js** - PostCSS configuration with autoprefixer for cross-browser CSS compatibility.
- **watch.js** - File watching system with debounced rebuilds for Sass and Pug files during development.

### Usage
- `npm run build` - Build all assets (Sass + Pug)
- `npm run dev` - Start development server with file watching and live reload
- `npm run watch` - File watching only (no server)
- `npm run build:sass:prod` - Production Sass build with compression and source maps
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

### Individual Build Commands

- **Build Pug files:** `npm run build:pug`
- **Build Sass files:** `npm run build:sass`
- **Watch Pug files:** `npm run watch:pug`
- **Watch Sass files:** `npm run watch:sass`
- **Start dev server:** `npm run serve`

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
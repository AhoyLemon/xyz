# ahoylemon.xyz

ahoylemon.xyz is a static personal website built with Pug templates and SASS/SCSS that showcases Lemon's conference talks, web projects, and client work. The site is deployed to GitHub Pages with automated builds.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

**Bootstrap and Build:**
- Install required tools: `npm install -g sass pug-cli`
- Build CSS: `sass --no-source-map sass/ahoylemon.scss:css/ahoylemon.css` - takes ~0.5 seconds
- Build all HTML pages: `pug pug/index.pug pug/talks.pug pug/decks.pug pug/clients.pug pug/uses.pug pug/feed.pug pug/sitemap.pug -o . -P` - takes ~1.5 seconds
- **Full build command**: `sass --no-source-map sass/ahoylemon.scss:css/ahoylemon.css && pug pug/index.pug pug/talks.pug pug/decks.pug pug/clients.pug pug/uses.pug pug/feed.pug pug/sitemap.pug -o . -P` - takes ~2 seconds total

**Development Server:**
- Start local server: `python3 -m http.server 8000`
- Access site at: `http://localhost:8000`

**Watch Mode Development:**
- CSS watch: `sass --watch --no-source-map sass/ahoylemon.scss:css/ahoylemon.css`
- HTML watch (single file): `pug -w pug/index.pug -o . -P`
- **IMPORTANT**: Do NOT build individual Pug partials - they will fail due to missing variable context. Only build main page files.

## Build Limitations and Warnings

**Critical Build Issues:**
- **DO NOT** run `pug pug/ -o . -P` (building all files) - this fails on `pug/partials/_passport-stamps.pug` due to undefined `sortedCountryCounts` variable
- **ALWAYS** build only main page files: `index.pug`, `talks.pug`, `decks.pug`, `clients.pug`, `uses.pug`, `feed.pug`, `sitemap.pug`
- SASS compilation shows deprecation warnings about `@import` usage - these are expected and do not affect build success

**Expected Build Output:**
- Build times are very fast (<3 seconds total) - no need for extended timeouts
- SASS warnings about deprecated imports are normal and expected
- All builds succeed when following the correct page-specific approach

## Validation

**Manual Testing Steps:**
1. **ALWAYS** build both CSS and HTML before testing
2. Start local server: `python3 -m http.server 8000`
3. **Test main pages**: Navigate to `http://localhost:8000/`, `/talks.html`, `/decks.html`, `/clients.html`
4. **Verify content loads**: Check that projects, talks, and images display properly
5. **Test navigation**: Click links between pages to ensure proper routing

**Testing Variables:**
- Test both production (`testing = false`) and development (`testing = true`) modes in `pug/partials/_variables.pug`
- Production URLs use `https://ahoylemon.xyz`, development uses `http://localhost:8848`

## CI/CD Integration

**GitHub Actions:**
- `.github/workflows/sass-build.yml` - Automatically compiles SASS on push/PR
- `.github/workflows/static.yml` - Deploys to GitHub Pages with deployment checks
- **Pre-deployment validation**: Checks for `testing = true` in pug files and `localhost` in HTML files

**Development vs Production:**
- Set `testing = false` in `pug/partials/_variables.pug` for production builds
- Never commit files with `testing = true` or localhost references
- CI will block deployment if testing mode is detected

## Common Tasks

**Adding New Content:**
- **Project data**: Edit `pug/partials/_sites.pug` for new projects
- **Talk data**: Edit `pug/partials/_talks.pug` for conference talks
- **Deck data**: Edit `pug/partials/_decks.pug` for presentation slides
- **Styling**: Edit SASS files in `sass/` directory structure
- **Always rebuild and test after content changes**

**Typical Workflow:**
1. Edit content in appropriate Pug partial
2. Run full build command
3. Start local server and test changes
4. Verify all pages load and display correctly
5. Check that no localhost references remain
6. Commit changes (GitHub Actions will handle deployment)

**Pull Request Creation:**
- **ALWAYS** include `This closes #XX` in the PR description when working on an issue (where XX is the issue number)
- This ensures the issue automatically closes when the PR is merged
- Example: If working on issue #42, include "This closes #42" in the PR description

## Repository Structure

**Source Files:**
- `pug/` - Pug templates (HTML generation)
  - `pug/partials/` - Reusable components and data
  - Main pages: `index.pug`, `talks.pug`, `decks.pug`, etc.
- `sass/` - SASS/SCSS stylesheets
  - `sass/ahoylemon.scss` - Main stylesheet entry point
  - `sass/globals/` - Global styles and variables
  - `sass/partials/` - Component-specific styles

**Generated Files:**
- `css/ahoylemon.css` - Compiled CSS output
- `*.html` - Generated HTML files from Pug templates

**Configuration:**
- `_config.yml` - allow webfinger via .well-known folder
- `config.codekit3` - CodeKit configuration (alternative build tool)
- `prepros.config` - Prepros configuration (alternative build tool)

**Alternative Build Tools:**
- Can use CodeKit 3 or Prepros instead of command-line tools
- CLI tools (sass, pug-cli) are recommended for consistency and automation
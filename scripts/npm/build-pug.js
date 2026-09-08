#!/usr/bin/env node
const pug = require("pug");
const fs = require("fs");
const path = require("path");

// Define the compilation mappings based on prepros.config
const compilations = [
  { src: "pug/index.pug", dest: "index.html" },
  // Clients
  { src: "pug/clients.pug", dest: "clients/index.html" },
  { src: "pug/clients.pug", dest: "clients.html" },
  // Decks
  { src: "pug/decks.pug", dest: "decks/index.html" },
  { src: "pug/decks.pug", dest: "decks.html" },
  // Talks
  { src: "pug/talks.pug", dest: "talks/index.html" },
  { src: "pug/talks.pug", dest: "talks.html" },
  // Other pages
  { src: "pug/uses.pug", dest: "uses/index.html" },
  { src: "blog/_pug/apple-names.pug", dest: "blog/apple-names.html" },
  // XML
  { src: "pug/feed.pug", dest: "feed.xml" },
  { src: "pug/sitemap.pug", dest: "sitemap.xml" },
  // Error page
  { src: "pug/404.pug", dest: "404.html" },
];

function compilePugFile(srcFile = null) {
  const start = Date.now();
  let hasErrors = false;
  let compiledCount = 0;

  // If specific file is provided, only compile that one
  const filesToCompile = srcFile ? compilations.filter(({ src }) => src === srcFile || src.endsWith(path.basename(srcFile))) : compilations;

  filesToCompile.forEach(({ src, dest }) => {
    try {
      console.log(`🔨 Compiling ${src} → ${dest}`);

      // Read the pug file
      const pugContent = fs.readFileSync(src, "utf8");

      // Compile with pretty formatting
      const html = pug.render(pugContent, {
        filename: src,
        pretty: true,
        basedir: path.resolve("."),
      });

      // Ensure the destination directory exists
      const destDir = path.dirname(dest);
      if (destDir !== "." && !fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Write the compiled HTML
      fs.writeFileSync(dest, html);
      compiledCount++;
    } catch (error) {
      console.error(`❌ Error compiling ${src}:`, error.message);
      hasErrors = true;
    }
  });

  const duration = Date.now() - start;

  if (hasErrors) {
    console.error(`❌ Pug compilation failed!`);
    return false;
  } else {
    console.log(`✅ ${compiledCount} Pug file(s) compiled successfully in ${duration}ms`);
    return true;
  }
}

// Legacy function for backward compatibility
function compilePugFiles() {
  return compilePugFile();
}

// If this script is run directly
if (require.main === module) {
  const targetFile = process.argv[2];
  const success = compilePugFile(targetFile);
  process.exit(success ? 0 : 1);
}

module.exports = { compilations, compilePugFiles, compilePugFile };

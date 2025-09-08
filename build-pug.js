#!/usr/bin/env node
const pug = require('pug');
const fs = require('fs');
const path = require('path');

// Define the compilation mappings based on prepros.config
const compilations = [
  { src: 'pug/index.pug', dest: 'index.html' },
  { src: 'pug/clients.pug', dest: 'clients/index.html' },
  { src: 'pug/decks.pug', dest: 'decks.html' },
  { src: 'pug/talks.pug', dest: 'talks.html' },
  { src: 'pug/feed.pug', dest: 'feed.xml' },
  { src: 'pug/sitemap.pug', dest: 'sitemap.xml' },
  { src: 'pug/uses.pug', dest: 'uses/index.html' }
];

function compilePugFiles() {
  let hasErrors = false;
  
  compilations.forEach(({ src, dest }) => {
    try {
      console.log(`Compiling ${src} → ${dest}`);
      
      // Read the pug file
      const pugContent = fs.readFileSync(src, 'utf8');
      
      // Compile with pretty formatting
      const html = pug.render(pugContent, {
        filename: src,
        pretty: true,
        basedir: path.resolve('.')
      });
      
      // Ensure the destination directory exists
      const destDir = path.dirname(dest);
      if (destDir !== '.' && !fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Write the compiled HTML
      fs.writeFileSync(dest, html);
      console.log(`✓ ${dest} rendered successfully`);
      
    } catch (error) {
      console.error(`✗ Error compiling ${src}:`, error.message);
      hasErrors = true;
    }
  });
  
  if (hasErrors) {
    console.error('\n❌ Pug compilation completed with errors!');
    process.exit(1);
  } else {
    console.log('\n✅ All Pug files compiled successfully!');
  }
}

// If this script is run directly
if (require.main === module) {
  compilePugFiles();
}

module.exports = { compilePugFiles };
#!/usr/bin/env node
const chokidar = require('chokidar');
const { buildSass } = require('./build-sass.js');
const { compilePugFile } = require('./build-pug.js');
const path = require('path');

// Debounce function to prevent multiple rapid rebuilds
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized Sass watcher
const debouncedSassBuild = debounce(() => {
  buildSass({ sourceMap: false, style: 'expanded' });
}, 100);

// Optimized Pug watcher
const debouncedPugBuild = debounce((filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check if it's a partial (starts with _) - rebuild all if so
  if (path.basename(filePath).startsWith('_')) {
    console.log(`📝 Partial file changed: ${relativePath} - rebuilding all Pug files`);
    compilePugFile();
  } else {
    console.log(`📝 Pug file changed: ${relativePath}`);
    compilePugFile(relativePath);
  }
}, 50);

function startWatching() {
  console.log('🔍 Starting optimized file watchers...\n');
  
  // Watch Sass files
  const sassWatcher = chokidar.watch('sass/**/*.scss', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
  });
  
  sassWatcher.on('change', (filePath) => {
    console.log(`📝 Sass file changed: ${path.relative(process.cwd(), filePath)}`);
    debouncedSassBuild();
  });
  
  // Watch Pug files
  const pugWatcher = chokidar.watch('pug/**/*.pug', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
  });
  
  pugWatcher.on('change', debouncedPugBuild);
  
  console.log('✅ Watchers started successfully!');
  console.log('   - Sass: sass/**/*.scss');
  console.log('   - Pug: pug/**/*.pug');
  console.log('\n🎯 Optimizations active:');
  console.log('   - Debounced rebuilds (100ms for Sass, 50ms for Pug)');
  console.log('   - Targeted Pug compilation (single files when possible)');
  console.log('   - Fast Sass compilation (no source maps in dev)');
  console.log('\n👀 Watching for changes... Press Ctrl+C to stop\n');
}

if (require.main === module) {
  startWatching();
}

module.exports = { startWatching };
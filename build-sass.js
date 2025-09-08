#!/usr/bin/env node
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

async function buildSass(options = {}) {
  const { sourceMap = false, style = 'expanded', silenceDeprecations = true } = options;
  
  try {
    console.log('🔨 Compiling Sass...');
    const start = Date.now();
    
    // Compile Sass with option to silence deprecations
    const result = sass.compile('sass/ahoylemon.scss', {
      style: style,
      sourceMap: sourceMap,
      silenceDeprecations: silenceDeprecations ? ['import'] : []
    });
    
    // Process with PostCSS (autoprefixer)
    const processed = await postcss([autoprefixer])
      .process(result.css, { 
        from: 'sass/ahoylemon.scss',
        to: 'css/ahoylemon.css',
        map: sourceMap ? { inline: false } : false
      });
    
    // Write CSS file
    fs.writeFileSync('css/ahoylemon.css', processed.css);
    
    // Write source map if enabled
    if (sourceMap && processed.map) {
      fs.writeFileSync('css/ahoylemon.css.map', processed.map.toString());
    }
    
    const duration = Date.now() - start;
    console.log(`✅ Sass compiled successfully in ${duration}ms`);
    
    return true;
  } catch (error) {
    console.error(`❌ Sass compilation failed:`, error.message);
    return false;
  }
}

// If this script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const sourceMap = args.includes('--source-map');
  const compressed = args.includes('--compressed');
  
  buildSass({ 
    sourceMap, 
    style: compressed ? 'compressed' : 'expanded' 
  });
}

module.exports = { buildSass };
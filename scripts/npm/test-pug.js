#!/usr/bin/env node
const pug = require("pug");
const fs = require("fs");
const path = require("path");
const { compilations } = require("./build-pug");

const sources = [...new Set(compilations.map(({ src }) => src))];
let hasErrors = false;

sources.forEach((src) => {
  try {
    const pugContent = fs.readFileSync(src, "utf8");
    pug.render(pugContent, {
      filename: src,
      pretty: true,
      basedir: path.resolve("."),
    });
  } catch (error) {
    console.error(`❌ ${src} failed to compile:`, error.message);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error("❌ Pug validation failed");
  process.exit(1);
} else {
  console.log(`✅ ${sources.length} Pug file(s) validated successfully`);
  process.exit(0);
}

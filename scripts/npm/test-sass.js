#!/usr/bin/env node
const sass = require("sass");

try {
  sass.compile("sass/ahoylemon.scss", {
    silenceDeprecations: ["import"],
  });
  console.log("✅ Sass compiles successfully");
  process.exit(0);
} catch (error) {
  console.error("❌ Sass compilation failed:", error.message);
  process.exit(1);
}

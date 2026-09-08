#!/usr/bin/env node
const { execSync } = require("child_process");

function checkForbidden(command, message) {
  try {
    execSync(command, { stdio: "ignore" });
    console.error(`🚫 ${message}`);
    return false;
  } catch (error) {
    // grep exits non-zero when it finds no match, which is the safe case.
    return true;
  }
}

let ok = true;

ok = checkForbidden('grep -r -q "testing = true" --include="*.pug" pug/partials/', "'testing = true' found in pug") && ok;

ok =
  checkForbidden('grep -r -q "localhost" --include="*.html" --exclude-dir=node_modules --exclude-dir=.git .', "'localhost' found in html") && ok;

if (ok) {
  console.log("✅ Safety checks passed");
  process.exit(0);
} else {
  console.error("❌ Safety checks failed");
  process.exit(1);
}

module.exports = {
  server: true,
  files: [
    {
      match: ["css/ahoylemon.css"],
      fn: function (event, file) {
        if (event === "change") {
          console.log(`🔄 CSS updated: ${file}`);
        }
      }
    },
    {
      match: ["*.html", "clients/*.html", "uses/*.html"],
      fn: function (event, file) {
        if (event === "change") {
          console.log(`🔄 HTML updated: ${file}`);
        }
      }
    }
  ],
  watchOptions: {
    ignoreInitial: true,
    ignored: [
      "node_modules",
      "**/*.map",
      ".git/**",
      "**/*.tmp"
    ]
  },
  port: 3000,
  ui: false,
  notify: false,
  open: false,
  ghostMode: false,
  reloadDelay: 50,
  reloadDebounce: 100,
  injectChanges: true,
  minify: false,
  logLevel: "info",
  logPrefix: "BS",
  logConnections: false,
  logFileChanges: true
};
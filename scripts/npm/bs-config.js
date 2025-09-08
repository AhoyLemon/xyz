module.exports = {
  server: true,
  files: [
    "css/ahoylemon.css",
    "*.html", 
    "clients/*.html", 
    "uses/*.html"
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
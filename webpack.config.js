const path = require("path");

module.exports = {
  // ... konfigurasi lainnya
  resolve: {
    extensions: [".js"],
    alias: {
      "@pages": path.resolve(__dirname, "src/scripts/pages"),
      "@views": path.resolve(__dirname, "src/scripts/views"),
      "@models": path.resolve(__dirname, "src/scripts/models"),
      "@presenters": path.resolve(__dirname, "src/scripts/presenters"),
    },
  },
};

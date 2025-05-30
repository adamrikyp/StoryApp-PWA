const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 9000,
    hot: true,
    liveReload: true,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      reconnect: 10, // Tambahkan ini
    },
    webSocketServer: {
      options: {
        path: "/ws",
      },
    },
  },
});

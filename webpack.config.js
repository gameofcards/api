const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".js"]
  },
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }, { loader: "tslint-loader" }]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  target: 'node'
};
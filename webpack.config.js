const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js"]
  },
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loader:
          "style!css?modules&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss"
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

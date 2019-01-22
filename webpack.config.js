const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/main.ts'],
  mode: 'development',
  "output": {
    path: path.join(__dirname, 'build'),
    publicPath: "/build/",
    "filename": "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
    {
      test: /\.tsx?$/,
      use: {
         loader: 'babel-loader',
      }
    },
    {
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }]
  }
};

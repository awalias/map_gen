const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/main.ts'],
  mode: 'development',
  "output": {
    path: path.join(__dirname, 'dist/build'),
    publicPath: "/dist/build/",
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
  },
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, 'dist')
  }
};

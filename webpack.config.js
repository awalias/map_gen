const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  "output": {
    path: path.join(__dirname, 'build'),
    publicPath: "/build/",
    "filename": "bundle.js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      }
    }]
  }
};

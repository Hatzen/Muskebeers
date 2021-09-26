var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./javascript/index.js",
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'app.js',
  },
};

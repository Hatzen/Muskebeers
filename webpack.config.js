var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  entry: "./javascript/index.js",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'app.js',
  },
};

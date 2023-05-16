const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 entry: {
   index: './src/index.js',
 },
 mode:'production',
 plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  output: {
   filename: 'main.js',
   publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(gif|png|jpg|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      },
    ],
  },
};

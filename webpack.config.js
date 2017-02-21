const webpack = require('webpack')
const { resolve } = require('path')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

const isProd = process.env.NODE_ENV === 'production'
const plugins = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  }),
]
if (!isProd) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: isProd ? [
    './index.html',
    './index.tsx',
  ] : [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './index.html',
    './index.tsx',
  ],
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
              ],
              plugins: ['react-hot-loader/babel'],
            },
          },
          'awesome-typescript-loader',
        ],
      },
      {
        test: /\.css$/,
        include: /src/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: !isProd,
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [precss, autoprefixer],
            },
          },
        ],
      },
    ],
  },
  plugins,
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    inline: true,
    hot: true,
    port: 8080,
  },
}

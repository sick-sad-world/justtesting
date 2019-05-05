const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Crx = require('crx-webpack-plugin');
const { mode, port, watch } = require('yargs').argv;

const CONTEXT = 'source';
const P = mode === 'production';
const DEST = P ? '/build' : '/dist';

const htmlEntry = (entry, opts = {}) => ({
  template: './index.html',
  title: `Trendolizer pro ${entry}`,
  filename: `./${entry}.html`,
  chunks: ['vendor', entry],
  ...opts
});

const PLUGINS = [
  new MiniCssExtractPlugin({
    filename: P ? '[name].[hash].css' : '[name].css',
    chunkFilename: P ? '[id].[hash].css' : '[id].css'
  }),
  new CopyPlugin(['manifest.json', 'icon.png']),
  new HtmlWebpackPlugin(
    htmlEntry('auth', {
      template: './app-auth/index.html',
      title: 'Trendolizer pro'
    })
  ),
  new HtmlWebpackPlugin(
    htmlEntry('nav', {
      template: './app-nav/index.html',
      title: 'Trendolizer pro'
    })
  ),
  new HtmlWebpackPlugin(htmlEntry('management')),
  new HtmlWebpackPlugin(htmlEntry('dashboard')),
  new HtmlWebpackPlugin(htmlEntry('settings'))
];

if (P) {
  PLUGINS.push(
    new Crx({
      contentPath: 'build',
      name: 'trendolizer'
    })
  );
} else {
  PLUGINS.push(
    new BundleAnalyzerPlugin({
      analyzerMode: port || watch ? 'server' : 'static'
    })
  );
}

module.exports = {
  devtool: !P ? 'inline-source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  cache: true,
  stats: 'normal',
  entry: {
    worker: ['./app-worker/index.js'],
    background: ['./app-background/app.js'],
    dashboard: ['./app-dashboard/app.js'],
    management: ['./app-management/app.js'],
    settings: ['./app-settings/app.js'],
    nav: ['./app-nav/app.js'],
    auth: ['./app-auth/app.js']
  },
  output: {
    path: path.join(__dirname, DEST),
    filename: P ? '[chunkhash:12].js' : '[name].js'
  },
  devServer: {
    hot: false,
    contentBase: path.resolve(__dirname, CONTEXT)
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.(sa|sc|c)ss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: /assets/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !P,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !P,
              outputStyle: P ? 'compressed' : 'expanded',
              includePaths: [path.resolve(__dirname, CONTEXT, './assets/styles')]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        include: /assets/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)?$/,
        include: /assets/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: P ? 'images/[hash:12].[ext]' : '[path][name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      },
      {
        test: /\.(woff(2)?)(\?[a-z0-9#=&.]+)?$/,
        include: /assets/,
        exclude: /(node_modules)/,
        use: {
          loader: 'file-loader',
          options: {
            name: P ? 'font/[hash:12].[ext]' : '[path][name].[ext]'
          }
        }
      }
    ]
  }
};

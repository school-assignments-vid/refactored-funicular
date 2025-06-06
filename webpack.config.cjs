const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ObfuscatorWebpackPlugin = require('obfuscator-webpack-plugin').default;
const UnpluginTailwindcssMangle = require('unplugin-tailwindcss-mangle/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      clean: true,
    },
    devtool: isProduction ? false : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: false,
          },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true, 
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'styles.[contenthash].css' : 'styles.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets', to: 'assets' },
          { from: 'src/public', to: '' },
        ],
      }),
      isProduction &&
        UnpluginTailwindcssMangle({
          classMapOutput: 'dist/tw-class-map.json',
        }),
      isProduction &&
        new ObfuscatorWebpackPlugin(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            compact: true,
          },
          []
        ),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 40000,
        minChunks: 1,
        cacheGroups: {
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|angular|vue)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 30,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        },
      },
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      hot: true,
      liveReload: true,
      historyApiFallback: true,
      open: true,
    },
  };
};
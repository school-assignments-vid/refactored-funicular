const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ObfuscatorWebpackPlugin = require('obfuscator-webpack-plugin').default;
const UnpluginTailwindcssMangle = require('unplugin-tailwindcss-mangle');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
      clean: true,
    },
    devtool: isProduction ? false : 'inline-source-map',
    module: {
      rules: [
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
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'styles.[contenthash].css' : 'styles.css',
      }),
      isProduction &&
        UnpluginTailwindcssMangle.webpack({
          classMapOutput: 'dist/tw-class-map.json',
          include: [/\.js$/, /\.ts$/, /\.css$/], // Only process these file types
          exclude: [/\.html$/], // Explicitly exclude HTML
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

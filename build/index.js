'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromConfig = undefined;

var _path = require('path');

var _copyWebpackPlugin = require('copy-webpack-plugin');

var _copyWebpackPlugin2 = _interopRequireDefault(_copyWebpackPlugin);

var _glob = require('glob');

var _inertEntryWebpackPlugin = require('inert-entry-webpack-plugin');

var _inertEntryWebpackPlugin2 = _interopRequireDefault(_inertEntryWebpackPlugin);

var _uncssWebpackPlugin = require('uncss-webpack-plugin');

var _uncssWebpackPlugin2 = _interopRequireDefault(_uncssWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _cssnano = require('./cssnano');

var _cssnano2 = _interopRequireDefault(_cssnano);

var _htmlMinifier = require('./html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var _imagemin = require('./imagemin');

var _imagemin2 = _interopRequireDefault(_imagemin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Ideally, replace extricate-loader with Extract Text Plugin, as it is more
// mature. This is pending #159, #268, #470.
// @see https://github.com/webpack-contrib/extract-text-webpack-plugin

// Constants.


// Package modules.
const TMP_DIR = 'public/'; // Hugo `publishDir` default.


// Configuration.
/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Standard lib.
const PUBLISH_DIR = 'dist/'; // Our publish default.

// Exports.
const fromConfig = exports.fromConfig = ({ hugoPublishDir = TMP_DIR, outDir = PUBLISH_DIR }) => {
  // Ensure paths are absolute.
  hugoPublishDir = (0, _path.resolve)(hugoPublishDir);
  outDir = (0, _path.resolve)(outDir);

  // Return configuration.
  return {
    // @see https://webpack.js.org/configuration/entry-context/
    context: hugoPublishDir,
    entry: () => (0, _glob.sync)('*.html', {
      absolute: true, // Receive absolute paths for matched files.
      cwd: hugoPublishDir, // The current working directory in which to search.
      matchBase: true, // Perform a basename-only match.
      nodir: true, // Do not match directories, only files.
      nosort: true // Do not sort the results.
    }),

    // @see https://webpack.js.org/configuration/output/
    output: {
      filename: '[path][name].[ext]',
      path: outDir,
      publicPath: '/'
    },

    // @see https://webpack.js.org/configuration/dev-server/
    devServer: {
      contentBase: hugoPublishDir,
      inline: false,
      watchContentBase: true
    },

    // @see https://webpack.js.org/configuration/module/
    module: {
      rules: [{
        test: /.html$/i,
        use: ['extricate-loader', {
          loader: 'html-loader',
          options: Object.assign({ interpolate: 'require' }, _htmlMinifier2.default)
        }]
      }, {
        test: /.(gif|jpe?g|png|svg|tiff|webp)$/i,
        use: [{
          loader: 'file-loader',
          options: { name: 'img/[name].[hash:4].[ext]' }
        }, {
          loader: 'image-webpack-loader',
          options: Object.assign({ bypassOnDebug: true }, _imagemin2.default)
        }, 'sharp-image-loader']
      }, {
        test: /favicon\.ico$/,
        loader: 'file-loader?name=img/[path][name].[ext]&context=./app/images'
      }, {
        test: /.jsx?$/i,
        exclude: /node_modules/,
        use: [{
          loader: 'spawn-loader',
          options: { name: 'js/[name].js' }
        }, {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }]]
          }
        }]
      }, {
        test: /.(css|sass|scss)$/i,
        use: [{
          loader: 'file-loader',
          options: { name: 'css/[name].[hash:4].css' }
        }, {
          loader: 'extricate-loader',
          options: { resolve: '\\.js$' }
        }, {
          loader: 'css-loader',
          options: Object.assign({ sourceMap: true }, _cssnano2.default)
        }, {
          loader: 'postcss-loader',
          options: {
            config: {
              ctx: { spritePath: hugoPublishDir },
              path: __dirname
            },
            sourceMap: 'inline'
          }
        }, {
          loader: 'sass-loader',
          options: { outputStyle: 'nested', sourceMap: true }
        }]
      }]
    },

    // @see https://webpack.js.org/configuration/resolve/
    resolve: {
      modules: [hugoPublishDir, (0, _path.resolve)('bower_components/'), (0, _path.resolve)('node_modules/')]
    },

    // @see https://webpack.js.org/configuration/plugins/
    plugins: [new _webpack2.default.EnvironmentPlugin({ NODE_ENV: 'development' }), new _inertEntryWebpackPlugin2.default(), new _uncssWebpackPlugin2.default(), new _copyWebpackPlugin2.default([{ from: '**/*' }], {
      ignore: [// Ignore assets processed by loaders above.
      '*.html', '*.{gif,jpeg,jpg,png,svg,tiff,webp}', '*.{js,jsx}', '*.{css,sass,scss}']
    })]
  };
};

// Default exports.
exports.default = fromConfig({});
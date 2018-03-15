'use strict';

var _url = require('url');

var _postcssAt2x = require('postcss-at2x');

var _postcssAt2x2 = _interopRequireDefault(_postcssAt2x);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

var _postcssSprites = require('postcss-sprites');

var _postcssSprites2 = _interopRequireDefault(_postcssSprites);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Sprite helpers.
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
const filterBy = image => {
  return new Promise((resolve, reject) => {
    const { query } = (0, _url.parse)(image.originalUrl, true);
    return 'sprite' in query ? resolve() : reject();
  });
};

// Package modules.

const groupBy = image => {
  return new Promise((resolve, reject) => {
    const { query } = (0, _url.parse)(image.originalUrl, true);
    return 'sprite' in query && query.sprite.length ? resolve(query.sprite) : reject();
  });
};

// Exports.
// We got to use `module.exports` here, as `postcss-load-config` is not
// compatible with es6 `export default`.
module.exports = ({ file, options, env }) => ({
  plugins: [(0, _postcssAt2x2.default)(), (0, _postcssSprites2.default)({
    filterBy, // Only create sprites for ./file?sprite.
    groupBy, // Group by ./file?sprite=<group>.
    retina: true, // Search for retina mark in the filename.
    spritePath: options.spritePath
  }), (0, _postcssCssnext2.default)()]
});
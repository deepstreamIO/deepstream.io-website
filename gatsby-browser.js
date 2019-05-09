/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// Import global styles
require('./src/css/screen.css');
require('./src/css/global.css');
require('./src/css/section-overview.scss');
require('prismjs/themes/prism-coy.css');

// require('./src/css/reset.css');
// require('./src/css/algolia.css');

// A stub function is needed because gatsby won't load this file otherwise
// (https://github.com/gatsbyjs/gatsby/issues/6759)
exports.onClientEntry = () => {};

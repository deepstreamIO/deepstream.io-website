// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DeepstreamIO',
  tagline: 'The open realtime server: fast and secure events, data-sync and rpc for mobile, web & iot',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/eltons/elton-hive.svg',
  organizationName: 'deepstreamIO', // Usually your GitHub org/user name.
  projectName: 'deepstream.io-website', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/deepstreamIO/deepstream.io-website',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/deepstreamIO/deepstream.io-website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'DeepstreamIO',
        logo: {
          alt: 'DeepstreamIO',
          src: 'img/eltons/elton-hive.svg',
        },
        items: [
          {to: '/docs/tutorials/concepts/what-is-deepstream', label: 'Tutorials', position: 'left'},
          {
            to: 'docs/docs/server/command-line-interface',
            position: 'left',
            label: 'Docs',
          },
          {to: '/docs/guides', label: 'Guides', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/deepstreamIO',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Content',
            items: [
              {
                label: 'Install',
                to: '/docs/tutorials/install/linux/',
              },
              {
                label: 'Tutorials',
                to: '/docs/tutorials/concepts/what-is-deepstream',
              },
              {
                label: 'Documentation',
                to: '/docs/docs/server/command-line-interface',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discussions',
                href: 'https://github.com/deepstreamIO/deepstream.io-website/discussions',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Server changelog',
                href: 'https://github.com/deepstreamIO/deepstream.io/blob/master/CHANGELOG.md',
              },
              {
                label: 'Client changelog',
                href: 'https://github.com/deepstreamIO/deepstream.io-client-js/blob/master/CHANGELOG.md',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} deepstreamHub GmbH and contributors`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

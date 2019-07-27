module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.svg$/
        }
      }
    },
    // {
    //   resolve: `gatsby-plugin-prefetch-google-fonts`,
    //   options: {
    //     fonts: [
    //       {
    //         family: `Roboto`,
    //         variants: [400,300,100,500,700]
    //       },
    //     ],
    //   },
    // },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
      {
          resolve: `gatsby-source-filesystem`,
          options: {
              name: `code-examples`,
              path: `${__dirname}/code-examples`,
          },
      },
      {
          resolve: `gatsby-source-filesystem`,
          options: {
              name: `markdown-template`,
              path: `${__dirname}/markdown-templates`,
          },
      },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-embed-markdown",
            options: {
              directory: `${__dirname}/markdown-templates/`,
            }
          },
          "gatsby-remark-embed-code-relative",
          // {
          //   resolve: `gatsby-remark-prettier`,
          //   options: {
          //     // Look for local .prettierrc file.
          //     // The same as `prettier.resolveConfig(process.cwd())`
          //     usePrettierrc: true,
          //     // Overwrite prettier options, check out https://prettier.io/docs/en/options.html
          //     prettierOptions: {}
          //   },
          // },
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 840,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          "gatsby-remark-autolink-headers",
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
            },
          },
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                glossary: {
                  classes: "glossary"
                },
                info: {
                  classes: "info"
                },
              },
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `gatsby-starter-default`,
    //     short_name: `starter`,
    //     start_url: `/`,
    //     background_color: `#663399`,
    //     theme_color: `#663399`,
    //     display: `minimal-ui`,
    //     icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

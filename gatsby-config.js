module.exports = {
  siteMetadata: {
    title: `deepstream.io`,
    description: `A realtime server for the modern web`,
    author: `deepstreamHub GmbH`,
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
          }
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `deepstream.io`,
        short_name: `deepstream.io`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#0FBBEC`,
        display: `minimal-ui`,
        icon: `static/images/deepstream-elton-logo-startpage.svg`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-63583386-1",
        head: false,
        anonymize: true,
        exclude: [],
        pageTransitionDelay: 0,
        cookieDomain: "deepstream.io",
      },
    },
    {
      resolve: `gatsby-plugin-algolia-docsearch`,
      options: {
        apiKey: '792b342727cbc7164f4ef510b726cfa5', 
        indexName: 'deepstream', 
        inputSelector: '#algolia-docsearch', 
        debug: false // Set debug to true if you want to inspect the dropdown 
      }
    }
  ],
}

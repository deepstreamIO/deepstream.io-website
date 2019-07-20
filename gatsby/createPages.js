'use strict';

const { resolve } = require('path');

module.exports = async ({graphql, actions}) => {
    const { createPage, createRedirect } = actions;

    // Used to detect and prevent duplicate redirects
    const redirectToSlugMap = {};

    const docsTemplate = resolve(__dirname, '../src/templates/docs.tsx');
    const tutorialTemplate = resolve(__dirname, '../src/templates/tutorials.tsx');
    const installTemplate = resolve(__dirname, '../src/templates/install.tsx');
    const infoTemplate = resolve(__dirname, '../src/templates/info.tsx');
    const releaseTemplate = resolve(__dirname, '../src/templates/releases.tsx');

    // Redirect /index.html to root.
    createRedirect({
        fromPath: '/index.html',
        redirectInBrowser: true,
        toPath: '/',
    });

    const allMarkdown = await graphql(
        `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                redirect
                slug,
                weightedSlug,
                githubLink
              },
              frontmatter {
                title,
                description,
                draft,
                logoImage,
                deepstreamVersion
             }
            }
          }
        }
      }
    `,
    );

    if (allMarkdown.errors) {
        console.error(allMarkdown.errors);
        throw Error(allMarkdown.errors);
    }

    const navigation = {}

    allMarkdown.data.allMarkdownRemark.edges.forEach(edge => {
        let { slug, weightedSlug } = edge.node.fields;
        console.log(edge.node.fields)
        const { title, description, draft, deepstreamVersion } = edge.node.frontmatter;

        if (draft) {
            return
        }

        if (deepstreamVersion === 'V3') {
            return
        }

        if (
            slug.includes('install/') ||
            slug.includes('docs/') ||
            slug.includes('tutorials/') ||
            slug.includes('releases/') ||
            slug.includes('info/')
        ) {
            let template;
            if (slug.includes('docs/')) {
                template = docsTemplate;
            } else if (slug.includes('tutorials/')) {
                template = tutorialTemplate;
            } else if (slug.includes('install/')) {
                template = installTemplate;
            } else if (slug.includes('releases/')) {
                template = releaseTemplate;
            } else if (slug.includes('info/')) {
                template = infoTemplate;
            }

            let paths = weightedSlug.split('/').slice(1)
            paths.reduce((nav, path, index, paths) => {
                let order = 100

                const match = path.match(/(\d\d)-(.*)/)
                if (match) {
                    path = match[2]
                }

                if (nav[path] === undefined) {
                    const shorterTitle = title
                        .replace('DataBase Connector', '')
                        .replace('Cache Connector', '')
                        .replace('Endpoint', '')
                        .replace('Logger', '')
                    if (index === paths.length - 2) {
                        const match = paths[paths.length - 2].match(/(\d\d)-(.*)/)
                        if (match) {
                            order = Number(match[1])
                        }
                        nav[path] = {
                            slug,
                            title: shorterTitle,
                            description,
                            leaf: true,
                            order
                        }
                    } else {
                        const match = paths[index].match(/(\d\d)-(.*)/)
                        if (match) {
                            order = Number(match[1])
                        }
                        nav[path] = {
                            order
                        }
                    }
                }
                return nav[path]
            }, navigation)

            const createArticlePage = path => {
                createPage({
                    path: path,
                    component: template,
                    context: {
                        slug,
                        navigation: navigation[paths[0]]
                    },
                });

                createRedirect({
                    fromPath: path.replace('/index.html', '/'),
                    redirectInBrowser: true,
                    toPath: path,
                });
            }

            // Register primary URL.
            createArticlePage(slug);

            // Register redirects as well if the markdown specifies them.
            if (edge.node.fields.redirect) {
                let redirect = JSON.parse(edge.node.fields.redirect);
                if (!Array.isArray(redirect)) {
                    redirect = [redirect];
                }

                redirect.forEach(fromPath => {
                    if (redirectToSlugMap[fromPath] != null) {
                        console.error(
                            `Duplicate redirect detected from "${fromPath}" to:\n` +
                            `* ${redirectToSlugMap[fromPath]}\n` +
                            `* ${slug}\n`,
                        );
                        process.exit(1);
                    }

                    // A leading "/" is required for redirects to work,
                    // But multiple leading "/" will break redirects.
                    // For more context see github.com/reactjs/reactjs.org/pull/194
                    const toPath = slug.startsWith('/') ? slug : `/${slug}`;

                    redirectToSlugMap[fromPath] = slug;
                    createRedirect({
                        fromPath: `/${fromPath}`,
                        redirectInBrowser: true,
                        toPath,
                    });
                });
            }
        }
    });
};


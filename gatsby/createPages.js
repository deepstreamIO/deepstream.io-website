'use strict';

const { resolve } = require('path');

module.exports = async ({graphql, actions}) => {
    const { createPage } = actions;

    const docsTemplate = resolve(__dirname, '../src/templates/docs.tsx');
    const tutorialTemplate = resolve(__dirname, '../src/templates/tutorials.tsx');
    const infoTemplate = resolve(__dirname, '../src/templates/info.tsx');
    const blogTemplate = resolve(__dirname, '../src/templates/blog.tsx');

    const allMarkdown = await graphql(
        `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                slug,
                weightedSlug,
                githubLink
              },
              frontmatter {
                title,
                description,
                draft,
                logoImage,
                deepstreamVersion,
                deepstreamHub
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
        const { title, description, draft, deepstreamVersion, deepstreamHub } = edge.node.frontmatter;

        if (draft || deepstreamVersion === 'V3' || deepstreamHub === true) {
            return
        }

        let weightPattern = /(\d\d)-(.*)/

        if (
            slug.includes('install/') ||
            slug.includes('docs/') ||
            slug.includes('tutorials/') ||
            slug.includes('blog/') ||
            slug.includes('info/')
        ) {
            let template;
            if (slug.includes('docs/')) {
                template = docsTemplate;
            } else if (slug.includes('tutorials/')) {
                template = tutorialTemplate;
            } else if (slug.includes('blog/')) {
                template = blogTemplate;
                weightPattern = /(\d\d\d\d\d\d\d\d)-(.*)/
            } else if (slug.includes('info/')) {
                template = infoTemplate;
            } 

            let paths = weightedSlug.split('/').slice(1)
            paths.reduce((nav, path, index, paths) => {
                let order = 100

                const match = path.match(weightPattern)
                if (match) {
                    path = match[2]
                }

                if (nav[path] === undefined) {
                    if (index === paths.length - 2) {
                        const match = paths[paths.length - 2].match(weightPattern)
                        if (match) {
                            order = Number(match[1])
                        }
                        nav[path] = {
                            slug: slug.replace('index.html', ''),
                            title,
                            description,
                            leaf: true,
                            order
                        }
                    } else {
                        const match = paths[index].match(weightPattern)
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

            createPage({
                component: template,
                path: slug,
                context: {
                    slug,
                    navigation: navigation[paths[0]]
                },
            });
        }
    });
};


const path = require('path');

function buildRedirectString(permalink, redirect_from) {
    if (!permalink || !permalink.endsWith('.html')) {
        return redirect_from ? JSON.stringify(redirect_from) : '';
    }

    let basePath = permalink.slice(0, -'.html'.length);
    let redirects = [basePath, basePath + '/'];
    if (Array.isArray(redirect_from)) {
        redirects = redirects.concat(redirect_from);
    }

    return JSON.stringify(redirects);
}

module.exports = exports.onCreateNode = ({ node, actions, getNode }) => {
    const {createNodeField} = actions;


    switch (node.internal.type) {
        case 'MarkdownRemark':
            const { permalink, redirect_from } = node.frontmatter;
            const { relativePath, sourceInstanceName } = getNode(node.parent);

            let slug = permalink;

            // Github edit link
            createNodeField({
                node,
                name: 'githubLink',
                value: `https://github.com/deepstreamIO/deepstream.io-website/blob/master/content/${relativePath}`
            });

            if (!slug) {
                // This will likely only happen for the partials in /content/home.
                slug = `/${relativePath.replace('.md', '.html')}`;
            }

            // Used to generate URL to view this content.
            createNodeField({
                node,
                name: 'weightedSlug',
                value: slug,
            });

            // Used to generate URL to view this content.
            createNodeField({
                node,
                name: 'slug',
                value: slug.replace(/(\d\d)-/g, ''),
            });

            // Used to generate a GitHub edit link.
            // this presumes that the name in gastby-config.js refers to parent folder
            createNodeField({
                node,
                name: 'path',
                value: path.join(sourceInstanceName, relativePath),
            });

            // Used by createPages() above to register redirects.
            createNodeField({
                node,
                name: 'redirect',
                value: buildRedirectString(permalink, redirect_from),
            });

            return;
    }
};

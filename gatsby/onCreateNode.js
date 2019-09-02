module.exports = exports.onCreateNode = ({ node, actions, getNode }) => {
    const {createNodeField} = actions;


    switch (node.internal.type) {
        case 'MarkdownRemark':
            const { permalink } = node.frontmatter;
            const { relativePath } = getNode(node.parent);

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

            slug = slug.replace('index.html', '');

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

            return;
    }
};

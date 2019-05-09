import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import MarkdownContent from "../components/Markdown/MarkdownContent/MarkdownContent"

interface DocsProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Docs: React.FunctionComponent<DocsProps> = ({ data, location, pageContext }) => (
    <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateDocsMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
      fields {
        path
        slug
      }
    }
  }
`;

export default Docs

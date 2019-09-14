import React from 'react'
import {graphql} from 'gatsby'
import MarkdownContent from '../components/Markdown/MarkdownContent/MarkdownContent'

interface GuidesProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Blog: React.FunctionComponent<GuidesProps> = ({ data, location, pageContext }) => (
    <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateGuidesMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title,
        description
      }
      fields {
        slug,
        githubLink,
        weightedSlug
      }
    }
  }
`;

export default Blog

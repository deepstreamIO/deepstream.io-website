import React from 'react'
import {graphql} from 'gatsby'
import MarkdownContent from '../components/Markdown/MarkdownContent/MarkdownContent'

interface BlogProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Blog: React.FunctionComponent<BlogProps> = ({ data, location, pageContext }) => (
    <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
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

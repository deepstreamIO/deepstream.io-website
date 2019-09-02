import React from 'react'
import {graphql} from 'gatsby'
import MarkdownContent from '../components/Markdown/MarkdownContent/MarkdownContent'

interface InfoProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Info: React.FunctionComponent<InfoProps> = ({ data, location, pageContext }) => (
    <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateInfoMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
      fields {
        slug,
        githubLink
      }
    }
  }
`;

export default Info

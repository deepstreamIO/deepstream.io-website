import React from 'react'
import {graphql} from 'gatsby'
import MarkdownContent from '../components/Markdown/MarkdownContent/MarkdownContent'

interface ReleasesProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Releases: React.FunctionComponent<ReleasesProps> = ({ data, location, pageContext }) => (
    <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateReleasesMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
      fields {
        path
        slug,
        githubLink
      }
    }
  }
`;

export default Releases

import React from 'react';
import {graphql} from 'gatsby';
import MarkdownContent from "../components/Markdown/MarkdownContent/MarkdownContent"

interface TutorialsProps {
    data: any
    location: string,
    pageContext: {
        navigation: any
    }
}

export const Tutorials: React.FunctionComponent<TutorialsProps> = ({ data, location, pageContext }) => (
     <MarkdownContent data={data} location={location} navigation={pageContext.navigation} />
)

export const pageQuery = graphql`
  query TemplateTutorialsMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title,
        description
      }
      fields {
        path
        slug
      }
    }
  }
`;


export default Tutorials

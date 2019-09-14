import * as React from 'react'
import {Layout} from "../../components/General/Layout/Layout"
import {HeroType} from "../../components/General/Hero/Hero"
import {Hero} from "../../components/General/Hero/Hero"
import {graphql} from "gatsby"
import { BlogEntries } from '../../components/Blog/BlogEntries/BlogEntries';

export default (props: any) => (<Layout>
    <Hero type={HeroType.blog}/>
    <BlogEntries edges={props.data.allMarkdownRemark.edges}/>
</Layout>)

export const pageQuery = graphql`
{
allMarkdownRemark(
    filter: {
    fields: {slug: {regex: "/blog/"}},
    frontmatter: {
        draft: {ne: true},
        deepstreamVersion: {ne: "V3"}
    }
},
limit: 1000
) {
    edges {
        node {
            fields {
                slug,
                weightedSlug,
            }
            frontmatter {
                title,
                description,
                logoImage,
                blogImage {
                    childImageSharp {
                        fixed(quality: 50, width: 50) {
                          ...GatsbyImageSharpFixed
                        }
                    }
                  }
            }
        }
    }
}
}`;


import * as React from 'react'
import {TutorialsGuides} from "../../components/Tutorial/TutorialGuides/TutorialGuides"
import {Layout} from "../../components/General/Layout/Layout"
import {HeroType} from "../../components/General/Hero/Hero"
import {Hero} from "../../components/General/Hero/Hero"
import {graphql} from "gatsby"

export default (props: any) => (<Layout>
    <Hero type={HeroType.tutorials}/>
    {/*<TutorialsOverview/>*/}
    <TutorialsGuides edges={props.data.allMarkdownRemark.edges}/>
</Layout>)

export const pageQuery = graphql`
{
allMarkdownRemark(
    filter: {
    fields: {slug: {regex: "/tutorials/"}},
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
                slugDir
            }
            frontmatter {
                title,
                description,
                logoImage
            }
        }
    }
}
}`;


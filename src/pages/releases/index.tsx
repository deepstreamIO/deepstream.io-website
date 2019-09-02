import cn from 'classnames'
import * as React from 'react'

import style from './releases.module.css'

import { Layout } from "../../components/General/Layout/Layout"
import { Section } from "../../components/General/Section/Section"
import { graphql, Link } from "gatsby"

const Release = ({ release }) => {
    const {version, description, slug } = release
    return <li className={style.release}>
        <Link to={slug}>
            <div className={style.releaseVersion}>
                <label className={style.label}>Version:</label>
                <span className={style.version}>{version}</span>
            </div>
            <div className={style.releaseDescription}>
                <label className={style.label}>Description:</label>
                <p className={style.description}>{description}</p>
            </div>
        </Link>
    </li>
}

export default ({ data }) => {
    const releases = data.allMarkdownRemark.edges.reduce((result, { node }) => {
        const parts = node.fields.slug.split('/')
        const component = parts[2]
        const version = parts[3].replace(/-/g, '.')
        const release = {
            version,
            slug: node.fields.slug,
            description: node.frontmatter.description
        }
        if (!result[component]) {
            result[component] = [release]
        } else {
            result[component].push(release)
        }
        return result
    }, {}) 
    return <Layout pageClass="releases-page">
        <Section className={style.server}>
                <h2>Server releases</h2>
                <ul className={style.releases}>{releases.server.map(release => <Release key={release.version} release={release} />)}</ul>
        </Section>

        <Section className={style.clients}>
                <h2>Javascript/Node releases</h2>
                <ul className={style.releases}>{releases['client-js'].map(release => <Release key={release.version} release={release} />)}</ul>
        </Section>
    </Layout>
}

export const pageQuery = graphql`
{
allMarkdownRemark(
    filter: {
    fields: {slug: {regex: "/releases/"}},
    frontmatter: {draft: {ne: true}}
},
limit: 1000
) {
    edges {
        node {
            fields {
                slug,
            }
            frontmatter {
                title,
                description
            }
        }
    }
}
}`;


import * as React from "react"
import {Section} from "../../General/Section/Section"
import * as style from './BlogEntries.module.css'
import Img from 'gatsby-image'
import { Link } from "gatsby"

interface BlogEntriesProps {
    edges: Array<{
        "node": {
            "fields": {
                "slug": string,
                "weightedSlug": string,
            },
            "frontmatter": {
                "title": string,
                "description": string,
                "blogImage": any
            }
        }
    }>
}

export const BlogEntries: React.FunctionComponent<BlogEntriesProps> = ({ edges }) => {
    const entries = edges.map(({ node }) => {
        const entry = {
            slug: node.fields.slug,
            description: node.frontmatter.description,
            blogImage: node.frontmatter.blogImage,
            title: node.frontmatter.title,
            dateISO: 12121234,
            type: 'default'
        }

        const weightedPaths = node.fields.weightedSlug.split('/')
        entry.dateISO = Number(weightedPaths[weightedPaths.length -2 ].match(/(\d\d\d\d\d\d\d\d)-/)![1])
        entry.type = weightedPaths[weightedPaths.length -2 ].match(/[^-]*-([^-]*)-/)![1]
        return entry
    }).sort((a, b) => b.dateISO - a.dateISO)

    return <Section className="section-overview">
        <div className={style.entries}> 
        {entries.map(entry =>
            <Link to={entry.slug} className={`${style.entry} ${style[entry.type]}`} key={entry.slug}>
                {entry.blogImage && <Img fixed={entry.blogImage.childImageSharp.fixed} />}
                {!entry.blogImage && <img src="/images/eltons/elton-info.svg" />}
                <span>
                    <h2 className={style.title}>{entry.title}</h2>
                    <p className={style.description}>{entry.description}</p>
                </span>
            </Link>
        )}
        </div>
    </Section>
}

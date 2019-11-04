import * as React from "react"
import {Section} from "../../General/Section/Section"
import {Entry} from "../Entry/Entry"
import { Link } from "gatsby";

interface TutorialsOverviewProps {
    edges: Array<{
        "node": {
            "fields": {
                "slug": string,
                "weightedSlug": string,
            },
            "frontmatter": {
                "title": string,
                "description": string,
                "logoImage": string
            }
        }
    }>
}

interface CategoryProps {
    title: string,
    entries?: any,
    entry?: any
}

const Category: React.FunctionComponent<CategoryProps> = ({ title, entries, entry }) => {
    let children = null
    if (entries) {
        const keys = Object.keys(entries).sort((a,b) => entries[a].weight - entries[b].weight)
        children = keys.map(key => <Entry key={key} entry={entries[key]}/>)
    } else {
        children = [<Entry key="1" entry={entry} />]
    }

    if (children.length > 5) {
        let result = []
        while (children.length !== 0) {
            result.push(
                <div className="category-page" key={result.length}>
                    {children.splice(0, 3)}
                </div>
            )
        }
        
        return  <div className="category-pages">
            <h3><a>{title}</a></h3>
            {result}
        </div>
    }

    return  <div className="category">
        <h3><a>{title}</a></h3>
        {children}
    </div>
}

export const TutorialsGuides: React.FunctionComponent<TutorialsOverviewProps> = ({ edges }) => {
    const sections: any = {}

    edges.forEach(({ node }) => {
        const entry = {
            slug: node.fields.slug,
            description: node.frontmatter.description,
            logoImage: node.frontmatter.logoImage,
            title: node.frontmatter.title,
            weight: 100
        }
        const weightedPaths = node.fields.weightedSlug.split('/')
        if (weightedPaths[weightedPaths.length -2 ].match(/(\d\d)-/)) {
            entry.weight = Number(weightedPaths[weightedPaths.length -2 ].match(/(\d\d)-/)![1])
        }
        let paths = node.fields.slug.split('/')
       

        if (!sections[paths[2]]) {
            sections[paths[2]] = {}
        }

        if (paths.length === 6) {
            if (!sections[paths[2]][paths[3]]) {
                sections[paths[2]][paths[3]] = {}
            }
            sections[paths[2]][paths[3]][paths[4]] = entry
        } else if (paths.length === 7) {
            if (!sections[paths[2]][paths[3]]) {
                sections[paths[2]][paths[3]] = {}
            }
            if (!sections[paths[2]][paths[3]][paths[4]]) {
                sections[paths[2]][paths[3]][paths[4]] = {}
            }
            sections[paths[2]][paths[3]][paths[4]][paths[5]] = entry
        } else {
            sections[paths[2]][paths[3]] = entry
        }
    })

    return <Section className="section-overview">
        <Section columnClassName="entries" columns={[
            <div>
                <h2>Introduction</h2>
                {Object.keys(sections.concepts).map((key: any) =>
                    <Link className="entry" key={key} to={sections.concepts[key].slug} title={sections.concepts[key].description}>
                        <h4>{sections.concepts[key].title}</h4>
                    </Link>
                )}
            </div>,
            <div>
                <h2>Getting Started</h2>
                <Category title="Getting Started" entries={sections['getting-started']} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Install</h2>
                <Category title="Install" entries={sections.install} />
                <Category title="Devops" entries={sections.devops} />
            </div>,
            <div>
                <h2>Core Features</h2>
                <Category title="Data-Sync" entries={sections.core.datasync} />
                <Category title="Events" entry={sections.core.pubsub} />
                <Category title="RPC" entry={sections.core['request-response']} />
                <Category title="Presence" entry={sections.core.presence} />
            </div>
        ]} />
            
        <Section columnClassName="entries" columns={[
            <div>
                <h2>Security</h2>
                <Category title="Authentication" entries={sections.core.auth} />
                <Category title="Permissioning" entries={sections.core.permission} />
            </div>,
            <div>
                <h2>Frameworks</h2>
                <Category title="Frontend" entries={sections.integrations.frontend} />
                <Category title="Mobile" entries={sections.integrations.mobile} />
            </div>,
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Connectors</h2>
                <Category title="HTTP Service" entries={sections.plugins['http-service']} />
                <Category title="Endpoint" entries={sections.plugins['connection-endpoint']} />
                <Category title="DataBase" entries={sections.plugins.database} />
                <Category title="Cache" entries={sections.plugins.cache} />
                <Category title="Monitoring" entries={sections.plugins.monitoring} />
                <Category title="Cluster" entries={sections.plugins.clusternode} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Extending deepstream</h2>
                <Category title="Writing your own plugin" entries={sections['custom-plugins']} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Upgrade Guides</h2>
                <Category title="Upgrading to V4" entries={sections['upgrade-guides'].v4} />
                <Category title="Upgrading to V5" entries={sections['upgrade-guides'].v5} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Example Applications Walkthrough</h2>
                <Category title="Example Applications" entries={sections['example-apps']} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>WebRTC</h2>
                <Category title="WebRTC" entries={sections.webrtc} />
            </div>
        ]} />

    </Section>
}

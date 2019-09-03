import * as React from "react"
import {Section} from "../../General/Section/Section"
import {Entry} from "../Entry/Entry"

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
        children = [<Entry key="single" entry={entry} />]
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
                <h2>Core Concepts</h2>
                <Category key="data-sync" title="Data-Sync" entries={sections.core.datasync} />
                <Category key="events" title="Events" entry={sections.core.pubsub} />
                <Category key="rpc" title="RPC" entry={sections.core['request-response']} />
                <Category key="presence" title="Presence" entry={sections.core.presence} />
            </div>,
            <div>
                <h2>Security</h2>
                <Category key="authentication" title="Authentication" entries={sections.core.auth} />
                <Category key="permissioning" title="Permissioning" entries={sections.core.permission} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Frameworks</h2>
                <Category title="Frontend Frameworks" entries={sections.integrations.frontend} />
                <Category title="Mobile Frameworks" entries={sections.integrations.mobile} />
            </div>,
            <div>
                <h2>Example Applications</h2>
                <Category title="Example Applications" entries={sections['example-apps']} />
            </div>,
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Connectors</h2>
                <Category title="DataBase Connectors" entries={sections.plugins.database} />
                <Category title="Cache Connectors" entries={sections.plugins.cache} />
                {/*<Category title="Endpoint Connectors" entries={sections.plugins.endpoint} />*/}
                {/*<Category title="Logger Connectors" entries={sections.plugins.logger} />*/}
            </div>,
            <div>
                <h2>Working with deepstream</h2>
                 <Category title="Server" entries={sections.core.server} />
                 <Category title="Usage with other Servers" entries={sections.integrations['other-servers']} />
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
                <h2>Cloud</h2>
                <Category title="Deployment &amp; PaaS" entries={sections.integrations.cloud} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Upgrade Guides</h2>
                <Category title="Upgrading to V4" entries={sections['upgrade-guides'].v4} />
            </div>,
            <div>
                <h2>WebRTC</h2>
                <Category title="WebRTC" entries={sections.webrtc} />
            </div>
        ]} />
    </Section>
}

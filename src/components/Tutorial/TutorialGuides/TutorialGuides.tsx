import * as React from "react"
import {Section} from "../../General/Section/Section"
import {Entry} from "../Entry/Entry"

interface TutorialsOverviewProps {
    edges: Array<{
        "node": {
            "fields": {
                "slug": string
            },
            "frontmatter": {
                "title": string,
                "description": string,
                "icon": string
            }
        }
    }>
}

interface CategoryProps {
    title: string,
    entries?: any,
    entry?: any
}

const Category: React.FunctionComponent<CategoryProps> = ({ title, entries, entry}) => {
    let children = null
    if (entries) {
        const keys = Object.keys(entries).sort()
        children = keys.map(key => <Entry key={key} entry={entries[key]}/>)
    } else {
        children =  <Entry entry={entry} />
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
            icon: node.frontmatter.icon,
            title: node.frontmatter.title,
        }
        const paths = entry.slug.split('/')
        if (!sections[paths[2]]) {
            sections[paths[2]] = {}
        }

        if (paths.length === 6) {
            if (!sections[paths[2]][paths[3]]) {
                sections[paths[2]][paths[3]] = {}
            }
            sections[paths[2]][paths[3]][paths[4]] = entry
        } else {
            sections[paths[2]][paths[3]] = entry
        }
    })

    return <Section className="section-overview">
        <Section columnClassName="entries" columns={[
            <div>
                <h2>Core Concepts</h2>
                <Category title="Data-Sync" entries={sections.core.datasync} />
                <Category title="Events" entry={sections.core.pubsub} />
                <Category title="RPC" entry={sections.core['request-response']} />
                <Category title="Presence" entry={sections.core.presence} />
            </div>,
            <div>
                <h2>Security</h2>
                <Category title="Authentication" entries={{
                ...sections.core.auth,
                // 'jwt-auth': sections.guides['jwt-auth']
            }} />
            <Category title="Permissioning" entries={{
                ...sections.core.permission,
                'user-specific-data': sections.guides['user-specific-data'],
                permissioning: sections.guides.permissioning,
            }} />
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
                <Category title="Applications" entries={sections.guides.apps} />
                {/*<Category title="Games" entries={sections.guides.games} />*/}
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
                 <Category title="Usage with other Servers" entries={sections.integrations.other} />
            </div>
        ]} />

        <Section columnClassName="entries" columns={[
            <div>
                <h2>Cloud</h2>
                <Category title="Deployment &amp; PaaS" entries={sections.integrations.cloud} />
            </div>
        ]} />
    </Section>
}

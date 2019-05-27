// ---
//     title: deepstream.io installation and integrations
// description: Install deepstream on Debian, Ubuntu, CentOs, AWS Linux, Mac and Windows
// tags: javascript, java, IoS, react, knockout
// ---

import cn from 'classnames'
import * as React from 'react'

import './install.scss'
import style from './install.module.css'

import { Layout } from "../../components/General/Layout/Layout"
import { InstallBlock } from "../../components/Install/InstallBlock/InstallBlock"
import { Section } from "../../components/General/Section/Section"
import {graphql} from "gatsby"

export default () => (<Layout pageClass="install-page">
    <Section className={style.server}>
            <h2>deepstream.io server</h2>
            <p>
                the deepstream server comes as standalone executable for Mac and Windows and as package for major Linux distributions.
            </p>
            <div className={cn(style.distroGrid, style.blockLink)}>
                <InstallBlock url="/install/osx/" img="/images/install/osx.png" name="OS X" />
                <InstallBlock url="/install/windows/" img="/images/install/windows.png" name="Windows" />
                <InstallBlock url="/install/ubuntu/" img="/images/install/ubuntu.png" name="Ubuntu" />
                <InstallBlock url="/install/centos/" img="/images/install/centos.png" name="CentOs" />
                <InstallBlock url="/install/debian/" img="/images/install/debian.png" name="Debian" />
                <InstallBlock url="/install/aws-linux/" img="/images/install/aws.png" name="Amazon Linux AMI" />
            </div>

            <p className={style.otherServer}>
                or use the official docker image or compose file to make using deepstream within your container architecture a breeze. deepstream also can be installed via NPM and used from Node.js
            </p>
            <div className={cn(style.otherServerGrid, style.blockLink)}>
                <InstallBlock url="/install/docker-image/" img="/images/install/docker.png" name="Docker Image" />
                <InstallBlock url="/install/docker-compose/" img="/images/install/compose.png" name="Compose File" />
                <InstallBlock url="/install/npm/" img="/images/install/npm.png" name="NPM package (Node.js)" />
            </div>
    </Section>

    <Section className={style.clients}>
            <h2>deepstream.io clients</h2>
            <p>
                deepstream clients let you connect to the server. The JavaScript client is polished and battletested, other clients are under development. Contributions are welcome, if you'd like to get involved meet us on <a href="https://github.com/deepstreamIO/deepstream.io/issues?q=is%3Aopen+is%3Aissue+label%3Anew-client">Github</a>.
            </p>
            <div className={cn(style.clientGrid, style.blockLink)}>
                <InstallBlock url="/tutorials/guides/getting-started-quickstart/#getting-the-client" img="/images/install/javascript.png" name="Browser / Node" />
                <InstallBlock url="/install/java" img="/images/install/java.png" name="Java" soon={true} />
                <InstallBlock url="/install/android" img="/images/install/android.png" name="Android" soon={true} />
                <InstallBlock url="/docs/client-swift/AnonymousRecord/" img="/images/install/ios.png" name="iOS" soon={true} />
                <InstallBlock url="https://github.com/deepstreamIO/deepstream.io/issues/72" img="/images/install/python.png" name="Python" soon={true} />
                <InstallBlock url="https://github.com/deepstreamIO/deepstream.io/issues/70" img="/images/install/dotnet.png" name=".NET" soon={true} />
            </div>
    </Section>

    <Section className={style.connector}>
            <h2>connectors</h2>
            <p>
                deepstream can integrate with databases, caches and message busses using connectors:
            </p>
            <h3 className={style.subheading}>cache connectors</h3>
            <div className={cn(style.connectorsGrid, style.blockLink)}>
                <InstallBlock url="/tutorials/plugins/cache/redis/" img="/images/install/redis.png" name="Redis" />
                <InstallBlock url="/tutorials/plugins/cache/hazelcast/" img="/images/install/hazelcast.png" name="Hazelcast" />
                <InstallBlock url="/tutorials/plugins/cache/memcached/" img="/images/install/memcached.png" name="memcached" />
            </div>
            <h3 className={style.subheading}>database connectors</h3>
            <div className={cn(style.connectorsGrid, style.blockLink)}>
                <InstallBlock url="/tutorials/plugins/database/postgres/" img="/images/install/postgres.png" name="Postgres" />
                <InstallBlock url="/tutorials/plugins/database/mongodb/" img="/images/install/mongodb.png" name="MongoDB" />
                <InstallBlock url="/tutorials/plugins/database/elasticsearch/" img="/images/install/elasticsearch.png" name="ElasticSearch" />
                <InstallBlock url="/tutorials/plugins/database/rethinkdb/" img="/images/install/rethinkdb.png" name="RethinkDB" />
                {/*<InstallBlock url="/tutorials/database/db-leveldb/" img="/images/install/leveldb.png" name="LevelDB" />*/}
                {/*<InstallBlock url="/tutorials/database/db-couchdb/" img="/images/install/couchdb.png" name="CouchDB" />*/}
                {/*<InstallBlock url="/tutorials/database/db-dynamodb/" img="/images/install/dynamodb.png" name="Amazon DynamoDB" />*/}
            </div>
    </Section>

    <Section className={style.other}>
        <h2>Library support</h2>
        <p>
            deepstream comes with a few extra bits that make working with other libraries easier
        </p>
        <div className={cn(style.connectorsGrid, style.blockLink)}>
            <InstallBlock url="/tutorials/integrations/frontend-react/" img="/images/install/reactjs.png" name="React" />
            <InstallBlock url="/tutorials/integrations/frontend-polymer/" img="/images/install/polymerjs.png" name="Polymer" />
            <InstallBlock url="/tutorials/integrations/frontend-knockout/" img="/images/install/knockoutjs.png" name="Knockout.js" />
            <InstallBlock url="/tutorials/integrations/db-rethinkdb/#search-provider" img="/images/install/rethinkdb.png" name="RethinkDB Search Provider" />
        </div>
    </Section>
</Layout>)

export const pageQuery = graphql`
{
allMarkdownRemark(
    filter: {
    fields: {slug: {regex: "/install/"}},
    frontmatter: {draft: {ne: true}}
},
limit: 1000
) {
    edges {
        node {
            fields {
                slug
            }
            frontmatter {
                title,
                description,
                installImage
            }
        }
    }
}
}`;


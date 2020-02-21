import './docs.scss'
import * as React from 'react'
import {Link} from "gatsby"
import {Section} from "../../components/General/Section/Section"
import {Layout} from "../../components/General/Layout/Layout"

export default () => (
    <Layout>
        <Section className="section-overview docs">
            <div className="wrapper">
                <Link to="/docs/client-js/client/">
                    <img src="/images/logos/javascript.png" width="100" height="100" />
                    JavaScript Client API
                </Link>
                <Link to="/docs/client-java-v2/DeepstreamClient/">
                    <img src="/images/logos/java.png" width="100" height="100" />
                    Java Client API (V2)
                </Link>
                <Link to="/docs/client-http/v1/">
                    <img src="/images/logos/http.png" width="100" height="100" />
                    HTTP API
                </Link>
                <Link to="/docs/server/configuration/">
                    <img src="/images/logos/server.png" width="100" height="100" />
                    Server
                </Link>
            </div>
        </Section>
    </Layout>
)


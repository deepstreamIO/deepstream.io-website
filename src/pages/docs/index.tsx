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
                    <img src="/images/install/javascript.png" width="100" height="100" />
                    JavaScript Client API
                </Link>
                <Link to="/docs/client-http/v1/">
                    <img src="/images/logos/http.png" width="100" height="100" />
                    HTTP API
                </Link>
                <Link to="/docs/client-php/DeepstreamClient/">
                    <img src="/images/logos/php.png" width="100" height="100" />
                    PHP API
                </Link>

                <Link to="/docs/server/configuration/">
                    <img src="/images/install/server.png" width="100" height="100" />
                    Server Configuration &amp; CLI
                </Link>
            </div>
        </Section>
    </Layout>
)


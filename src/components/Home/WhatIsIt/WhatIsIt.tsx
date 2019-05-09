import './WhatIsIt.scss'
import * as React from "react"
import {Section} from "../../General/Section/Section"

import osDiagram from './images/os-diagram.png'

export const WhatIsIt = () => (
        <Section className="what-is-it">
            <ul className="general">
                <li>
                    <h3>what is it?</h3>
                    <p>deepstream is an open source server inspired by concepts behind financial trading
                        technology. It allows clients and backend services to sync data, send messages and make
                        rpcs at very high speed and scale</p>
                </li>
                <li>
                    <h3>how do I use it?</h3>
                    <p>Deepstream is installed like most http servers or databases – via yum, apt &amp; co on
                        Linux, brew on Mac or as downloadable Mac &amp; Windows executable. To connect and
                        interact with the deepstream server you need a SDK, currently available for JS, Node,
                        Java, Android, iOS, C++ or PHP and coming soon for .NET, Python and Go.</p>
                </li>
            </ul>

            <img src={osDiagram} />

            <div className="divider"></div>

            <h2>core features</h2>
            <ul className="core-features">
                <li>
                    <h3>records <small>realtime document sync</small></h3>
                    <p>records are schema-less, persistent documents that can be manipulated and observed.
                        Any change is synchronized with all connected clients and backend processes in
                        milliseconds. Records can reference each other and be arranged in lists to allow
                        modelling of relational data</p>
                </li>
                <li>
                    <h3>events <small>publish subscribe messaging</small></h3>
                    <p>events allow for high performance, many-to-many messaging. deepstream provides topic
                        based routing from sender to subscriber, data serialisation and subscription
                        listening.</p>
                </li>
                <li>
                    <h3>rpcs <small>request response workflows</small></h3>
                    <p>remote procedure calls allow for secure and highly available request response
                        communication. deepstream handles load-balancing, failover, data-transport and
                        message routing.</p>
                </li>
            </ul>

        </Section>
    )

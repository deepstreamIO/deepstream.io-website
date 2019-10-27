import './WhatIsIt.scss'
import * as React from "react"
import {Section} from "../../General/Section/Section"

import osDiagram from './images/os-diagram.png'

export const WhatIsIt = () => (
        <Section className="what-is-it">
            <ul className="general">
                <li>
                    <h3>what is it?</h3>
                    <p>deepstream is an open source server inspired by the concepts behind financial trading
                        technology. It allows clients and backend-services to sync data, send messages and make
                        rpcs at very high speed and scale.</p>
                </li>
                <li>
                    <h3>how do I use it?</h3>
                    <p>Deepstream can be run as an executable, using docker or via node. You can connect and
                        interact with the deepstream server via our client SDKs, MQTT or via its HTTP API.</p>
                </li>
            </ul>

            <img src={osDiagram} />

            <div className="divider"></div>

            <h2>core features</h2>
            <ul className="core-features">
                <li>
                    <h3>records <small>realtime document sync</small></h3>
                    <p>records are schema-less, persistent documents that can be manipulated and observed.
                        Any change is synchronized with all connected clients and backend processes within
                        milliseconds. Records can reference each other and can be arranged in lists to allow
                        for the modelling of relational datastructures.</p>
                </li>
                <li>
                    <h3>events <small>publish-subscribe messaging</small></h3>
                    <p>events allow for high-performance, many-to-many messaging. deepstream provides topic
                        based routing from publisher to subscriber, data-serialization and subscription
                        listening.</p>
                </li>
                <li>
                    <h3>rpcs <small>request-response workflows</small></h3>
                    <p>remote procedure calls allow for secure and highly available request-response
                        communication. deepstream handles load-balancing, failover, data-transport and
                        message routing.</p>
                </li>
            </ul>
            <ul className="core-features" style={{ marginTop: '50px' }}>
                <li>
                    <h3>presence <small>monitoring who is online</small></h3>
                    <p>presence allows you to query deepstream for the status of logged-in users and
                        subscribe to anyone logging in or out across the entire cluster.
                    </p>
                </li>
                <li>
                    <h3>listening <small>reactive subscriptions</small></h3>
                    <p>
                    listening enables you to monitor your client's subscriptions actively and only provide
                    data when it's actually needed. This significantly reduces data-throughput and costs,
                    especially across larger micro-service architectures.
                    </p>
                </li>
                <li>
                    <h3>security <small>authorize everything</small></h3>
                    <p>
                        deepstream's finegrained identity and permission system allows you to permission each connection
                        and message going through your system. Easily accept or deny messages in realtime based on
                        user roles, data or even cross references to existing records.
                    </p>
                </li>
            </ul>

        </Section>
    )

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
                    <p>Deepstream can be run as a executable on Linux, Mac &amp; Windows executable. To connect and
                        interact with the deepstream server you need a SDK or via HTTP.</p>
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
                        listening</p>
                </li>
                <li>
                    <h3>rpcs <small>request response workflows</small></h3>
                    <p>remote procedure calls allow for secure and highly available request response
                        communication. deepstream handles load-balancing, failover, data-transport and
                        message routing</p>
                </li>
            </ul>
            <ul className="core-features" style={{ marginTop: '50px' }}>
                <li>
                    <h3>presence <small>monitoring who is online</small></h3>
                    <p>presences allows users to query deepstream for the status of logged in users and 
                        subscribe to anyone logging in or out over the state of the entire cluster
                    </p>
                </li>
                <li>
                    <h3>listening <small>responsive subscriptions</small></h3>
                    <p>
                        deepstream was built to help you manage your microservices and keep data transfer
                        and costs down to a minimum. Listening is a powerful tool that allows your microservices
                        to be aware of the active requirements of all applications and only publish realtime-data 
                        when it's actually needed
                    </p>
                </li>
                <li>
                    <h3>security <small>authorize everything</small></h3>
                    <p>
                        deepstream have a powerful security blanket that allows you to permission each connection
                        and message going through your system. Easily allow or deny messages in realtime based on 
                        user roles, data or even the content of another record
                    </p>
                </li>
            </ul>

        </Section>
    )

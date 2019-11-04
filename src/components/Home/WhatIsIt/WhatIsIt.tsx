import style from './WhatIsIt.module.css'
import './WhatIsIt.scss'
import * as React from "react"
import {Section} from "../../General/Section/Section"

export const WhatIsIt = () => (
        <Section className="what-is-it">
            <div className={style.why}>
                <h3 className={style.whyTitle}>Why deepstream?</h3>
                <p className={style.whyDescription}>
                    deepstream allows clients and backend-services to sync data, send events and 
                    more with a heavy focus on security. Configure everything server side without writing
                    a line of code while still connecting to your favorite cache, database, message
                    bus and more.
                </p>
            </div>

            <ul className="core-features">
                <li>
                    <h3>records <small>realtime document sync</small></h3>
                    <p>Interactive JSON documents that can be edited and observed. Changes are persisted and synced across clients and saved in cache/storage.</p>
                </li>
                <li>
                    <h3>events <small>publish-subscribe messaging</small></h3>
                    <p>Many clients can subscribe to topics and receive data whenever other clients publish it to the same topic.</p>
                </li>
                <li>
                    <h3>rpcs <small>request-response workflows</small></h3>
                    <p>Clients can register functions to be called by other clients. deepstream will smartly route requests and responses.</p>
                </li>
            </ul>
            <ul className="core-features" style={{ marginTop: '50px' }}>
                <li>
                    <h3>presence <small>monitoring who is online</small></h3>
                    <p>Query deepstream for online users and subscribe to login/logout events</p>
                </li>
                <li>
                    <h3>listening <small>reactive subscriptions</small></h3>
                    <p>Let your services be told whenever a new topic is subscribed to, letting you serve realtime data on demand</p>
                </li>
                <li>
                    <h3>security <small>authorize everything</small></h3>
                    <p>authenticate and permission everything from the user down to each message</p>
                </li>
            </ul>
        </Section>
    )

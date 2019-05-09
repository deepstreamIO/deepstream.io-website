import {Section} from "../../General/Section/Section"
import * as React from "react"
import './CoreConcepts.scss'

import DataSyncIcon from './images/icon-data-sync.svg'
import { IoIosPaperPlane, IoIosSync } from 'react-icons/io'

export const CoreConcepts = () => (
    <Section className="core-concepts">
        <h2 className="section-headline">core concepts</h2>
        <ul>
            <li>
                <div className="icon">
                    <DataSyncIcon />
                </div>
                <h3>data-sync</h3>
                <p>Interactive JSON documents that can be edited and observed. Changes are persisted and synced across clients.</p>
            </li>
            <li>
                <div className="icon">
                    <IoIosPaperPlane />
                </div>
                <h3>publish-subscribe</h3>
                <p>Many clients can subscribe to topics and receive data whenever other clients publish it to the same topic.</p>
            </li>
            <li>
                <div className="icon">
                    <IoIosSync />
                </div>
                <h3>request-response</h3>
                <p>Clients can register functions to be called by other clients. deepstream will smartly route requests and responses.
                </p>
            </li>
        </ul>
    </Section>
)

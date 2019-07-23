import * as React from "react"
import {Section} from "../../General/Section/Section"
import Image from './4.0-release.jpg'

export const V4Release = () => (
        <Section>
            <img src={Image} />
            <div>
                <h4>features</h4>
                <ul>
                    <li>Offline Support</li>
                    <li>Powerful Plugin API</li>
                    <li>Binary Protobuf Protocol</li>
                    <li>Promises Everywhere</li>
                    <li>Monitoring</li>
                    <li>Cluster Support</li>
                </ul>
            </div>
        </Section>
    )

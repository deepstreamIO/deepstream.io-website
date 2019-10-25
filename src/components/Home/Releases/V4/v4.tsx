import * as React from "react"
import {Section} from "../../../General/Section/Section"
import * as style from './V4Release.module.css'
import { Link } from "gatsby"

export const V4Release = () => (
        <Section className={style.V4Release}>
            <h4>🎉 <Link to="/releases/server/v4-0-0/">V4 Release</Link> 🎉</h4>
            <ul className={style.content}>
                <li><Link to="/releases/client-js/v4-0-0/index.html#offline-storage">Offline Support</Link></li>
                <li><Link to="/releases/client-js/v4-0-0/index.html#backwards-compatibility">Promises Everywhere</Link></li>
                <li><Link to="/releases/client-js/v4-0-0/index.html#typescript">100% Typescript</Link></li>
                <li><Link to="/releases/client-js/v4-0-0/index.html#bulk-subscription-service">Bulk Actions</Link></li>
            </ul>
            <img className={style.image} src="images/eltons/elton-party.svg"/>
            <ul className={style.content}>
                <li><Link to="/tutorials/custom-plugins/an-overview/">Powerful Plugin API</Link></li>
                <li><Link to="/releases/server/v4-0-0/index.html#binary-protocol">Binary Protobuf Protocol</Link></li>
                <li><Link to="/tutorials/custom-plugins/monitoring/">Monitoring</Link></li>
                <li><Link to="/tutorials/custom-plugins/cluster-node/">Cluster Support</Link></li>
            </ul>
        </Section>
    )
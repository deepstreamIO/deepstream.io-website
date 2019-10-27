import * as React from "react"
import {Section} from "../../../General/Section/Section"
import * as style from './V5.module.css'
import { Link } from "gatsby"

export const V5 = () => (
        <Section className={style.release}>
            <h4>🎉 <Link to="/releases/server/v5-0-0/">V5 Release</Link> 🎉</h4>
            <ul className={style.content}>
                <li><Link to="/blog/20190920-release-deepstream-5.0/#back-to-mit-license">MIT License</Link></li>
                <li><Link to="/blog/20190920-release-deepstream-5.0/#single-http-service">Single HTTP Server</Link></li>
                <li><Link to="/blog/20190920-release-deepstream-5.0/#opensource-clustering-support">OpenSource Clustering Support</Link></li>
                <li><Link to="/blog/20190920-release-deepstream-5.0/#embedded-dependencies">Embedded Dependencies</Link></li>
            </ul>
            <img className={style.image} src="images/eltons/elton-zombie.svg"/>
            <ul className={style.content}>
                <li><Link to="/blog/20190920-release-deepstream-5.0/#combined-authentication-handler">Combined Auth Handler</Link></li>
                <li><Link to="/tutorials/plugins/monitoring/http/">HTTP Monitoring</Link></li>
                <li><Link to="/tutorials/core/auth/storage/">Storage Authentication</Link></li>
                <li><Link to="/guides/">Guides</Link></li>
            </ul>
        </Section>
    )
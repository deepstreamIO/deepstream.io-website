import {Section} from "../../General/Section/Section"
import * as React from "react"
import './GettingStarted.scss'

import { IoIosSpeedometer, IoIosBook } from 'react-icons/io'

export const GettingStarted = () => (
    <Section className="getting-started">
        <h2 className="section-headline">getting started</h2>
        <div className="main">
            <a href="/tutorials/core/getting-started-quickstart/" className="first">
                <div className="icon"><IoIosSpeedometer /></div>
                <h3>Quickstart</h3>
                <p>Get up and running with deepstream in 10 minutes or less</p>
            </a>
            <a href="/tutorials/">
                <div className="icon"><IoIosBook /></div>
                <h3>Tutorials</h3>
                <p>Learn more about deepstream's features and integrations</p>
            </a>
        </div>
    </Section>
)

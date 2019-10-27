import {Section} from "../../General/Section/Section"
import * as React from "react"
import './GettingStarted.scss'

import { IoIosSpeedometer, IoIosBook } from 'react-icons/io'

export const GettingStarted = () => (
    <Section className="getting-started">
        <h2 className="section-headline">getting started</h2>
        <div className="main">
            <a href="/tutorials/getting-started/javascript/" className="first">
                <div className="icon"><IoIosSpeedometer /></div>
                <h3>Quickstart</h3>
                <p>Get up and running with deepstream in 10 minutes or less</p>
            </a>
            <a href="/guides/">
                <div className="icon"><IoIosBook /></div>
                <h3>Guides</h3>
                <p>Checkout more detailed guides on building applications</p>
            </a>
        </div>
    </Section>
)

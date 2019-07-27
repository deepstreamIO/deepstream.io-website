import {Section} from "../../General/Section/Section"
import * as React from "react"
import './GetInTouch.scss'

export const GetInTouch = () => (
    <Section className="get-in-touch">
        <h2 className="section-headline">Get in touch!</h2>
        <div className="links">
            <a className="github" target="_blank" href="https://github.com/deepstreamIO/deepstream.io/">
                github
            </a>
            <a className="slack" target="_blank" href="https://deepstreamio-slack.herokuapp.com/">
                slack
            </a>
            <a className="stackoverflow" target="_blank" href="http://stackoverflow.com/questions/tagged/deepstream.io">
                stack overflow
            </a>
        </div>
    </Section>
)

import {Section} from "../../General/Section/Section"
import * as React from "react"
import './GetInTouch.scss'

export const GetInTouch = () => (
    <Section className="get-in-touch">
        <h2 className="section-headline">Get in touch!</h2>
        <div className="github">
            <div className="git-text">Raise an issue, request a feature or browse the source on <a href="https://github.com/deepstreamIO/deepstream.io">GitHub</a>.
            </div>
            <div className="git-btn">
                <a
                    className="github-button"
                    href="//github.com/deepstreamIO/deepstream.io"
                    data-icon="octicon-star"
                    data-style="mega"
                    data-count-href="/deepstreamIO/deepstream.io/stargazers"
                    data-count-api="/repos/deepstreamIO/deepstream.io#stargazers_count"
                    data-count-aria-label="# stargazers on GitHub"
                    aria-label="Star deepstreamIO/deepstream.io on GitHub">Star</a>
            </div>
        </div>
        <div className="links">
            <a className="slack" target="_blank" href="https://deepstreamio-slack.herokuapp.com/">
                slack
            </a>
            <a className="stackoverflow" target="_blank" href="http://stackoverflow.com/questions/tagged/deepstream.io">
                stack overflow
            </a>
        </div>
    </Section>
)

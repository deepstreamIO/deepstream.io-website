import './Hero.scss'
import * as React from "react"

export const Hero = () => (
    <header className="main-header clearfix">
        <div className="main-header-text-wrapper">
            <div className="main-header-text">
                <h1 className="page-title">the open realtime server</h1>
                <h2 className="page-description">a fast and secure data-sync realtime server <br />for mobile, web &amp; iot</h2>
                <div className="buttons">
                    <a href="/tutorials/guides/getting-started-quickstart/">
                        <i className="ion-lightbulb"></i>
                        get started
                    </a>
                    <a href="/install/">
                        <i className="ion-ios-navigate-outline"></i>
                        install
                    </a>
                </div>
            </div>
        </div>

        <div className="elton">
            <img src="images/deepstream-elton-logo-startpage.svg"/>
        </div>
    </header>
)

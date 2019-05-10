import './TutorialsOverview.scss'

import {Link} from "gatsby"
import * as React from "react"
import {Section} from "../../General/Section/Section"

import quickstartImage from './images/quickstart.png'
import serverImage from './images/server.png'
import introductionImage from './images/introduction.png'
import whatIsDeepstreamImage from './images/what-is-deepstream.png'
import rocketImage from './images/rocket.png'
import securityImage from './images/security.png'
import dynamicPermissionsImage from './images/dynamic-permissions.png'
import reactImage from './images/react.png'
import reactNativeImage from './images/react-native.png'
import angularImage from './images/angular.png'
import polymerImage from './images/polymer.png'
import knockoutImage from './images/knockout.png'
import spaceshooterImage from './images/spaceshooter.png'
import postitboardImage from './images/postit-board.png'
import arduinoImage from './images/arduino.png'

export const TutorialsOverview = () => (
    <Section className="tut-overview">
        <h2 className="main">Tutorials</h2>
        <Link to="/tutorials/guides/getting-started-quickstart/">
            <img src={quickstartImage}/>
            <h3><span className="bright">Getting Started</span></h3>
        </Link>
        <Link to="/tutorials/core/getting-started-config/">
            <img src={serverImage}/>
            <h3><span>Server Quickstart</span></h3>
        </Link>
        <Link to="/tutorials/core/datasync/records/">
            <img src={introductionImage}/>
            <h3><span className="bright">Using Records</span></h3>
        </Link>
        <Link to="/tutorials/core/pubsub/">
            <img src={rocketImage}/>
            <h3><span className="bright">Using Events</span></h3>
        </Link>
        <Link to="/tutorials/core/security/">
            <img src={securityImage}/>
            <h3><span>Security Overview</span></h3>
        </Link>
        <Link to="/tutorials/core/permissions/dynamic/">
            <img src={dynamicPermissionsImage}/>
            <h3><span>Dynamic Permissioning</span></h3>
        </Link>
        <Link to="/tutorials/integrations/frontend-react/">
            <img src={reactImage}/>
            <h3><span className="bright">Usage with ReactJS</span></h3>
        </Link>
        <Link to="/tutorials/integrations/frontend-reactnative/">
            <img src={reactNativeImage}/>
            <h3><span className="bright">Usage with React Native</span></h3>
        </Link>
        <Link to="/tutorials/integrations/frontend-angular/">
            <img src={angularImage}/>
            <h3><span>Usage with AngularJS</span></h3>
        </Link>
        <Link to="/tutorials/integrations/frontend-polymer/">
            <img src={polymerImage}/>
            <h3><span>Usage with Polymer</span></h3>
        </Link>
        <Link to="/tutorials/integrations/frontend-knockout/">
            <img src={knockoutImage}/>
            <h3><span>Usage with KnockoutJS</span></h3>
        </Link>
        <a href="https://tutorials.pluralsight.com/front-end-javascript/building-a-multiplayer-space-shooter-part-i">
            <img src={spaceshooterImage}/>
            <h3><span className="bright">Multiplayer Spaceshooter</span></h3>
        </a>
        <a href="https://sweetcode.io/creating-retrospective-board-deepstream-io/">
            <img src={postitboardImage}/>
            <h3><span>Post-It Board</span></h3>
        </a>
        <a href="https://deepstreamHub.com/blog/controlling-an-arduino-from-the-browser-using-deepstream/">
            <img src={arduinoImage}/>
            <h3><span className="bright">Browser to Arduino</span></h3>
        </a>
    </Section>)

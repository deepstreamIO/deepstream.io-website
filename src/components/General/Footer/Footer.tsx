import * as React from 'react';
import {Link} from "gatsby"
import cn from 'classnames'
import './Footer.scss'

export const Footer = ({ hasSideBar }) => (
    <footer className={cn('layout-footer', {'with-side-bar': hasSideBar})}>
        <div className="cols">

                <div className="col col-a">
                        <img src="/images/deepstream-elton-logo-grey.png" />
                </div>

                <div className="col col-c">
                        <h4>CONTENT</h4>
                        <Link to="/install/">Install</Link>
                        <Link to="/tutorials/">Tutorials</Link>
                        <Link to="/docs/">Documentation</Link>
                        <a href="deepstreamHub.com/blog/">Blog</a>
                        <Link to="/info/">Info</Link>
                </div>

                <div className="col col-d">
                        <h4>COMMUNITY</h4>
                        <a target="_blank" href="https://twitter.com/deepstreamHub">
                        <i className="ion-social-twitter"></i>
                        <span>Twitter</span>
                        </a>
                        <a target="_blank" href="https://github.com/deepstreamIO">
                        <i className="ion-social-octocat"></i>
                        <span>GitHub</span>
                        </a>
                        <a target="_blank" href="https://deepstreamio-slack.herokuapp.com/">
                        <i className="ion-ios-grid-view-outline"></i>
                        <span>Slack</span>
                        </a>
                        <a target="_blank" href="http://stackoverflow.com/questions/tagged/deepstream.io">
                        <i className="ion-social-buffer"></i>
                        <span>Stack Overflow</span>
                        </a>
                </div>

                <div className="col col-b">
                        <h4>COMPANY</h4>
                        <ul>
                                <li>deepstreamHub GmbH</li>
                                <li>c/o Office Club</li>
                                <li>Pappelallee 78/79</li>
                                <li>10437 Berlin</li>
                                <li>Germany</li>
                                <li>info@deepstreamHub.com</li>
                        </ul>
                </div>
        </div>
        <div className="copyright">
        &copy; {new Date(Date.now()).getFullYear()} deepstreamHub GmbH
        </div>
</footer>)

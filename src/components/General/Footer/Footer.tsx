import * as React from 'react';
import {Link} from "gatsby"
import cn from 'classnames'
import './Footer.scss'
import { 
        FaDownload, FaBook, FaCode, FaInfo, FaBullhorn,
        FaStackOverflow, FaSlack, FaGithub, FaTwitter, 
} from 'react-icons/fa'


export const Footer = ({ hasSideBar }) => (
    <footer className={cn('layout-footer', {'with-side-bar': hasSideBar})}>
        <div className="cols">

                <div className="col col-a">
                        <img src="/images/deepstream-elton-logo-grey.png" />
                </div>

                <div className="col col-c">
                        <h4>CONTENT</h4>
                        <Link to="/install/">
                                <FaDownload />
                                <span>Install</span>
                        </Link>
                        <Link to="/tutorials/">
                                <FaBook />
                                <span>Tutorials</span>
                        </Link>
                        <Link to="/docs/">
                                <FaCode />
                                <span>Documentation</span>
                        </Link>
                        <Link to="/releases">
                                <FaBullhorn />
                                <span>Releases</span>  
                        </Link>
                        {/* <Link to="/info/">
                                <FaInfo />
                                <span>Info</span>
                        </Link> */}
                </div>

                <div className="col col-d">
                        <h4>COMMUNITY</h4>
                        <a target="_blank" href="https://twitter.com/deepstreamHub">
                                <FaTwitter />
                                <span>Twitter</span>
                        </a>
                        <a target="_blank" href="https://github.com/deepstreamIO">
                                <FaGithub />
                                <span>GitHub</span>
                        </a>
                        <a target="_blank" href="https://deepstreamio-slack.herokuapp.com/">
                                <FaSlack />
                                <span>Slack</span>
                        </a>
                        <a target="_blank" href="http://stackoverflow.com/questions/tagged/deepstream.io">
                                <FaStackOverflow />
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

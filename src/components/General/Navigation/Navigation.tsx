import {Link} from "gatsby"
import * as React from "react"

export const Navigation = ({ mobile = false }) => (
    <ul className={`links ${mobile ? 'mobile-menu' : 'desktop-menu'}`}>
        <li className="navigation-link">
            <a target="_blank" href="https://github.com/deepstreamIO/deepstream.io">
                github
            </a>
        </li>
        {
            ['guides', 'install', 'tutorials', 'docs', 'blog'].map(section => (
                <li className="navigation-link" key={section}>
                    <Link to={`/${section}/`} activeClassName="active">
                        {section}
                    </Link>
                </li>
            ))
        }
    </ul>
)

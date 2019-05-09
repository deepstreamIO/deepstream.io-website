import {Link} from "gatsby"
import * as React from "react"

export const Navigation = ({ mobile = false }) => (
    <ul className={`links ${mobile ? 'mobile-menu' : 'desktop-menu'}`}>
        {
            ['install', 'tutorials', 'docs'].map(section => (
                <li className="navigation-link" key={section}>
                    <Link to={`/${section}/`} activeClassName="active">
                        {section}
                    </Link>
                </li>
            ))
        }
        <li className="navigation-link">
            <a href="https://deepstreamhub.com/enterprise">
                enterprise
            </a>
        </li>
    </ul>
)

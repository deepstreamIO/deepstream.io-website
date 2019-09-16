import {Link} from "gatsby"
import * as React from "react"

export const Navigation = ({ mobile = false }) => (
    <ul className={`links ${mobile ? 'mobile-menu' : 'desktop-menu'}`}>
        {
            ['install', 'tutorials', 'docs', 'blog'].map(section => (
                <li className="navigation-link" key={section}>
                    <Link to={`/${section}/`} activeClassName="active">
                        {section}
                    </Link>
                </li>
            ))
        }
    </ul>
)

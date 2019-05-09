import './Header.scss'

import * as React from "react"

import { Navigation } from '../Navigation/Navigation'

import { IoIosMenu } from 'react-icons/io'

interface HeaderProps {
}

export const Header: React.FunctionComponent<HeaderProps> = () => {
    return <header className="layout-header">
        <nav>
            <div className="wrapper">
                <div className="header-logo">
                    <a href="/" id="logo">
                        <span>deepstream<em>.io</em></span>
                    </a>
                </div>

                <span className="menu-button menu-icon">
                    <IoIosMenu />
                </span>

                <div className="nav desktop-nav">
                    <Navigation/>
                </div>

            </div>
        </nav>

        <div className="mobile-menu">
            <div className="nav mobile-nav">
                <Navigation/>
            </div>
        </div>
    </header>
}

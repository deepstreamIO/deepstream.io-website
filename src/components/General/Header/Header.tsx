import './Header.scss'

import * as React from "react"
import { useCallback, useState } from "react"

import { Navigation } from '../Navigation/Navigation'

import { IoIosMenu } from 'react-icons/io'
import { MobileMenu } from '../MobileMenu/MobileMenu';

interface HeaderProps {
}

export const Header: React.FunctionComponent<HeaderProps> = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenuOpen = useCallback(() => setMenuOpen(!menuOpen), [menuOpen])
    
    return <header className="layout-header">
        <nav>
            <div className="wrapper">
                <div className="header-logo">
                    <a href="/" id="logo">
                        <span>deepstream<em>.io</em>(under reconstruction)</span>
                    </a>
                </div>

                <span className="menu-button menu-icon">
                    <IoIosMenu onClick={toggleMenuOpen} />
                </span>

                <div className="nav desktop-nav">
                    <Navigation/>
                </div>

            </div>
        </nav>

        <MobileMenu open={menuOpen} />
    </header>
}

import React, { useState } from 'react';
import { Header } from "../Header/Header"
import {Footer} from "../Footer/Footer"
import { SEO } from "../SEO/SEO";
import { Link } from 'gatsby';

interface LayoutProps {
    location?: any
    pageContext?: any
    pageClass?: string
    hasSideBar?: boolean
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children, pageClass, hasSideBar = false }) => {
    return <div className={pageClass}>
        <SEO />
        <Header/>
        <div style={{
            boxSizing: 'border-box',
            // paddingTop: "10px",
            paddingBottom: "10px",
            // height: "60px",
            textAlign: 'center',
            width: '100%',
            // background: `repeating-linear-gradient(
            //     45deg,
            //     #606dbc,
            //     #0FBBEC 10px,
            //     #465298 10px,
            //     #0FBBEC 20px
            //   )`
            background: `#0FBBEC`
        }}>
            {/*<div style={{ paddingTop: '10px' }}>
                <Link style={{
                    fontSize: '20px',
                    color: 'yellow',
                    fontWeight: 500,
                    paddingTop: '20px'
                }} to="/blog/20200519-deepstream-maintenance-mode/">Deepstream is in maintenance mode, contributors needed</Link>
            </div>*/}
        </div>
        <div>
            {children}
        </div>
        <Footer hasSideBar={hasSideBar} />
    </div>
}

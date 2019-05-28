import React from 'react';
import { Header } from "../Header/Header"
import {Footer} from "../Footer/Footer"

interface LayoutProps {
    location?: any
    pageContext?: any
    pageClass?: string
    hasSideBar?: boolean
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children, pageClass, hasSideBar = false }) => {
    return <div className={pageClass}>
        <Header/>
        <div>
            {/* <div className="under-construction">
                <h1>deepstream.io is currently under reconstruction for the new V4 release!</h1>
                <h3>For V3 and enterprise documentation please go to <a href="https://deepstreamhub.com">deepstreamhub.com</a></h3>
            </div> */}
            {children}
        </div>
        <Footer hasSideBar={hasSideBar} />
    </div>
}

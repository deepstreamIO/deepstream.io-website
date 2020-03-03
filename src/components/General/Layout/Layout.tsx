import React, { useState } from 'react';
import { Header } from "../Header/Header"
import {Footer} from "../Footer/Footer"
import { SEO } from "../SEO/SEO";

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
        <div>
            {children}
        </div>
        <Footer hasSideBar={hasSideBar} />
    </div>
}

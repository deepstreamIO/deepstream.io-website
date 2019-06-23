import React, { useState } from 'react';
import { Header } from "../Header/Header"
import {Footer} from "../Footer/Footer"

interface LayoutProps {
    location?: any
    pageContext?: any
    pageClass?: string
    hasSideBar?: boolean
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children, pageClass, hasSideBar = false }) => {
    const [showConstruction, setShowConstruction] =  React.useState(() => {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('showConstruction') !== 'false'
        }
        return true
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('showConstruction', showConstruction.toString())
        }
      }, [showConstruction]);

    return <div className={pageClass}>
        {showConstruction && <div className="under-construction-overlay">
            <div className="under-construction">
                <img className="elton-under-construction" src="/images/eltons/elton-info.svg"></img>
                <h1>deepstream.io is currently under reconstruction for the V4 release!</h1>
                <h3 className="under-construction-redirect">For V3 and enterprise documentation please go to <a href="https://deepstreamhub.com">https://deepstreamhub.com</a></h3>
                <h3 className="under-construction-continue">To continue click <a onClick={() => setShowConstruction(false)}>here</a></h3>
            </div>
        </div>}
        <Header/>
        <div>
            {children}
        </div>
        <Footer hasSideBar={hasSideBar} />
    </div>
}

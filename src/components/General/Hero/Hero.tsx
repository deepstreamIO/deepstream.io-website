import './Hero.scss'

import * as React from "react"
import {Dictionary} from "ts-essentials"

export enum HeroType {
    tutorials = 'tutorial',
    docs = 'docs',
    info = 'info',
    blog = 'blog'
}

const Content: Dictionary<{ image: string, title: string }, HeroType> = {
    [HeroType.tutorials]: {
        image: '/images/eltons/elton-tutorials.svg',
        title: 'Tutorials & Guides'
    },
    [HeroType.docs]: {
        image: '/images/eltons/elton-docs.svg',
        title: ''
    },
    [HeroType.info]: {
        image: '/images/eltons/elton-info.svg',
        title: ''
    },
    [HeroType.blog]: {
        image: '/images/eltons/elton-info.svg',
        title: 'Blog & Releases'
    }
}

interface HeroProps {
    type: HeroType
}

export const Hero: React.FunctionComponent<HeroProps> = ({ type }) => (
    <div className="overview-header">
        <img className={`elton-overview elton-${type}`} src={Content[type].image} />
        <h1>{Content[type].title}</h1>
    </div>
)

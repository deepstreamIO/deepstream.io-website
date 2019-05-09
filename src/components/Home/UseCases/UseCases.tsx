import './UseCases.scss'
import * as React from "react"
import {Section} from "../../General/Section/Section"
import video from './video/realtime-app-small.mp4'

import { IoMdLock, IoMdCube, IoMdHeart, IoMdStats } from 'react-icons/io'

const Text = () => (
    <div className="use-case-text">
        <h2>built for a new generation of apps</h2>
        <ul>
            <li><IoMdStats /> scales to billions of messages</li>
            <li><IoMdLock />strong security, authentication and permissioning</li>
            <li><IoMdCube />connects to any database, cache and message bus</li>
            <li><IoMdHeart />free as in beer, speech and love</li>
        </ul>
    </div>
)

const Video = () => (
    <video width="600" height="422" src={video} autoPlay={true} loop/>
)

export const Usecases = () => (
    <Section className="use-cases" columns={[<Text />, <Video />]} />
)

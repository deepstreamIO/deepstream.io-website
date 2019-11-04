import * as React from "react"
import { Link } from 'gatsby'
import style from './Hero.module.css'

export const Hero = () => (
    <header className={style.hero}>
        <div className={style.wrapper}>
            <img className={style.bannerImage} src="images/eltons/elton-hive.svg"/>
            <div className={style.content}>
                <h1 className={style.title}>the open realtime server</h1>
                <h2 className={style.description}>a fast and secure data-sync realtime server <br />for mobile, web &amp; iot</h2>
                <Link className={style.action} to="/tutorials/getting-started/javascript/">get started</Link>
            </div>
        </div>
    </header>
)

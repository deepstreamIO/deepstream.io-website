import * as React from "react"
import cn from "classnames"
// @ts-ignore
import style from "./InstallBlock.module.css"
import {Link} from "gatsby"

interface InstallBlockProps {
    url: string,
    img: string,
    name: string,
    soon?: boolean,
    dev?: boolean
}

export const InstallBlock: React.FunctionComponent<InstallBlockProps> = ({ url, img, name, soon = false, dev = false }) => {
    return <Link to={url}>
        <div className={cn(style.wrapper)} >
            <div className={style.content}>
                {dev && <div className={style.inDevelopment}>in development</div>}
                {soon && <div className={style.comingSoon}>coming soon</div>}
                <img src={img} width="100" height="100" />
                <h3>{name}</h3>
            </div>
        </div>
    </Link>
}

import style from './WIP.module.css'
import * as React from 'react'

interface WIPProps {
    gitHubLink: string
}

export const WIP: React.FunctionComponent<WIPProps> = ({ gitHubLink }) => {
   return <div className={style.wip}>
        <img className={style.image} src="/images/eltons/elton-docs.svg" />
        <p className={style.help}>
            This page needs to be improved! If you feel like adding a few details, totally revamping it or fixing
            a spelling mistake or two feel free to raise a PR <a className={style.editLink} href={gitHubLink}>here</a>
        </p>
    </div>
}

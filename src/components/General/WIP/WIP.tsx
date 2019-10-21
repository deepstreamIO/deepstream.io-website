import style from './WIP.module.css'
import * as React from 'react'

interface WIPProps {
    gitHubLink: string
}

export const WIP: React.FunctionComponent<WIPProps> = ({ gitHubLink }) => {
   return <div className={style.wip}>
        <img className={style.image} src="/images/eltons/elton-docs.svg" />
        <p className={style.help}>
            This page needs to be improved/might be out of date! <a className={style.editLink} href={gitHubLink}>Raise a PR</a> if you feel like adding a few details or totally revamping it.
        </p>
    </div>
}

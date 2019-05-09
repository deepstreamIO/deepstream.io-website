import style from './Section.module.css'

import * as React from 'react'
import cn from 'classnames'

interface SectionProps {
    className?: string,
    columnClassName?: string,
    columns?: any[]
}

const columnClass = [
    style.oneColumn,
    style.twoColumn,
    style.threeColumn
]

export const Section: React.FunctionComponent<SectionProps> = ({ children, className, columnClassName, columns }) => {
    let content = columns ? columns.map((column, index) =>
        <div key={index} className={cn(columnClass[columns.length - 1], columnClassName)}>{column}</div>
    ) : children

    return <section className={className}>
        <div className={style.wrapper}>
            {content}
        </div>
    </section>
}

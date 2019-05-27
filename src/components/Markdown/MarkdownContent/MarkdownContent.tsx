import './MarkDownContent.scss'
import style from './MarkDownContent.module.css'
import React from 'react';
import {Layout} from "../../General/Layout/Layout"
import {SideBar} from "../SideBar/SideBar"
import { FaGithub } from 'react-icons/fa';

interface MarkdownContentProps {
    data: any
    location: string
    navigation: any
}

export const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({ data, location, navigation }) => {
    const { html } = data.markdownRemark
    const { title, description } = data.markdownRemark.frontmatter
    const { githubLink } = data.markdownRemark.fields

    return <Layout location={location} hasSideBar={true}>
        <div className={style.wrapper}>
            <article className={style.article}>
                <header className={style.header}>
                    <h1 className={style.title}>
                        {title}
                        <a className={style.githubEdit} href={githubLink}><FaGithub /></a>
                    </h1>
                    {description && <h3 className={style.description}>{description}</h3>}
                </header>
                <div
                    className={`${style.content} content`}
                    dangerouslySetInnerHTML={{__html: html}}
                />
            </article>
            <SideBar navigation={navigation} currentLocation={location} />
        </div>
    </Layout>
}

export default MarkdownContent

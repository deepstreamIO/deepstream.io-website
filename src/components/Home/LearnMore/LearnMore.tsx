import heroStyle from '../Hero/Hero.module.css'
import style from './LearnMore.module.css'
import * as React from "react"
import {Section} from "../../General/Section/Section"
import { Link } from 'gatsby';

export const LearnMore = () => (
        <Section className={style.learnMore}>
            <div className={heroStyle.wrapper}>
                <img className={heroStyle.bannerImage} src="images/eltons/elton-professor.svg"/>

                <div className={heroStyle.content}>
                    <h3 className={heroStyle.title}>Further Reading</h3>
                    <p className={heroStyle.description}>
                        Get started with deepstream by reading more about the high level concepts
                        it provides, or jump straight into building your first application!
                    </p>
                    <div className={style.actions}>
                        <Link className={style.action} to="/tutorials/concepts/what-is-deepstream/">What is it?</Link>
                        <Link className={style.action} to="/guides/">Getting Started</Link>
                    </div>
                </div>
            </div>
        </Section>
    )
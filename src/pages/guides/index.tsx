import style from './guides.module.css'
import * as React from 'react'
import {Layout} from "../../components/General/Layout/Layout"
import { HeroType, Hero } from '../../components/General/Hero/Hero';
import { Section } from '../../components/General/Section/Section';
import { Link } from 'gatsby';

export default () => (
    <Layout>
        <Hero type={HeroType.guides}/>
        <Section className="section-overview">
            <div className={style.guides}>
                <Link to="/guides/weather-app/" className={style.guide}>
                    <img className={style.guideImage} src="/images/eltons/elton-docs.svg" />
                    <h1 className={style.guideTitle}>Weather App</h1>
                </Link>
            </div>
        </Section>
    </Layout>
)
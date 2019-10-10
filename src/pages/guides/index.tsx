import style from './guides.module.css'
import * as React from 'react'
import {Layout} from "../../components/General/Layout/Layout"
import { HeroType, Hero } from '../../components/General/Hero/Hero';
import { Section } from '../../components/General/Section/Section';
import { Link } from 'gatsby';
import BoardRealtimeImage from '../../../content/guides/post-it-board/board.png';

export default () => (
    <Layout>
        <Hero type={HeroType.guides}/>
        <Section className="section-overview">
            <div className={style.guides}>
                <h2 className={style.guideSectionHeader}>Frontend Apps</h2>
                <div>
                    {/* <Link to="/guides/browser/weather-app/" className={style.guide}>
                        <img className={style.guideImage} src="/images/eltons/elton-docs.svg" />
                        <h1 className={style.guideTitle}>Weather App</h1>
                    </Link> */}
                    <Link to="/guides/browser/post-it-board/" className={style.guide}>
                        <img className={style.guideImage} src={BoardRealtimeImage} />
                        <h1 className={style.guideTitle}>PostIt Board</h1>
                    </Link>
                    {/* <Link to="/guides/browser/color-picker/" className={style.guide}>
                        <img className={style.guideImage} src="/images/eltons/elton-docs.svg" />
                        <h1 className={style.guideTitle}>Weather App</h1>
                    </Link> */}
                </div>
            </div>

            {/* <div className={style.guides}>
                <h2 className={style.guideSectionHeader}>Deployment Guides</h2>
                <div>
                    <Link to="/guides/devops/docker-compose/" className={style.guide}>
                        <img className={style.guideImage} src="/images/install/compose.png" />
                        <h1 className={style.guideTitle}>Docker Compose</h1>
                    </Link>
                    <Link to="/guides/devops/nginx/" className={style.guide}>
                        <img className={style.guideImage} src="/images/logos/nginx.png" />
                        <h1 className={style.guideTitle}>Nginx</h1>
                    </Link>
                </div>
            </div> */}
            
        </Section>
    </Layout>
)
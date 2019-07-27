import * as React from 'react';
import * as style from './404.module.css'
import {Layout} from "../components/General/Layout/Layout"
import { Section } from '../components/General/Section/Section';

const NotFoundPage = () => (
  <Layout>
    <Section className={style.lost}>
      <img className={style.elton} src="/images/eltons/elton-crying.svg" />
      <span className={style.content}>
        <h1>You seem to be lost!</h1>
        <p>
          If you found yourself here by one of the links on deepstream.io, 
          please raise an issue <a href="https://github.com/deepstreamIO/deepstream.io-website">here</a>
        </p>        
      </span>
    </Section>
  </Layout>
)

export default NotFoundPage

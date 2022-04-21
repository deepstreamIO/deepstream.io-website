import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'security',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
      authenticate, audit and permission everything from the user down to each message
      </>
    ),
  },
  {
    title: 'Records',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Interactive JSON documents that can be edited and observed. Changes are persisted and synced across clients and saved in cache/storage.
      </>
    ),
  },
  {
    title: 'Events',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Many clients can subscribe to topics and receive data whenever other clients publish it to the same topic.
      </>
    ),
  },
  {
    title: 'RPCs',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Clients can register functions to be called by other clients. deepstream will smartly route requests and responses.
      </>
    ),
  },
  {
    title: 'Presence',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Query deepstream for online users and subscribe to login/logout events
      </>
    ),
  },
  {
    title: 'Listening',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
      Let your services be told whenever a new topic is subscribed to, letting you serve realtime data on demand
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

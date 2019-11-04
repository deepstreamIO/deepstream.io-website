import * as React from 'react';

import {Layout} from "../components/General/Layout/Layout"
import {Hero} from "../components/Home/Hero/Hero"
import {WhatIsIt} from "../components/Home/WhatIsIt/WhatIsIt"
import { LearnMore } from '../components/Home/LearnMore/LearnMore';

const IndexPage = () => (
  <Layout>
    <Hero />
    <WhatIsIt/>
    <LearnMore/>
</Layout>
)

export default IndexPage

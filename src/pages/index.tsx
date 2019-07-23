import * as React from 'react';

import {Layout} from "../components/General/Layout/Layout"
import {Hero} from "../components/Home/Hero/Hero"
import {GettingStarted} from "../components/Home/GettingStarted/GettingStarted"
import {GetInTouch} from "../components/Home/GetInTouch/GetInTouch"
// import {V4Release} from "../components/Home/V4Release/V4Release"
import {WhatIsIt} from "../components/Home/WhatIsIt/WhatIsIt"

const IndexPage = () => (
  <Layout>
    <Hero />
    {/* <V4Release /> */}
    <WhatIsIt/>
    <GettingStarted/>
    <GetInTouch/>
</Layout>
)

export default IndexPage

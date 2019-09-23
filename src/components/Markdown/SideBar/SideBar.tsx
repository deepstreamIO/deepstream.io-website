import style from './SideBar.module.css'
import React, {useState} from "react"
import cn from 'classnames'
import {Link, navigateTo} from 'gatsby';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

interface SideBarProps {
    navigation: any,
    currentLocation: any
}

const Section = ({ item, navigation, activePath, setOpen, open, openSubNav, setOpenSubNav }) => (
    <div className={style.sectionLevel}>
        <label onClick={() => open ? setOpen(null) : setOpen(item) }>{item.replace(/-/g, ' ')}</label>
        {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
        {open && createSideBarTree(navigation[item], 1, activePath, undefined, undefined, openSubNav, setOpenSubNav)}
    </div>
)

const SubSection = ({ item, navigation, activePath, openSubNav, setOpenSubNav }) => {
    if (activePath.includes('guide')) {
        return <div className={style.subsectionLevel}>
            <label onClick={() => openSubNav ? setOpenSubNav(null) : setOpenSubNav(item) }>{item.replace(/-/g, ' ')}</label>
            {openSubNav && createSideBarTree(navigation[item], 2, activePath)}
        </div>
    }
    return <div className={style.subsectionLevel}>
        <label>{item.replace(/-/g, ' ')}</label>
        {createSideBarTree(navigation[item], 2, activePath)}
    </div>
}

const Leaf = ({ navigation, activePath }) => (<div key={navigation.slug} className={cn(style.leaf, { [style.activeLeaf]: activePath === navigation.slug })}>
<Link to={navigation.slug}>{navigation.title}</Link>
</div>
)

const createSideBarTree = (navigation: any, depth: number, activePath, open? = '', setOpen?, openSubNav?, setOpenSubNav?) => {
    const items = Object.keys(navigation).sort((a, b) => {
        if (navigation[a].slug && navigation[a].slug.includes('blog')) {
            return navigation[b].order - navigation[a].order
        }
        return navigation[a].order - navigation[b].order
    })
    return items.map((item) => {
        if (item === 'order') {
            return null
        }
        if (navigation[item].leaf) {
            return <Leaf key={navigation[item].slug} navigation={navigation[item]} activePath={activePath} />
        } else  if (depth === 0) {
            return <Section key={item} item={item} navigation={navigation} activePath={activePath} setOpen={setOpen} open={item === open} openSubNav={openSubNav} setOpenSubNav={setOpenSubNav} />
        } else {
            console.log(openSubNav, activePath, item)
            return <SubSection key={item} item={item} navigation={navigation} activePath={activePath} openSubNav={openSubNav === item} setOpenSubNav={setOpenSubNav} />
        }
    })
}

export const SideBar: React.FunctionComponent<SideBarProps> = ({ navigation, currentLocation }) => {
    const [ open, setOpen ] = useState(currentLocation.pathname.split('/')[2])
    const [ openSubNav, setOpenSubNav ] = useState(currentLocation.pathname.split('/')[3])

    return <div className={style.sidebar}>
        <div className={style.hack}>
            {createSideBarTree(navigation, 0, currentLocation.pathname, open, setOpen, openSubNav, setOpenSubNav)}
        </div>
    </div>
}

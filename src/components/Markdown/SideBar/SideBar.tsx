import style from './SideBar.module.css'
import React, {useState} from "react"
import cn from 'classnames'
import {Link} from 'gatsby';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

interface SideBarProps {
    navigation: any,
    currentLocation: any
}

const Section = ({ item, navigation, activePath, setOpen, open }) => (
    <div className={style.sectionLevel}>
        <label onClick={() => open ? setOpen(null) : setOpen(item) }>{item}</label>
        {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
        {open && createSideBarTree(navigation[item], 1, activePath)}
    </div>
)

const SubSection = ({ item, navigation, activePath }) => (<div className={style.subsectionLevel}>
        <label>{item}</label>
        {createSideBarTree(navigation[item], 2, activePath)}
</div>)

const createSideBarTree = (navigation: any, depth: number, activePath, open? = '', setOpen?) => {
    if (navigation.leaf) {
        return <div key={navigation.slug} className={cn(style.leaf, { [style.activeLeaf]: activePath === navigation.slug })}>
            <Link to={navigation.slug}>{navigation.title}</Link>
        </div>
    } else {
        return Object.keys(navigation).sort().map((item, index) => {
            if (navigation[item].leaf) {
                return createSideBarTree(navigation[item], depth, activePath)
            } else  if (depth === 0) {
                return <Section key={item} item={item} navigation={navigation} activePath={activePath} setOpen={setOpen} open={item === open}  />
            } else {
                return <SubSection key={item} item={item} navigation={navigation} activePath={activePath} />
            }
        })
    }
}

export const SideBar: React.FunctionComponent<SideBarProps> = ({ navigation, currentLocation }) => {
    const [ open, setOpen ] = useState(currentLocation.pathname.split('/')[2])

    return <div className={style.sidebar}>
        <div className={style.hack}>
            {createSideBarTree(navigation, 0, currentLocation.pathname, open, setOpen)}
        </div>
    </div>
}

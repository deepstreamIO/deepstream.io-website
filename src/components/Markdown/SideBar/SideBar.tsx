import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link, navigateTo } from "gatsby";
import React, { useState } from "react";

import cn from "classnames";
import style from "./SideBar.module.css";

interface SideBarProps {
  navigation: any;
  currentLocation: any;
  numbers: boolean;
}

const Section = ({
  numbers,
  item,
  navigation,
  activePath,
  setOpen,
  open,
  openSubNav,
  setOpenSubNav
}) => (
  <div className={style.sectionLevel}>
    <label onClick={() => (open ? setOpen(null) : setOpen(item))}>
      {item.replace(/-/g, " ")}
    </label>
    {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
    {open &&
      createSideBarTree(
        numbers,
        navigation[item],
        1,
        activePath,
        undefined,
        undefined,
        openSubNav,
        setOpenSubNav
      )}
  </div>
);

const SubSection = ({
  numbers,
  item,
  navigation,
  activePath,
  openSubNav,
  setOpenSubNav
}) => {
  if (activePath.includes("guide")) {
    return (
      <div className={style.subsectionLevel}>
        <label
          onClick={() =>
            openSubNav ? setOpenSubNav(null) : setOpenSubNav(item)
          }
        >
          {item.replace(/-/g, " ")}
        </label>
        {openSubNav &&
          createSideBarTree(numbers, navigation[item], 2, activePath)}
      </div>
    );
  }
  return (
    <div className={style.subsectionLevel}>
      <label>{item.replace(/-/g, " ")}</label>
      {createSideBarTree(numbers, navigation[item], 2, activePath)}
    </div>
  );
};

const Leaf = ({ index, navigation, activePath }) => (
  <div
    key={navigation.slug}
    className={cn(style.leaf, {
      [style.activeLeaf]: activePath === navigation.slug
    })}
  >
    <Link to={navigation.slug}>
      {index}
      {navigation.title}
    </Link>
  </div>
);

const createSideBarTree = (
  numbers: boolean,
  navigation: any,
  depth: number,
  activePath,
  open? = "",
  setOpen?,
  openSubNav?,
  setOpenSubNav?
) => {
  const items = Object.keys(navigation).sort((a, b) => {
    if (navigation[a].slug && navigation[a].slug.includes("blog")) {
      return navigation[b].order - navigation[a].order;
    }
    return navigation[a].order - navigation[b].order;
  });
  return items.map((item, index) => {
    if (item === "order") {
      return null;
    }
    if (navigation[item].leaf) {
      return (
        <Leaf
          key={navigation[item].slug}
          index={numbers ? `${index}) ` : "- "}
          navigation={navigation[item]}
          activePath={activePath}
        />
      );
    } else if (depth === 0) {
      return (
        <Section
          key={item}
          numbers={numbers}
          item={item}
          navigation={navigation}
          activePath={activePath}
          setOpen={setOpen}
          open={item === open}
          openSubNav={openSubNav}
          setOpenSubNav={setOpenSubNav}
        />
      );
    } else {
      return (
        <SubSection
          key={item}
          numbers={numbers}
          item={item}
          navigation={navigation}
          activePath={activePath}
          openSubNav={openSubNav === item}
          setOpenSubNav={setOpenSubNav}
        />
      );
    }
  });
};

export const SideBar: React.FunctionComponent<SideBarProps> = ({
  numbers = false,
  navigation,
  currentLocation
}) => {
  const [open, setOpen] = useState(currentLocation.pathname.split("/")[2]);
  const [openSubNav, setOpenSubNav] = useState(
    currentLocation.pathname.split("/")[3]
  );

  return (
    <div className={style.sidebar}>
      {createSideBarTree(
        numbers,
        navigation,
        0,
        currentLocation.pathname,
        open,
        setOpen,
        openSubNav,
        setOpenSubNav
      )}
    </div>
  );
};

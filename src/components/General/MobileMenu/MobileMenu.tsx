import * as React from "react"
import { Navigation } from "../Navigation/Navigation";
import classnames from "classnames"

export const MobileMenu = ({ open }) => (
    <div className={classnames("mobile-menu", { open })}>
        <div className={classnames('nav mobile-nav', { open })}>
            <Navigation/>
        </div>
    </div>
)
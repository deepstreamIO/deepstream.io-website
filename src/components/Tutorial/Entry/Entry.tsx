import {Link} from "gatsby"
import * as React from "react"

interface EntryProps {
    entry: {
        title: string,
        description: string,
        slug: string,
        slugDir: string,
        logoImage?: string
    }
}

export const Entry: React.FunctionComponent<EntryProps> = ({ entry }) => {
    if (!entry) {
        return null
    }
    const { title, slug, description, logoImage, slugDir } = entry;

    let logo = null
    if (logoImage) {
        logo = <img className="logo-image" src={`/images/logos/${logoImage}`}></img>
    }
    return <Link className="entry" to={slugDir} title={description}>
		{logo}
		<h4>{title.replace('Cache Connector', '').replace('DataBase Connector', '')}</h4>
	</Link>
}

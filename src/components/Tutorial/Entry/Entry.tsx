import {Link} from "gatsby"
import * as React from "react"

interface EntryProps {
    entry: {
        title: string,
        description: string,
        slug: string,
        icon?: string
    }
}

export const Entry: React.FunctionComponent<EntryProps> = ({ entry }) => {
    const { title, slug, icon = null, description} = entry;
    return <Link className="entry" to={slug} title={description}>
		{/*<Icon />*/}
		<h4>{title.replace('Cache Connector', '').replace('DataBase Connector', '')}</h4>
	</Link>
}

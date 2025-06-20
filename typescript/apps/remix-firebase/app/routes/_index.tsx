// import { db } from "~/clients/firebase.server";
import { json, type LinksFunction } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { Card, CardContent, CardHeader } from '@dbbs/tailwind-components'
import { getSubReddits } from '../services/reddit.service'
import stylesheet from '../styles/home.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export const loader = async () => {
  const reddits = await getSubReddits()
  return json({
    reddits
  })
}

const Home = () => {
  const { reddits } = useLoaderData<typeof loader>()

  return (
    <div>
      {reddits.map((reddit) => (
        <Card key={reddit.id} className="mb-4">
          <CardHeader>
            <Link to={reddit.url}>
              <h3 className="font-semibold">{reddit.title}</h3>
            </Link>
          </CardHeader>
          <CardContent className="reddit-content">
            <div dangerouslySetInnerHTML={{ __html: reddit.publicDescriptionHtml || '' }} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Home

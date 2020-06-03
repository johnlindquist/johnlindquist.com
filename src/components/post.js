import React from 'react'
import Layout from './layout'
import Link from './link'
import { kebabCase, isEmpty } from 'lodash'
import useClipboard from 'react-use-clipboard'
import TimeAgo from 'timeago-react'

export default function Post({
  children,
  data: {
    blogPost: {
      title,
      slug,
      date,
      excerpt,
      socialImage,
      published,
      category,
      editUrl,
    },
    site: { siteMetadata },
  },
  ...props
}) {
  const [isCopiedToClipboard, setCopiedToClipboard] = useClipboard(
    siteMetadata.siteUrl + slug,
    {
      successDuration: 1000,
    },
  )

  const [hasYoutubeVideo, setHasYoutubeVideo] = React.useState(false)

  function hasYtEmbed() {
    const iframe = document.getElementsByTagName('iframe')
    if (iframe) {
      const iframes = Array.prototype.map.call(iframe, (i) =>
        i.src.includes('youtube'),
      )
      const includesYoutubeUrl = iframes.includes(true)
      return includesYoutubeUrl
    } else return false
  }

  React.useEffect(() => {
    setHasYoutubeVideo(hasYtEmbed())
  }, [hasYoutubeVideo, setHasYoutubeVideo])

  return (
    <Layout
      title={title}
      excerpt={excerpt}
      {...props}
      card={socialImage && socialImage.childImageSharp.fixed.src}
      type="article"
      slug={slug}
    >
      {/* {hasYoutubeVideo && 'this post has a youtube video'} */}
      <div className="grid md:grid-cols-4 grid-cols-1 gap-8 md:mt-4 mt-0">
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold leading-tight pb-8">{title}</h1>
          {!published && (
            <div>
              <span role="img" aria-label="Under Construction">
                🚧
              </span>
              WIP
            </div>
          )}

          <article className="markdown text-gray-800">{children}</article>
        </div>
        <aside className="h-full border-t-2 md:border-none border-gray-200">
          <div className="flex flex-col items-start md:sticky top-0 pt-5">
            <div className="flex flex-wrap justify-center items-center">
              {!isEmpty(category) && (
                <Link
                  className="capitalize inline-flex items-center px-2 py-1 rounded-md text-sm font-medium leading-5 bg-indigo-100 text-indigo-800 hover:text-indigo-600 transform hover:scale-110 transition-all duration-100 ease-in-out"
                  to={`/posts/${kebabCase(category)}`}
                >
                  {category}
                </Link>
              )}
              <TimeAgo
                className={`${
                  !isEmpty(category) && 'mx-2'
                } mt-px text-xs text-gray-700`}
                datetime={date}
              />
            </div>
            <button
              onClick={setCopiedToClipboard}
              className="mt-3 inline-flex items-center p-2 border border-gray-200 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              {/* prettier-ignore */}
              <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
              {isCopiedToClipboard ? 'Copied!' : 'Copy link to clipboard'}
            </button>
            <Link
              className="mt-2 inline-flex items-center p-2 border border-gray-200 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              to={editUrl}
            >
              {/* prettier-ignore */}
              <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-2.5 -2.5 24 24"><g fill="currentColor"><path d="M16.318 6.11l-3.536-3.535 1.415-1.414c.63-.63 2.073-.755 2.828 0l.707.707c.755.755.631 2.198 0 2.829L16.318 6.11zm-1.414 1.415l-9.9 9.9-4.596 1.06 1.06-4.596 9.9-9.9 3.536 3.536z"></path></g></svg>
              Edit on GitHub
            </Link>
            <Link
              className="mt-2 inline-flex items-center p-2 border border-gray-200 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              to={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
                title + ', post by @johnlindquist',
              )}&url=${encodeURIComponent(siteMetadata.siteUrl + slug)}`}
            >
              {/* prettier-ignore */}
              <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-2 -4 24 24"><g fill="currentColor"><path d="M20 1.907a8.292 8.292 0 0 1-2.356.637A4.07 4.07 0 0 0 19.448.31a8.349 8.349 0 0 1-2.607.98A4.12 4.12 0 0 0 13.846.015c-2.266 0-4.103 1.81-4.103 4.04 0 .316.036.625.106.92A11.708 11.708 0 0 1 1.393.754a3.964 3.964 0 0 0-.554 2.03 4.02 4.02 0 0 0 1.824 3.363A4.151 4.151 0 0 1 .805 5.64v.05c0 1.958 1.415 3.591 3.29 3.963a4.216 4.216 0 0 1-1.08.141c-.265 0-.522-.025-.773-.075a4.098 4.098 0 0 0 3.832 2.807 8.312 8.312 0 0 1-5.095 1.727c-.332 0-.658-.02-.979-.056a11.727 11.727 0 0 0 6.289 1.818c7.547 0 11.673-6.157 11.673-11.496l-.014-.523A8.126 8.126 0 0 0 20 1.907z"></path></g></svg>
              Tweet
            </Link>
          </div>
        </aside>
      </div>
    </Layout>
  )
}

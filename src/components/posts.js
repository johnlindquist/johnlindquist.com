import React from 'react'
import { Link, navigate } from 'gatsby'
import { kebabCase, isEmpty } from 'lodash'
import Markdown from '../utils/card-markdown'
import TimeAgo from 'timeago-react'
import pluralize from 'pluralize'
import Layout from './layout'
import Fuse from 'fuse.js'

export const Item = ({ post }) => {
  return (
    <li className="mb-3">
      <Link
        className="h-full rounded-md px-6 pt-6 pb-2 bg-gray-100 block text-base hover:text-indigo-600 focus:text-indigo-500 transition-colors duration-75"
        to={post.slug}
      >
        <div className="w-full flex justify-between sm:flex-row flex-col">
          <h4 className="text-2xl font-semibold mb-3 leading-tight max-w-3xl mr-2">
            {post.title}
          </h4>
          <div>
            <TimeAgo
              datetime={post.date}
              className="mr-2 text-xs text-gray-500"
            />
            {post.category.map((c) => (
              <div
                key={c}
                className="mr-1 mb-3 inline-flex items-center px-2 py-1 rounded-md text-sm font-medium leading-5 bg-gray-200 text-gray-800"
                to={`/posts/${kebabCase(c)}`}
              >
                {c === 'javascript' ? 'JavaScript' : c}
              </div>
            ))}
          </div>
        </div>
        <Markdown source={post.excerpt} />
      </Link>
    </li>
  )
}

export default function Categories({ categories, posts, location, ...props }) {
  const searchParam = !isEmpty(location.search)
    ? location.search.replace('?s=', '')
    : ''

  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.5 },
      { name: 'category', weight: 0.2 },
    ],
    useExtendedSearch: true,
  }
  const fuse = new Fuse(posts, fuseOptions)

  const [searchValue, setSearchValue] = React.useState(searchParam)
  const searchOn = searchValue.length > 0
  const searchRef = React.useRef(null)
  const result = fuse.search(searchValue)
  function submitSearch(e) {
    e.preventDefault()
    navigate(`?s=${encodeURIComponent(searchValue)}`)
  }
  React.useEffect(() => {
    searchRef.current.value = decodeURIComponent(searchParam)
  }, [searchParam])

  const numberOfUncategorizedPosts = posts.filter(
    (post) => post.category.length === 0,
  ).length

  return (
    <Layout title="Categories" {...props}>
      <h1 className="text-4xl font-bold text-center">Posts</h1>
      <form className="mb-4 mt-6" onSubmit={(e) => submitSearch(e)}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative rounded-md shadow-sm max-w-lg mx-auto">
          <input
            autoComplete="off"
            aria-labelledby="search"
            type="search"
            id="search"
            ref={searchRef}
            onChange={(e) => {
              e.preventDefault()
              setSearchValue(e.target.value)
            }}
            className="form-input pl-8 block w-full sm:text-base sm:leading-5"
            placeholder="Search posts"
            value={searchValue}
          />
          {/* prettier-ignore */}
          <svg className="absolute top-2 mt-px ml-2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" className="nc-icon-wrapper"><path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8z" fill="currentColor"/></g></svg>
        </div>
      </form>
      <ul>
        {searchOn &&
          !isEmpty(result) &&
          result.map(({ item: post }, i) => (
            <Item post={post} key={post.id} index={i} />
          ))}
      </ul>
      {!searchOn && (
        <ul>
          {categories.map((category) => {
            const numberOfPostsInCategory = posts.filter((post) =>
              post.category.includes(category.fieldValue),
            ).length

            return (
              <div key={category.fieldValue}>
                <div className="mb-2 mt-10 pl-8 sticky top-0 py-2 bg-white bg-opacity-75 bg-blur">
                  <h2 className="text-3xl font-bold  inline hover:text-indigo-600">
                    <Link to={`/posts/${kebabCase(category.fieldValue)}`}>
                      {category.fieldValue}
                    </Link>
                  </h2>
                  <span>
                    {' '}
                    ({numberOfPostsInCategory}{' '}
                    {pluralize('Post', numberOfPostsInCategory)})
                  </span>
                </div>
                <ul
                  className={`grid gap-8 ${
                    numberOfPostsInCategory > 1 && 'md:grid-cols-2 grid-cols-1'
                  }`}
                >
                  {posts
                    .filter((post) =>
                      post.category.includes(category.fieldValue),
                    )
                    .map((post) => (
                      <li key={post.id}>
                        <Link
                          className="h-full rounded-md p-8 bg-gray-100 block text-base hover:text-indigo-700 transition-colors duration-75"
                          to={post.slug}
                        >
                          <h4 className="text-2xl font-semibold mb-3 leading-tight">
                            {post.title}
                          </h4>
                          <Markdown source={post.excerpt} />
                          <div>Read more →</div>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )
          })}
        </ul>
      )}
      {/* Uncategorized Posts */}
      {!searchOn &&
        posts.filter((post) => post.category.length === 0).length > 0 && (
          <div className="relative">
            <div className="mb-2 mt-10 ml-8 sticky top-0 py-2 bg-white bg-opacity-75 bg-blur">
              <h2 className="text-3xl font-bold inline">Uncategorized</h2>
              <span>
                {' '}
                ({numberOfUncategorizedPosts}{' '}
                {pluralize('Post', numberOfUncategorizedPosts)})
              </span>
            </div>
            <ul className="grid gap-8 md:grid-cols-2 grid-cols-1">
              {posts
                .filter((post) => post.category.length === 0)
                .map((post) => (
                  <li key={post.id}>
                    <Link
                      className="rounded-md p-8 bg-gray-100 block text-base hover:text-indigo-700 transition-colors duration-75"
                      to={post.slug}
                    >
                      <h4 className="text-2xl font-semibold mb-3">
                        {post.title}
                      </h4>
                      <Markdown source={post.excerpt} />
                      <div>Read more →</div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
    </Layout>
  )
}

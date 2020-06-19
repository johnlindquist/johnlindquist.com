import React from 'react'
import Fuse from 'fuse.js'
import { graphql } from 'gatsby'
import Link from '../components/link'
import kebabCase from 'lodash/kebabCase'
import Layout from '../components/layout'
import Markdown from '../utils/card-markdown'
import illustration from '../images/projects.svg'

// TODO: Favorite could be a boolean in frontmatter? Or is this better?
const favorites = [
  {
    title: `Customize Karabiner With Goku`,
    slug: `customize-karabiner-with-goku/`,
  },
  {
    title: `Rolling Your Own Creation Operators in RxJS`,
    slug: `creation-operators-in-rxjs/`,
  },
  {
    title: `Automatically Create a Github Repo From the Command-Line`,
    slug: `automatically-create-a-github-repo-from-the-command-line/`,
  },
  {
    title: `Generate Markdown Links From Your Selected Text and Chrome's Current Url Using Alfred`,
    slug: `generate-markdown-links-from-your-selected-text-and-chromes-current-url-using-alfred/`,
  },
  // TODO: Add more favorite posts
]

// TODO: Use this array of popular topics to filter out topics in sidebbar
// const popularTopics = ['javascript', 'RxJS', 'Github']

const getEmoji = (categories) => {
  if (!categories) return ''
  return categories.includes('live') ? '🎥 ' : ''
}

export default function Index({ data: { allBlogPost, allPosts, categories } }) {
  // Search
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.5 },
      { name: 'category', weight: 0.2 },
    ],
    useExtendedSearch: true,
  }
  const posts = allPosts.nodes.map((post) => post)
  const fuse = new Fuse(posts, fuseOptions)

  const [searchValue, setSearchValue] = React.useState('')
  const searchOn = searchValue.length > 0
  const searchRef = React.useRef(null)
  const result = fuse.search(searchValue)

  return (
    <Layout>
      <header
        style={{
          backgroundImage: `url(${illustration})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          height: 300,
          zIndex: -1,
        }}
        className="landing-header w-full mx-auto absolute left-0 top-0 border-b border-gray-200"
      />

      <div className="grid md:grid-cols-3 grid-cols-1 md:gap-16 gap-6 md:mt-56 mt-60">
        <div className="col-span-2">
          <form className="mb-8" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
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
                placeholder={`Search posts (Press "/")`}
                value={searchValue}
              />
              {/* prettier-ignore */}
              <svg className="absolute sm:top-2 top-3 mt-px ml-2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" className="nc-icon-wrapper"><path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8z" fill="currentColor"/></g></svg>
            </div>
          </form>
          {searchOn ? (
            <ul>
              {result.map(({ item: post }) => (
                <li key={post.id} className="pb-4">
                  <Link
                    className="text-base hover:text-indigo-700 transition-colors duration-75"
                    to={post.slug}
                  >
                    <h4 className="text-2xl font-semibold mb-3 leading-tight">
                      {getEmoji(post.category)}
                      {post.title}
                    </h4>
                    <Markdown source={post.excerpt} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <h3 className="uppercase mb-6 text-sm tracking-wide text-gray-600">
                Recently Published
              </h3>
              <ul>
                {allBlogPost.nodes.map((post) => (
                  <li key={post.id}>
                    <Link
                      className="text-base hover:text-indigo-700 transition-colors duration-75"
                      to={post.slug}
                    >
                      <h4 className="text-2xl font-semibold mb-3 leading-tight">
                        {getEmoji(post.category)}
                        {post.title}
                      </h4>
                      <Markdown source={post.excerpt} />
                      <div className="mb-10">Read more →</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link
            to="/posts"
            className="my-5 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 hover:text-indigo-600 transform hover:scale-110 transition-all duration-100 ease-in-out"
          >
            View all posts
          </Link>
        </div>
        <div>
          <h3 className="uppercase mb-6 text-sm tracking-wide text-gray-600">
            <Link to="/posts">Topics</Link>
          </h3>
          <div className="flex flex-wrap -m-1">
            {categories.group.map((category) => (
              <Link
                key={category.fieldValue}
                className="m-1 inline-flex items-center px-2 py-1 rounded-md text-sm font-medium leading-5 bg-indigo-100 text-indigo-800 hover:text-indigo-600 transform hover:scale-110 transition-all duration-100 ease-in-out"
                to={`/posts/${kebabCase(category.fieldValue)}`}
              >
                {category.fieldValue === 'javascript'
                  ? 'JavaScript'
                  : category.fieldValue}
              </Link>
            ))}
          </div>
          <h3 className="uppercase mb-4 mt-10 text-sm tracking-wide text-gray-600">
            Favorites
          </h3>
          <ul>
            {favorites.map((favorite) => (
              <li key={favorite.slug} className="mb-4">
                <Link
                  className="text-lg font-semibold hover:text-indigo-600 leading-tight flex"
                  to={favorite.slug}
                >
                  {favorite.title}
                </Link>
              </li>
            ))}
          </ul>
          {/* <h3 className="uppercase mb-6 mt-10 text-sm tracking-wide text-gray-600">
            More stuff
          </h3>
          ... */}
        </div>
      </div>
    </Layout>
  )
}

export const indexQuery = graphql`
  {
    allBlogPost(
      sort: { fields: date, order: DESC }
      filter: { published: { eq: true } }
      limit: 8
    ) {
      nodes {
        id
        title
        excerpt
        slug
        category
      }
    }
    categories: allBlogPost {
      group(field: category) {
        fieldValue
      }
    }
    allPosts: allBlogPost(
      sort: { fields: date, order: DESC }
      filter: { published: { eq: true } }
      limit: 1000
    ) {
      totalCount
      nodes {
        id
        title
        excerpt
        slug
        category
      }
    }
  }
`

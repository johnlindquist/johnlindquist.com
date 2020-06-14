import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Link from './link'
import { isEmpty } from 'lodash'
import Fuse from 'fuse.js'
import { useKeyPressEvent, useClickAway } from 'react-use'
import { motion } from 'framer-motion'

export default function Search() {
  const [isOpen, setOpen] = React.useState(false)
  useKeyPressEvent(
    '/',
    () => setOpen(!isOpen),
    () => setOpen(isOpen ? true : false),
  )

  const containerRef = React.useRef(null)
  useClickAway(containerRef, () => {
    setOpen(false)
  })

  const data = useStaticQuery(graphql`
    {
      allBlogPost(
        sort: { fields: [date, title], order: DESC }
        filter: { published: { eq: true } }
        limit: 1000
      ) {
        edges {
          node {
            id
            excerpt
            slug
            title
            date(formatString: "MMMM DD, YYYY")
            category
          }
        }
      }
    }
  `)

  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.5 },
    ],
  }

  const [searchValue, setSearchValue] = React.useState('')
  const posts = data.allBlogPost.edges
  const fuse = new Fuse(
    posts.map(({ node }) => node),
    fuseOptions,
  )
  const searchOn = searchValue.length > 0
  const searchRef = React.useRef(null)
  const result = fuse.search(searchValue)

  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.1,
      },
    },
  }

  const resItem = {
    hidden: { opacity: 0, marginLeft: -10 },
    show: {
      opacity: 1,
      marginLeft: 0,
    },
  }

  return isOpen ? (
    <div className="fixed z-20 w-screen h-screen top-0 left-0 p-24 flex items-center justify-center bg-opacity-25 bg-gray-500 bg-blur">
      <motion.div
        style={{ perspective: 350 }}
        initial={{ opacity: 0, rotateX: -20 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.3 }}
        ref={containerRef}
        className="max-w-screen-sm w-full bg-white shadow-xl relative rounded-lg overflow-hidden"
      >
        <button
          onClick={() => setOpen(!isOpen)}
          className="absolute right-4 top-4 text-gray-500"
        >
          {/* prettier-ignore */}
          <svg  width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586 8.707 7.293z" fill="currentColor"/></g></svg>
        </button>
        <input
          autoFocus
          className="p-6 font-semibold text-3xl placeholder-gray-500 w-full focus:outline-none"
          placeholder="Search"
          autoComplete="off"
          aria-labelledby="search"
          type="search"
          id="search"
          ref={searchRef}
          value={searchValue}
          onChange={(e) => {
            e.preventDefault()
            setSearchValue(e.target.value)
          }}
        />
        {/* <pre className="overflow-y-scroll h-80">
          {JSON.stringify(result, null, 2)}
        </pre> */}

        {searchOn ? (
          <motion.ul
            className="max-h-96 overflow-y-auto"
            variants={list}
            initial="hidden"
            animate="show"
          >
            {' '}
            {result.map(({ item: post }) => (
              <motion.li key={post.id} variants={resItem}>
                <Link
                  className="flex justify-between px-6 py-3 border-b border-gray-100 hover:text-blue-600 hover:bg-blue-100 focus:text-blue-600 focus:bg-blue-100 focus:outline-none"
                  activeClassName="text-blue-800 bg-blue-50"
                  to={post.slug}
                >
                  <span>{post.title}</span>
                  <div className="text-gray-400 text-sm">
                    {post.category.map((c) => (
                      <span className="mx-2">{c}</span>
                    ))}
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.ul
            className="max-h-96 overflow-y-auto"
            variants={list}
            initial="hidden"
            animate="show"
          >
            {data.allBlogPost.edges.map(({ node: post }) => (
              <motion.li key={post.id} variants={resItem}>
                <Link
                  className="flex justify-between px-6 py-3 border-b border-gray-100 hover:text-blue-600 hover:bg-blue-100 focus:text-blue-600 focus:bg-blue-100 focus:outline-none"
                  activeClassName="text-blue-800 bg-blue-50"
                  to={post.slug}
                >
                  <span>{post.title}</span>
                  <div className="text-gray-400 text-sm">
                    {post.category.map((c) => (
                      <span className="mx-2">{c}</span>
                    ))}
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {isEmpty(result) && searchOn && <div className="p-6">No Results</div>}
      </motion.div>
    </div>
  ) : null
}

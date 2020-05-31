import React from 'react'
import Layout from './layout'
import Markdown from '../utils/card-markdown'
import Link from './link'
import Capitalize from 'lodash/capitalize'

export default function Category({ posts, ...props }) {
  const category = posts[0].category
  return (
    <Layout title={`${Capitalize(category)} Posts`} {...props}>
      <div className="grid grid-cols-3 mb-10">
        <Link
          to="/posts"
          className="-mt-px inline-flex items-center text-md leading-5 font-medium text-gray-600 hover:text-gray-700  focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150"
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
            />
          </svg>
          All Posts
        </Link>
        <h1 className="text-4xl font-bold text-center capitalize">
          {category}
        </h1>
      </div>

      <ul
        className={`grid gap-8 ${posts.length > 1 &&
          'md:grid-cols-2 grid-cols-1'}`}
      >
        {posts.map(post => (
          <li key={post.id}>
            <Link
              className="rounded-md p-8 bg-gray-100 block text-base hover:text-indigo-700 transition-colors duration-75"
              to={post.slug}
            >
              <h4 className="text-2xl font-semibold mb-3">{post.title}</h4>
              <Markdown source={post.excerpt} />
              <div>Read more</div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

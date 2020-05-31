import React from 'react'
import { Link } from 'gatsby'
import Layout from './layout'
import kebabCase from 'lodash/kebabCase'
import pluralize from 'pluralize'
import Markdown from '../utils/card-markdown'

export default function Categories({ categories, posts, ...props }) {
  const numberOfUncategorizedPosts = posts.filter(
    post => post.category.length === 0,
  ).length
  return (
    <Layout title="Categories" {...props}>
      <h1 className="text-4xl font-bold text-center">Posts</h1>
      <ul>
        {categories.map(category => {
          const numberOfPostsInCategory = posts.filter(post =>
            post.category.includes(category.fieldValue),
          ).length

          return (
            <div key={category.fieldValue}>
              <div className="mb-2 mt-10 ml-8 sticky top-0 py-2 bg-white bg-opacity-75 bg-blur">
                <h2 className="text-3xl font-bold capitalize inline hover:text-indigo-600">
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
                className={`grid gap-8 ${numberOfPostsInCategory > 1 &&
                  'md:grid-cols-2 grid-cols-1'}`}
              >
                {posts
                  .filter(post => post.category.includes(category.fieldValue))
                  .map(post => (
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
      {/* Render uncategorized Posts if there are any */}
      {posts.filter(post => post.category.length === 0).length > 0 && (
        <div className="relative">
          <div className="mb-2 mt-10 ml-8 sticky top-0 py-2 bg-white bg-opacity-75 bg-blur">
            <h2 className="text-3xl font-bold capitalize inline ">
              Uncategorized
            </h2>
            <span>
              {' '}
              ({numberOfUncategorizedPosts}{' '}
              {pluralize('Post', numberOfUncategorizedPosts)})
            </span>
          </div>
          <ul className="grid gap-8 md:grid-cols-2 grid-cols-1">
            {posts
              .filter(post => post.category.length === 0)
              .map(post => (
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

import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Post from '../components/post'

export default props => {
  const { body } = props.data.blogPost
  const children = React.createElement(MDXRenderer, {
    children: body,
  })
  return React.createElement(Post, {
    ...props,
    ...props.data.blogPost,
    children,
  })
}

import React from 'react'
import Category from '../components/category'

export default (props) => {
  const posts = props.data.allBlogPost.edges.map((e) => e.node)
  const categories = props.data.allBlogPost.group

  return React.createElement(Category, {
    ...props,
    posts,
    categories,
  })
}

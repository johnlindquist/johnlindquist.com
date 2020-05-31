import React from 'react'
import Category from '../components/category'

export default props => {
  const posts = props.data.allBlogPost.edges.map(e => e.node)

  return React.createElement(Category, {
    ...props,
    posts,
  })
}

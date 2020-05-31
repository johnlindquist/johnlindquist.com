import React from 'react'
import Posts from '../components/posts'

export default props => {
  const categories = props.data.categories.group.map(e => e)
  const posts = props.data.allBlogPost.edges.map(e => e.node)
  return React.createElement(Posts, {
    ...props,
    categories,
    posts,
  })
}

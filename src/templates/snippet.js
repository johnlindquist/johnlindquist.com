import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Snippet from '../components/snippet'

export default (props) => {
  const { body } = props.data.snippet
  const children = React.createElement(MDXRenderer, {
    children: body,
  })
  return React.createElement(Snippet, {
    ...props,
    ...props.data.snippet,
    children,
  })
}

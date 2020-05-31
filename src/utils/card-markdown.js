import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function Markdown(props) {
  return (
    <ReactMarkdown
      className="markdown text-gray-800"
      source={props.source}
      renderers={{
        // avoid nesting <a>s
        link: props => <span>{props.children}</span>,
      }}
    />
  )
}

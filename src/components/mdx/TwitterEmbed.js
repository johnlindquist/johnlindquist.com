import React from 'react'

export default props => {
  return (
    <blockquote className="twitter-tweet">
      <a href={props.tweet}></a>
    </blockquote>
  )
}

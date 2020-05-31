import React from 'react'

let iframeStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  border: '0',
}

export default props => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '56.25%',
        marginBottom: '1.25rem',
      }}
    >
      <iframe
        style={iframeStyle}
        title={props.title}
        src={`https://www.youtube.com/embed/${props.slug}`}
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}

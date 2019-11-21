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
      }}
    >
      <iframe
        style={iframeStyle}
        title={props.title}
        src={`https://egghead.io/lessons/${props.slug}/embed`}
        frameBorder="0"
      />
    </div>
  )
}

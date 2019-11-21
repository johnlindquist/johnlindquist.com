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
  const fontsize = props.fontsize || 14
  const console = props.console ? `&expanddevtools=1` : ``
  const module = props.module ? `&module=${props.module}` : ``
  const view = props.view ? `&view=${props.view}` : ``
  const hideNav = props.hide ? `` : `&hidenavigation=1`
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
        src={`https://codesandbox.io/embed/${
          props.slug
        }?fontsize=${fontsize}${console}${module}${view}${hideNav}`}
        frameBorder="0"
      />
    </div>
  )
}

import React from 'react'

/*
<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/827782687&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/mrlindquist" title="John Lindquist" target="_blank" style="color: #cccccc; text-decoration: none;">John Lindquist</a> · <a href="https://soundcloud.com/mrlindquist/unruly-umbrella" title="Unruly Umbrella" target="_blank" style="color: #cccccc; text-decoration: none;">Unruly Umbrella</a></div>
*/


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
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${props.id}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}

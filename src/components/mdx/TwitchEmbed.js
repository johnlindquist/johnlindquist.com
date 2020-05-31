import React from 'react'

/*
<iframe src="https://player.twitch.tv/?autoplay=false&video=v631705564" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe><a href="https://www.twitch.tv/videos/631705564?tt_content=text_link&tt_medium=vod_embed" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch Highlight: Practicing Sound Design from johnlindquist on www.twitch.tv</a>
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
        marginBottom: '1.25rem',
      }}
    >
      <iframe
        style={iframeStyle}
        title={props.title}
        src={`https://player.twitch.tv/?autoplay=false&video=${props.id}`}
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}

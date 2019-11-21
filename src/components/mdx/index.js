import React from 'react'

import Title from './Title'
import Subtitle from './Subtitle'
import Paragraph from './Paragraph'
import Code from './Code'
import Codesandbox from './Codesandbox'
import EggheadEmbed from './EggheadEmbed'
import YoutubeEmbed from './YoutubeEmbed'
import TwitterEmbed from './TwitterEmbed'

export default {
  h1: props => <Title {...props} />,
  h2: props => <Subtitle {...props} />,
  p: props => <Paragraph {...props} />,
  code: Code,
  pre: preProps => <pre {...preProps} />,
  Codesandbox,
  EggheadEmbed,
  YoutubeEmbed,
  TwitterEmbed,
}

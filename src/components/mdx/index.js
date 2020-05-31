import React from 'react'

import Code from './Code'
import Codesandbox from './Codesandbox'
import EggheadEmbed from './EggheadEmbed'
import YoutubeEmbed from './YoutubeEmbed'
import SoundCloudEmbed from './SoundCloudEmbed'
import TwitchEmbed from './TwitchEmbed'
import TwitterEmbed from './TwitterEmbed'

export default {
  code: Code,
  pre: preProps => <pre {...preProps} />,
  table: tableProps => (
    <div
      style={{
        overflowX: 'auto',
        width: '100%',
      }}
    >
      <table {...tableProps}>{tableProps.children}</table>
    </div>
  ),
  Codesandbox,
  EggheadEmbed,
  YoutubeEmbed,
  TwitchEmbed,
  TwitterEmbed,
  SoundCloudEmbed,
}

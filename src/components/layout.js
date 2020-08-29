import { useSpring, interpolate } from 'react-spring'
import { MDXProvider } from '@mdx-js/react'
import { useRect } from '../hooks/useRect'
import mdxComponents from './mdx'
import React from 'react'
import Nav from './nav'
import SEO from './seo'
import Newsletter from './newsletter'
import 'focus-visible'

export default function Layout(props) {
  // they see me browsing
  const logoRef = React.useRef()
  const logoPosition = useRect(logoRef, null)
  const [{ st, xy }, set] = useSpring(() => ({ st: 0, xy: [0, 0] }))
  const interpEye = interpolate(
    [st, xy],
    (o, xy) => `translate(${xy[0] / 350}, ${xy[1] / 350 + o / 2})`,
  )
  const onMove = React.useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ xy: [x - logoPosition.x, y - logoPosition.y] }),
    [set, logoPosition],
  )

  return (
    // eslint-disable-next-line
    <div role="main" onMouseMove={onMove}>
      <SEO
        {...props}
        card={props.socialImage}
        description={props.excerpt}
        title={props.title}
        type={props.type}
        url={props.url}
      />
      <div className="container md:pb-16 pb-8">
        <Nav ref={logoRef} interpEye={interpEye} />
        <MDXProvider components={mdxComponents}>
          <main>{props.children}</main>
        </MDXProvider>
        <Newsletter />
      </div>
    </div>
  )
}

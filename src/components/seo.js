import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import defaultCard from '../images/card.png'

function SEO({ description, lang, meta, title, card, type, slug }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `,
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title || site.siteMetadata.title}
      titleTemplate={
        title ? `%s | ${site.siteMetadata.author}` : site.siteMetadata.title
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title || site.siteMetadata.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: type || 'website',
        },
        {
          property: `og:url`,
          content:
            (slug && `${site.siteMetadata.siteUrl}${slug}`) ||
            site.siteMetadata.siteUrl,
        },
        {
          name: `og:image`,
          content: card
            ? `${site.siteMetadata.siteUrl}${card}`
            : `${site.siteMetadata.siteUrl}${defaultCard}`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:image`,
          content: card
            ? `${site.siteMetadata.siteUrl}${card}`
            : `${site.siteMetadata.siteUrl}${defaultCard}`,
        },

        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title || site.siteMetadata.title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: '',
  card: null,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  card: PropTypes.string,
}

export default SEO

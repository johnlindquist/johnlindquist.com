const resolveConfig = require('tailwindcss/resolveConfig')
const tailwindConfig = require('./tailwind.config.js')

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: `John Lindquist`,
    author: `John Lindquist`,
    description: `This is where I post things!`,
    siteUrl: `https://johnlindquist.com`,
    social: [
      {
        name: `Twitter`,
        url: `https://twitter.com/johnlindquist`,
      },
      {
        name: `Github`,
        url: `https://github.com/johnlindquist`,
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1380,
              linkImagesToOriginal: false,
              tracedSVG: true,
              wrapperStyle: { marginBottom: '30rem' },
            },
          },
          { resolve: `gatsby-remark-copy-linked-files` },
          { resolve: `gatsby-remark-smartypants` },
        ],
        remarkPlugins: [require(`remark-slug`)],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `content/posts`,
        name: `content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `content/assets`,
        name: `content/assets`,
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`tailwindcss`)(tailwindConfig),
          require(`autoprefixer`),
          require(`postcss-nested`),
          ...(process.env.NODE_ENV === `production`
            ? [require(`cssnano`)]
            : []),
        ],
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-twitter',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `John Lindquist`,
        short_name: `johnlindquist.com`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#000`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allBlogPost } }) => {
              return allBlogPost.edges.map((edge) => {
                return (
                  {},
                  edge.node,
                  {
                    title: edge.node.title,
                    description: edge.node.excerpt,
                    date: edge.node.date,
                    url: site.siteMetadata.siteUrl + edge.node.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.slug,
                    // custom_elements: [{ "content:encoded": edge.node.body }],
                  }
                )
              })
            },
            query: `
              {
                allBlogPost(
                  sort: { fields: [date, title], order: DESC }
                  filter: { published: { eq: true } }
                ) {
                  edges {
                    node {
                      excerpt
                      body
                      slug
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'johnlindquist.com',
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}

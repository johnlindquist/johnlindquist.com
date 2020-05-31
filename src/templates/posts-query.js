import { graphql } from 'gatsby'
import PostsPage from './posts'

export default PostsPage

export const query = graphql`
  query PostsQuery {
    site {
      siteMetadata {
        title
      }
    }
    categories: allBlogPost {
      group(field: category) {
        fieldValue
      }
    }
    allBlogPost(
      sort: { fields: [date, title], order: DESC }
      filter: { published: { eq: true } }
      limit: 1000
    ) {
      edges {
        node {
          id
          excerpt
          slug
          title
          date(formatString: "MMMM DD, YYYY")
          category
        }
      }
    }
  }
`

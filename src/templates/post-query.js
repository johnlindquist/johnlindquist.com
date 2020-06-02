import { graphql } from 'gatsby'
import PostPage from './post'

export default PostPage

export const query = graphql`
  query PostPageQuery($id: String!, $previousId: String, $nextId: String) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    blogPost(id: { eq: $id }) {
      id
      excerpt
      body
      slug
      socialImage {
        childImageSharp {
          fixed(width: 1200) {
            src
          }
          original {
            src
          }
        }
      }
      title
      category
      keywords
      published
      editUrl
      date(formatString: "MMMM DD, YYYY")
    }
    previous: blogPost(id: { eq: $previousId }) {
      id
      excerpt
      slug
      title
      date(formatString: "MMMM DD, YYYY")
    }
    next: blogPost(id: { eq: $nextId }) {
      id
      excerpt
      slug
      title
      date(formatString: "MMMM DD, YYYY")
    }
  }
`

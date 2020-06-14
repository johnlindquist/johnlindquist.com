import { graphql } from 'gatsby'
import SnippetPage from './snippet'

export default SnippetPage

export const query = graphql`
  query SnippetPageQuery($id: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    snippet(id: { eq: $id }) {
      id
      excerpt
      body
      slug
      title
      published
      editUrl
      date(formatString: "MMMM DD, YYYY")
    }
  }
`

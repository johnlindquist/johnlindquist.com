const fs = require(`fs`)
const path = require(`path`)
const mkdirp = require(`mkdirp`)
const debug = require(`debug`)
const {
  createFilePath,
  createRemoteFileNode,
} = require(`gatsby-source-filesystem`)
const { urlResolve, createContentDigest, slash } = require(`gatsby-core-utils`)
const _ = require('lodash')

const debugBlog = debug(`gatsby-theme-blog-core`)
const withDefaults = require(`./src/utils/default-options`)
const createSchemaCustomization = require(`./gatsby/create-schema-customization`)

// Ensure that content directories exist at site-level
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState()
  const { contentPath, assetPath, snippetsPath } = withDefaults(themeOptions)

  const dirs = [
    path.join(program.directory, contentPath),
    path.join(program.directory, snippetsPath),
    path.join(program.directory, assetPath),
  ]

  dirs.forEach((dir) => {
    debugBlog(`Initializing ${dir} directory`)
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir)
    }
  })
}

exports.createSchemaCustomization = createSchemaCustomization

function validURL(str) {
  try {
    new URL(str)
    return true
  } catch (e) {
    return false
  }
}

// Create fields for post slugs and source
// This will change with schema customization with work
exports.onCreateNode = async (
  { node, actions, getNode, createNodeId },
  themeOptions,
) => {
  const { createNode, createParentChildLink } = actions
  const { contentPath, snippetsPath, basePath } = withDefaults(themeOptions)

  // Make sure it's an MDX node
  if (node.internal.type !== `Mdx`) {
    return
  }

  // Create source field (according to contentPath)
  const fileNode = getNode(node.parent)
  const source = fileNode.sourceInstanceName

  // Posts
  if (node.internal.type === `Mdx` && source === contentPath) {
    let slug
    if (node.frontmatter.slug) {
      if (path.isAbsolute(node.frontmatter.slug)) {
        // absolute paths take precedence
        slug = node.frontmatter.slug
      } else {
        // otherwise a relative slug gets turned into a sub path
        slug = urlResolve(basePath, node.frontmatter.slug)
      }
    } else {
      // otherwise use the filepath function from gatsby-source-filesystem
      const filePath = createFilePath({
        node: fileNode,
        getNode,
        basePath: contentPath,
      })

      slug = urlResolve(basePath, filePath)
    }
    // normalize use of trailing slash
    slug = slug.replace(/\/*$/, `/`)

    // assign edit url per post
    const postEditUrl =
      'https://github.com/johnlindquist/johnlindquist.com/edit/master/content/posts' +
      createFilePath({
        node: fileNode,
        getNode,
        basePath: contentPath,
      }).replace(/\/*$/, ``) +
      '.md'
    const fieldData = {
      title: node.frontmatter.title,
      category: node.frontmatter.category || [],
      slug,
      date: node.frontmatter.date,
      keywords: node.frontmatter.keywords || [],
      published: node.frontmatter.published,
      editUrl: postEditUrl,
      socialImage: node.frontmatter.socialImage,
    }

    if (validURL(node.frontmatter.socialImage)) {
      // create a file node for image URLs
      const remoteFileNode = await createRemoteFileNode({
        url: node.frontmatter.socialImage,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
      })
      // if the file was created, attach the new node to the parent node
      if (remoteFileNode) {
        fieldData.socialImage___NODE = remoteFileNode.id
      }
    }

    const mdxBlogPostId = createNodeId(`${node.id} >>> MdxBlogPost`)
    await createNode({
      ...fieldData,
      // Required fields.
      id: mdxBlogPostId,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxBlogPost`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the BlogPost interface`,
      },
    })
    createParentChildLink({ parent: node, child: getNode(mdxBlogPostId) })
  }

  // Snippets
  if (node.internal.type === `Mdx` && source === snippetsPath) {
    let slug
    if (node.frontmatter.slug) {
      if (path.isAbsolute(node.frontmatter.slug)) {
        // absolute paths take precedence
        slug = node.frontmatter.slug
      } else {
        // otherwise a relative slug gets turned into a sub path
        slug = urlResolve(basePath, node.frontmatter.slug)
      }
    } else {
      // otherwise use the filepath function from gatsby-source-filesystem
      const filePath = createFilePath({
        node: fileNode,
        getNode,
        basePath: snippetsPath,
      })

      slug = urlResolve(basePath, filePath)
    }
    // normalize use of trailing slash
    slug = slug.replace(/\/*$/, `/`)

    // Get Snippet GitHub URL
    const snippetAbsolutePath = node.fileAbsolutePath
    const isMdx = snippetAbsolutePath.includes('.mdx')
    const isInsideFolder = isMdx
      ? snippetAbsolutePath.includes('index.mdx')
      : snippetAbsolutePath.includes('index.md')
    const snippetEditUrl = `https://github.com/johnlindquist/johnlindquist.com/edit/master/content/snippets${createFilePath(
      { node: fileNode, getNode, basePath: snippetsPath },
    ).replace(/\/*$/, ``)}${
      isInsideFolder ? `/index.md${isMdx ? 'x' : ''}` : `.md${isMdx ? 'x' : ''}`
    }`

    const fieldData = {
      title: node.frontmatter.title,
      slug,
      date: node.frontmatter.date,
      published: node.frontmatter.published,
      editUrl: snippetEditUrl,
    }

    const mdxSnippetId = createNodeId(`${node.id} >>> MdxSnippet`)
    await createNode({
      ...fieldData,
      // Required fields.
      id: mdxSnippetId,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxSnippet`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the Snippet interface`,
      },
    })
    createParentChildLink({ parent: node, child: getNode(mdxSnippetId) })
  }
}

// These templates are simply data-fetching wrappers that import components
const PostTemplate = require.resolve(`./src/templates/post-query`)
const SnippetTemplate = require.resolve(`./src/templates/snippet-query`)
const CategoryTemplate = require.resolve(`./src/templates/category-query`)
const PostsTemplate = require.resolve(`./src/templates/posts-query`)

exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions
  const { basePath } = withDefaults(themeOptions)

  const result = await graphql(`
    {
      allBlogPost(sort: { fields: [date, title], order: DESC }, limit: 1000) {
        edges {
          node {
            id
            slug
          }
        }
        group(field: category) {
          fieldValue
        }
      }
      allSnippet(sort: { fields: [date, title], order: DESC }, limit: 1000) {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic(result.errors)
  }

  // Create Posts and Post pages.
  const { allBlogPost, allSnippet } = result.data
  const posts = allBlogPost.edges
  const snippets = allSnippet.edges
  const categories = result.data.allBlogPost.group

  // Create a page for each Post
  posts.forEach(({ node: post }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1]
    const next = index === 0 ? null : posts[index - 1]
    const { slug } = post
    createPage({
      path: slug,
      component: PostTemplate,
      context: {
        id: post.id,
        previousId: previous ? previous.node.id : undefined,
        nextId: next ? next.node.id : undefined,
      },
    })
  })

  // Create a page for each Category
  categories.forEach((category) => {
    createPage({
      path: `/posts/${_.kebabCase(category.fieldValue)}/`,
      component: CategoryTemplate,
      context: {
        category: category.fieldValue,
      },
    })
  })

  // Create the Posts page
  createPage({
    path: '/posts',
    component: PostsTemplate,
    context: {},
  })

  // Create a page for each Snippet
  snippets.forEach(({ node: snippet }, index) => {
    const previous = index === snippets.length - 1 ? null : snippets[index + 1]
    const next = index === 0 ? null : snippets[index - 1]
    const { slug } = snippet
    createPage({
      path: `/snippets${slug}`,
      component: SnippetTemplate,
      context: {
        id: snippet.id,
        previousId: previous ? previous.node.id : undefined,
        nextId: next ? next.node.id : undefined,
      },
    })
  })
}

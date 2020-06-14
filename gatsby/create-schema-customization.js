module.exports = ({ actions, schema }) => {
  const { createTypes } = actions
  createTypes(`interface BlogPost @nodeInterface {
        id: ID!
        title: String!
        body: String!
        slug: String!
        date: Date! @dateformat
        category: [String]!
        keywords: [String]!
        excerpt: String!
        socialImage: File
        published: Boolean!
        editUrl: String!
    }`)

  createTypes(
    schema.buildObjectType({
      name: `MdxBlogPost`,
      fields: {
        id: { type: `ID!` },
        title: {
          type: `String!`,
        },
        slug: {
          type: `String!`,
        },
        socialImage: {
          type: 'File',
          resolve: async (source, args, context, info) => {
            if (source.socialImage___NODE) {
              return context.nodeModel.getNodeById({
                id: source.socialImage___NODE,
              })
            } else if (source.socialImage) {
              return processRelativeImage(source, context, 'socialImage')
            }
          },
        },
        published: {
          type: `Boolean!`,
        },
        editUrl: {
          type: `String!`,
        },
        date: { type: `Date!`, extensions: { dateformat: {} } },
        category: { type: `[String]!` },
        keywords: { type: `[String]!` },
        excerpt: {
          type: `String!`,
          args: {
            pruneLength: {
              type: `Int`,
              defaultValue: 220,
            },
          },
          resolve: mdxResolverPassthrough(`excerpt`),
        },
        body: {
          type: `String!`,
          resolve: mdxResolverPassthrough(`body`),
        },
      },
      interfaces: [`Node`, `BlogPost`],
      extensions: {
        infer: false,
      },
    }),
  )
  createTypes(`interface Snippet @nodeInterface {
        id: ID!
        title: String!
        body: String!
        slug: String!
        date: Date! @dateformat
        excerpt: String!
        published: Boolean!
        editUrl: String!
    }`)

  createTypes(
    schema.buildObjectType({
      name: `MdxSnippet`,
      fields: {
        id: { type: `ID!` },
        title: {
          type: `String!`,
        },
        slug: {
          type: `String!`,
        },
        published: {
          type: `Boolean!`,
        },
        editUrl: {
          type: `String!`,
        },
        date: { type: `Date!`, extensions: { dateformat: {} } },
        excerpt: {
          type: `String!`,
          args: {
            pruneLength: {
              type: `Int`,
              defaultValue: 220,
            },
          },
          resolve: mdxResolverPassthrough(`excerpt`),
        },
        body: {
          type: `String!`,
          resolve: mdxResolverPassthrough(`body`),
        },
      },
      interfaces: [`Node`, `Snippet`],
      extensions: {
        infer: false,
      },
    }),
  )
}

const mdxResolverPassthrough = (fieldName) => async (
  source,
  args,
  context,
  info,
) => {
  const type = info.schema.getType(`Mdx`)
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  })
  const resolver = type.getFields()[fieldName].resolve
  const result = await resolver(mdxNode, args, context, {
    fieldName,
  })
  return result
}

function processRelativeImage(source, context, type) {
  // Image is a relative path - find a corresponding file
  const mdxFileNode = context.nodeModel.findRootNodeAncestor(
    source,
    (node) => node.internal && node.internal.type === `File`,
  )
  if (!mdxFileNode) {
    return
  }
  const imagePath = slash(path.join(mdxFileNode.dir, source[type]))

  const fileNodes = context.nodeModel.getAllNodes({ type: `File` })
  for (let file of fileNodes) {
    if (file.absolutePath === imagePath) {
      return file
    }
  }
}

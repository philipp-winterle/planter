import type { GatsbyConfig } from "gatsby";

const PORT = process.env.GATSBY_PORT ?? 8000;
const HOST = process.env.DIRECTUS_HOST ?? `http://127.0.0.1:${PORT}`;

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Planter`,
    siteUrl: `http://127.0.0.1:${PORT}`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: false,
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    // {
    //   resolve: "@directus/gatsby-source-directus",
    //   options: {
    //     // Learn about environment variables: https://gatsby.dev/env-vars
    //     url: process.env.DIRECTUS_HOST,
    //     auth: {
    //       token: process.env.DIRECTUS_ACCESS_TOKEN,
    //       // email: "tcms-dev@check24.de",
    //       // password: "check24.de",
    //     },
    //     dev: {
    //       refresh: 0,
    //     },
    //   },
    // },
  ],
};

export default config;

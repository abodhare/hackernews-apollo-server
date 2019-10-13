const { ApolloServer, gql, UserInputError } = require('apollo-server');
const fetch = require('node-fetch');

const typeDefs = gql`
    type Item {
      id: Int!
      title: String
      points: Int
      user: String
      time: Int!
      time_ago: String!
      content: String!
      deleted: Boolean!
      dead: Boolean!
      type: String!
      url: String!
      domain: String!
      comments: [Item]!
      level: Int!
      comments_count: Int!
    }

    type User {
      about: String!
      created_time: Int!
      created: String!
      id: String!
      karma: Int!
    }

    type FeedItem {
      id: Int!
      title: String!
      points: Int
      user: String
      time: Int!
      time_ago: String!
      comments_count: Int!
      type: String!
      url: String!
      domain: String!
    }

    type Query {
      item(id: Int!): Item
      user(id: String!): User
      news(index: Int!): [FeedItem]
      newest(index: Int!): [FeedItem]
      ask(index: Int!): [FeedItem]
      show(index: Int!): [FeedItem]
      jobs(index: Int!): [FeedItem]
    }
`;

const baseURL = `https://api.hnpwa.com/v0`
const resolvers = {
    Query: {
      item: (parent, args) => {
        const { id } = args;
        return fetch(`${baseURL}/item/${id}.json`).then(res => res.json());
      },
      user: (parent, args) => {
        const { id } = args;
        return fetch(`${baseURL}/user/${id}.json`).then(res => res.json());
      },
      news: (parent, args) => {
        const { index } = args;
        const validationErrors = {};
        if (index > 10 || index < 1) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/news/${index}.json`).then(res => res.json());
      },
      newest: (parent, args) => {
        const { index } = args;
        const validationErrors = {};
        if (index > 12 || index < 1) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/newest/${index}.json`).then(res => res.json());
      },
      ask: (parent, args) => {
        const { index } = args;
        const validationErrors = {};
        if (index > 2 || index < 1) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/ask/${index}.json`).then(res => res.json());
      },
      show: (parent, args) => {
        const { index } = args;
        const validationErrors = {};
        if (index > 2 || index < 1) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/show/${index}.json`).then(res => res.json());
      },
      jobs: (parent, args) => {
        const { index } = args;
        const validationErrors = {};
        if (index > 1 || index < 1) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/jobs/${index}.json`).then(res => res.json());
      },
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
})
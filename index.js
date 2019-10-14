const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { print } = require('graphql');
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
      feeds(type: String!, index: Int!): [FeedItem]!
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
      feeds: (parent, args) => {
        const { index, type } = args;
        const validationErrors = {};

        validFeeds = (type, index) => {
          if (type === "news") return index > 0 && index <= 10;
          else if (type === "newest") return index > 0 && index <= 12;
          else if (type === "ask") return index > 0 && index <= 2;
          else if (type === "show") return index > 0 && index <= 2;
          else if (type === "jobs") return index > 0 && index <= 1;
        }
        if (!validFeeds(type, index)) {
          validationErrors.page = 'This is not a valid page number';
        }
        if (Object.keys(validationErrors).length > 0) {
          throw new UserInputError(
            'Failed to get data due to validation errors',
            { validationErrors }
          );
        }
        return fetch(`${baseURL}/${type}/${index}.json`).then(res => res.json());
      },
    }
}

class BasicLogging {
  requestDidStart({queryString, parsedQuery, variables}) {
    const query = queryString || print(parsedQuery);
    console.log(query);
    console.log(variables);
  }

  willSendResponse({graphqlResponse}) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
}

const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  extensions: [() => new BasicLogging()],
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
})
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// NOTE: Hardcoded data
const customers = [
  {id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35},
  {id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25},
  {id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32}
];

// NOTE: Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type:GraphQLString},
    name: {type:GraphQLString},
    email: {type:GraphQLString},
    age: {type:GraphQLInt}
  })
})


// NOTE: Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(parentValue, args) {
        return customers.find((c) => c.id == args.id)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return customers;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

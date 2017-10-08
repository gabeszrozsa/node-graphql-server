const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// NOTE: Hardcoded data
// const customers = [
//   {id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35},
//   {id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25},
//   {id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32}
// ];

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
        return axios.get(`http://localhost:3000/customers/${args.id}`)
          .then(response => response.data)
        // return customers.find((c) => c.id === args.id)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/customers`)
          .then(response => response.data)
      }
    }
  }
});

// NOTE: Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addCustomer:{
      type:CustomerType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age,
        })
        .then(response => response.data);
      }
    },
    deleteCustomer:{
      type:CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
        .then(response => response.data);
      }
    },
    editCustomer:{
      type:CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
        .then(response => response.data);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

const axios = require('axios');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;
const User = require('../Model/userModel');

const UserType = new GraphQLObjectType({
    name: 'Users',
    fields: () => ({
        _id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: (parentValue, args) => {
                return User.find({});
            }
        },
        login: {
            type: UserType,
            args: { username: { type: GraphQLString }, password: { type: GraphQLString } },
            resolve: async (parentValue, args) => {
                let { username, password } = args;
                let user = await User.findOne({ username }).select('+password');
                if (!user || !(await user.correctPassword(password, user.password))) {
                    return next(new Error("Incorrect Email or Password"));
                }
                if (user) {
                    return user;
                }
            }
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        registerUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)} 
            },
            resolve: async (parentValue, args) => {
                // console.log(...args);
                try {
                    let user = await User.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        username: args.username,
                        email: args.email,
                        password:args.password
                });
                    return user;
                }
                catch (err) {
                    return err;
                }
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id:{type:new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                username: { type: GraphQLString },
                email: { type: GraphQLString}
            },
            resolve: async (parentValue,args) => {
                try {
                    let user = await User.findByIdAndUpdate(args.id, args)
                    return user;
                }
                catch (err) {
                    return err;
                }
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:mutation
})
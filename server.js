const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./Schema/schema');
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/globiliti", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
}).then(res => {
    console.log("Database Connected");
})
.catch(err => {
    console.log("Database Error");
})
const app = express();
app.use('/graphql', expressGraphQL({
    schema,
    graphiql:true
}));

app.listen(4000, () => {
    console.log("Listening");
})
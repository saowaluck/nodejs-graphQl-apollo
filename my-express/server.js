const express = require('express')
const bodyParser = require('body-parser')
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')

const app = express()

const graphqlHTTP = require('express-graphql');
const schema = require('./schema')

const Post = require('./models/Post')
const User = require('./models/User')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     graphiql: true
// }))

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
app.use('/graphql', graphqlExpress({
    schema
}))
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}))


const authMiddleware = async(req, res, next) =>{
    const token = req.query.token || req.headers.authorization
    if (token){
        const user = await User.getByToken(token)
        if(!user){
            return res.sendStatus(401)
        }
        req.user = user
    }
    next()
}
// app.get('/home', (req, res) => {
//     console.log(req.query)
//     res.json('hi')
//     // res.json('topic: hi')
// })


app.use(authMiddleware)
app.use('/', postRoute)
app.use('/', userRoute)

// 

app.listen(9000)
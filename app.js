// app.js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const koaBody = require('koa-bodyparser');
const router = new Router();
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index')



require('dotenv').config();

// routing
router.get('/testing', (ctx, next) => {
 ctx.body = 'Hello World!\n';
});


app.use(mount('/graphql', graphqlHTTP({
  schema: graphqlSchema ,
   rootValue: graphqlResolvers,
   graphiql: true
  })
));

// mongo connection
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('We\'re connected to ' + mongoDB);
  app.listen(3000);
});

app.use(router.routes());
app.use(router.allowedMethods());

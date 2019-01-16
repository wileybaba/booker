// app.js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const koaBody = require('koa-bodyparser');
const router = new Router();
const mount = require('koa-mount');
const cors = require('@koa/cors');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index')
const authenticated = require('./middleware/authenticated');


require('dotenv').config();

// routing
router.get('/testing', (ctx, next) => {
 ctx.body = 'Hello World!\n';
});

app.use(cors());

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', 'true', '*');
//   ctx.set('Access-Control-Allow-Methods', 'true', 'POST, GET, OPTIONS');
//   ctx.set('Access-Control-Allow-Headers', 'true', 'Content-Type, Authorization');
//   if (ctx.method === 'OPTIONS') {
//     return ctx.status(200);
//   }
//   await next();
// });

app.use(authenticated);

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
  app.listen(8000);
  console.log('Listening on port 8000')
});

app.use(router.routes());
app.use(router.allowedMethods());

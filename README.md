# API

**Run**
> npm start

**Build**
> npm run build

This is the main repository of all API code for Game of Cards. The stack is composed of:
- Koa Web Server
- Apollo GraphQL Server 
- Typegoose (Mongoose) Database Models

## Top Down Walkthrough
`src/index.ts` will connect to the database and start the application
`src/lib/app.ts` will initialize the application architecture components
-> app: [Koa](https://koajs.com/)
-> router: Router
-> pubsub: PubSub
-> schema: GraphQLSchema
-> apollo: ApolloServer
-> server: Server
First we initialize the Apollo Server. During this step, we're actually doing a lot. We're building our GraphQL schema using the Type-GraphQL api, and providing it with our resolvers. The resolvers are the bridge between incoming requests and accessing/updating our data model, like REST apis. Type-GraphQL will emit a schema file of our data model `src/lib/app/schema.gql`. Apollo Server will consume our schema, and bind the PubSub instance to the context of apollo operations. 

### Modules
`src/lib/modules`

#### Core
The Core module groups classes essential to all games.

#### Games
The Games module is groups code specific to one game.

#### Security
The Security module sets up access and permissions for users in the application.

### Module Structure
- **index.ts:** export schema and model
- **module.data.ts**: test data
- **module.input.ts**: reusable parameter objects
- **module.resolver.ts**: graphql binding
- **module.test.ts**: automation
- **module.ts**: typegoose model, type-graphql binding

#### Typegoose and Type-GraphQL
Decorators are utilized to integrate our class models with mongodb and graphql. Both of these libraries provide a set of decorators we can use. Typegoose will integrate with mongoose so the class turns into a database model. Type-GraphQL will integrate with graphql, causing the class to output a schema and resolvers when the application is built.

## Travis CI
Continuous Integration Platform to help build and test our code changes. On every commit Travis will run our tests and send a slack message to the channel with the results.

## Docker
The repository is linked to Docker Hub. With automated builds enabled, on every commit a new docker image is created. Configuration files are `Dockerfile` and `.dockerignore`. [Travis CI Documentation](https://docs.travis-ci.com/user/for-beginners/)

## Babel
We're writing code in es2015+, so we'll use Babel to convert it to a backwards compatible version of Javascript. Bundles are optimized, so it'll improve performance. It's basically just transforming our syntax. And we need some additional libraries to have Babel do that job. [Babel Documentation](https://babeljs.io/docs/en/usage). Configuration file is `.babelrc`.

## Webpack
Now we can move on to setting up Webpack, our static module bundler. Webpack gernerates a dependency graph, mapping every module to one or more bundles.

### Core Concepts
- Entry: The entry point. It indicates which module webpack should use to begin building the graph.
- Output: This property tells webpack where to emit the bundles it creates and how to name them.
- Loaders: Webpack by default only understands Javasciprt and JSON files. We use loaders to allow webpack to process other types of files, and convert them into modules our application can consume.
- Plugins: Can be configured to perform tasks like optimization, asset managment, etc.
- Mode: Webpack has built in optimizations. By setting mode to 'development', 'production', or 'none', we can enable them.
- Browser Compatibility: Webpack support all browsers that are ES5-compliant.

**Loaders**
babel-loader 
source-map-loader 
ts-loader 
eslint-loader
tslint-loader

Configuration file is `webpack.config.js`.

## Linting
Both ESLint and TSLint are setup for code formatting. Loaders for both are setup so that we can code in both javascript and typescript, but most of the code will be Typescript. Configurations fies are `tslint.json` and `.prettierrc`.

## Typescript Config
The `tsconfig.json` file sets various typescript configuration options.

## Commit Message Linting
A few packages will help us validate our commit messages so they are in the format: "type(scope?): message"
- types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
- scope: anything
- message: anything
Configuration files are `.huskyrc` and `commitlint.config.js`.
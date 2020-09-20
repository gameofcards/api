# API

**Run**
> npm start

**Build**
> npm run build

This is the main repository of all API code for Game of Cards. We will use Typescript, Koa, Babel, TSLint and Webpack. 

## Babel
We're writing code in es2015+, so we'll use Babel to convert it to a backwards compatible version of Javascript. Bundles are optimized, so it'll improve performance. It's basically just transforming our syntax. And we need some additional libraries to have Babel do that job. [Why?](https://babeljs.io/docs/en/usage)

@babel/core 
@babel/cli 
@babel/preset-env 
@babel/preset-react 
@babel/plugin-transform-typescript 
@babel/polyfill

`npm install --save-dev @babel/core @babel/cli @babel/preset-env`
`npm install --save @babel/polyfill`

Then we can setup our `babel.config.ts`.

## Webpack
Now we can move on to setting up Webpack, our static module bundler. Webpack gernerates a dependency graph, mapping every module to one or more bundles. We need these modules:

webpack 
webpack-cli

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

Now we can create our `webpack.config.js` file.

## Linting
We use both ESLint and TSLint for code formatting. We have loaders for both setup, although most of the code will be Typescript. 

eslint
eslint-plugin-import
tslint
tslint-config-prettier
tslint-loader
tslint-plugin-prettier
prettier

Configurations are defined in `tslint.json` and `.prettierrc`.

## Typescript Config
The `tsconfig.json` file sets various typescript configuration options.

## Commit Message Linting
A few packages will help us validate our commit messages so they are in the format:
`type(scope?): message`
types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
scope: anything
message: anything

@commitlint/cli
@commitlint/config-conventional
husky

The files `.huskyrc` and `commitlint.config.js` contain some configuration to setup this up.
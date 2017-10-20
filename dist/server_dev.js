/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Simple class to act as a singleton for app-wide configuration.

// We'll start with a common config that can be extended separately by the
// server/client, to provide environment-specific functionality
let Common = class Common {
  constructor() {
    // Store reducers in a `Map`, for easy key retrieval
    this.reducers = new Map();

    // Apollo (middle|after)ware
    this.apolloMiddleware = [];
    this.apolloAfterware = [];
    this.apolloNetworkOptions = {};
    this.apolloClientOptions = {};

    // GraphQL endpoint.  This needs setting via either `config.enableGraphQLServer()`
    // or `config.setGraphQLEndpoint()`
    this.graphQLEndpoint = null;

    // Set to true if we're using an internal GraphQL server
    this.graphQLServer = false;
  }

  /* REDUX */

  // Adds a new reducer.  Accepts a `key` string, a `reducer` function, and a
  // (by default empty) `initialState` object, which will ultimately become immutable
  addReducer(key, reducer, initialState = {}) {
    if (typeof reducer !== 'function') {
      throw new Error(`Can't add reducer for '${key}' - reducer must be a function`);
    }
    this.reducers.set(key, {
      reducer,
      initialState
    });
  }

  /* GRAPHQL */

  // Enables internal GraphQL server.  Default GraphQL and GraphiQL endpoints
  // can be overridden
  enableGraphQLServer(endpoint = '/graphql', graphiQL = true) {
    this.graphQLServer = true;
    this.graphQLEndpoint = endpoint;
    this.graphiQL = graphiQL;
  }

  // Set an external GraphQL URI for use with Apollo
  setGraphQLEndpoint(uri, graphiQL = true) {
    this.graphQLEndpoint = uri;
    this.graphiQL = graphiQL;
  }

  // Register Apollo middleware function
  addApolloMiddleware(middlewareFunc) {
    this.apolloMiddleware.push(middlewareFunc);
  }

  // Register Apollo afterware function
  addApolloAfterware(afterwareFunc) {
    this.apolloAfterware.push(afterwareFunc);
  }

  // Apollo Client options.  These will be merged in with the `createClient`
  // default options defined in `kit/lib/apollo.js`
  setApolloClientOptions(opt = {}) {
    this.apolloClientOptions = opt;
  }

  // Apollo Network options.  These will be merged in with the `createNetworkInterface`
  // default options defined in `kit/lib/apollo.js`
  setApolloNetworkOptions(opt = {}) {
    this.apolloNetworkOptions = opt;
  }
};

// Placeholder for the class we'll attach

let Config;

// Server Config extensions.  This is wrapped in a `SERVER` block to avoid
// adding unnecessary functionality to the client bundle.  Every byte counts!
if (true) {
  Config = class ServerConfig extends Common {
    constructor() {
      super();
      // Create a set for routes -- to retrieve based on insertion order
      this.routes = new Set();

      // Koa application function. But default, this is null
      this.koaAppFunc = null;

      // Flag for setting whether plain HTTP should be disabled
      this.enableHTTP = true;

      // Force SSL. Rewrites all non-SSL queries to SSL.  False, by default.
      this.enableForceSSL = false;

      // Options for enabling SSL. By default, this is null. If SSL is enabled
      // in userland, this would instead hold an object of options
      this.sslOptions = null;

      // Custom middleware -- again, based on insertion order
      this.middleware = new Set();

      // GraphQL schema (if we're using an internal server)
      this.graphQLSchema = null;

      // Attach a GraphiQL IDE endpoint to our server?  By default - no.  If
      // this === true, this will default to `/graphql`.  If it's a string, it'll
      // default to the string value
      this.graphiQL = false;

      // Enable body parsing by default.  Leave `koa-bodyparser` opts as default
      this.enableBodyParser = true;
      this.bodyParserOptions = {};

      // CORS options for `koa-cors`
      this.corsOptions = {};
    }

    /* WEB SERVER / SSR */

    // Get access to Koa's `app` instance, for adding custom instantiation
    // or doing something that's not covered by other functions
    getKoaApp(func) {
      this.koaAppFunc = func;
    }

    // Enable SSL. Normally, you'd use an upstream proxy like Nginx to handle
    // SSL. But if you want to run a 'bare' Koa HTTPS web server, you can pass
    // in the certificate details here and it'll respond to SSL requests
    enableSSL(opt) {
      // At a minimum, we should have `key` and `cert` -- check for those
      if (typeof opt !== 'object' || !opt.key || !opt.cert) {
        throw new Error('Cannot enable SSL. Missing `key` and/or `cert`');
      }
      this.sslOptions = opt;
    }

    // Force SSL. Rewrites all non-SSL queries to SSL. Any options here are
    // passed to `koa-sslify`, the SSL enforcement middleware
    forceSSL(opt = {}) {
      this.enableForceSSL = opt;
    }

    // Disable plain HTTP.  Note this should only be used if you've also set
    // `enableSSL()` and you don't want dual-HTTP+SSL config
    disableHTTP() {
      this.enableHTTP = false;
    }

    // Disable the optional `koa-bodyparser`, to prevent POST data being sent to
    // each request.  By default, body parsing is enabled.
    disableBodyParser() {
      this.enableBodyParser = false;
    }

    setBodyParserOptions(opt = {}) {
      this.bodyParserOptions = opt;
    }

    // 404 handler for the server.  By default, `kit/entry/server.js` will
    // simply return a 404 status code without modifying the HTML render.  By
    // setting a handler here, this will be returned instead
    set404Handler(func) {
      if (typeof func !== 'function') {
        throw new Error('404 handler must be a function');
      }
      this.handler404 = func;
    }

    // Error handler.  If this isn't defined, the server will simply return a
    // 'There was an error. Please try again later.' message, and log the output
    // to the console.  Override that behaviour by passing a (e, ctx, next) -> {} func
    setErrorHandler(func) {
      if (typeof func !== 'function') {
        throw new Error('Error handler must be a function');
      }
      this.errorHandler = func;
    }

    // Add custom middleware.  This should be an async func, for use with Koa
    addMiddleware(middlewareFunc) {
      this.middleware.add(middlewareFunc);
    }

    // Adds a custom server route to attach to our Koa router
    addRoute(method, route, ...handlers) {
      this.routes.add({
        method,
        route,
        handlers
      });
    }

    // Adds custom GET route
    addGetRoute(route, ...handlers) {
      this.addRoute('get', route, ...handlers);
    }

    // Adds custom POST route
    addPostRoute(route, ...handlers) {
      this.addRoute('post', route, ...handlers);
    }

    // Adds custom PUT route
    addPutRoute(route, ...handlers) {
      this.addRoute('put', route, ...handlers);
    }

    // Adds custom PATCH route
    addPatchRoute(route, ...handlers) {
      this.addRoute('patch', route, ...handlers);
    }

    // Adds custom DELETE route
    addDeleteRoute(route, ...handlers) {
      this.addRoute('delete', route, ...handlers);
    }

    // Set the GraphQL schema. This should only be called on the server, otherwise
    // the bundle size passed by the `schema` object will be unnecessarily inflated
    setGraphQLSchema(schema) {
      this.graphQLSchema = schema;
    }

    // CORS options, for `koa-cors` instantiation
    setCORSOptions(opt = {}) {
      this.corsOptions = opt;
    }
  };
} else {
  // For the client config, we'll extend `Common` by default -- but if we need
  // anything unique to the browser in the future, we'd add it here...
  Config = class ClientConfig extends Common {};
}

// Since there's only one `Config` instance globally, we'll create the new
// instance here and export it.  This will then provide any subsequent imports
// with the same object, so we can add settings to a common config
exports.default = new Config();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
	"content": "content-2VPQHqsWcFYcoqtr8QBr8w",
	"hotelItem": "hotelItem-lZdK4RxhVnOEBqBfuo_tP",
	"hotelCover": "hotelCover-qbk-HzIUm6N5vIRKyKF4B",
	"hotelInfo": "hotelInfo-GXmYR35-sK5PLVOGOubRf",
	"searchSection": "searchSection-2KdqQgriloRir7SOHml9Tu",
	"sortSection": "sortSection-1fvoLMuBRknThGxO6zIq6E",
	"filterSection": "filterSection-1P7aaQtCE2-zAsYWNsD0XD",
	"btn": "btn-3X7vTkeBV0ClrGHNzNYLgD",
	"searchBtn": "searchBtn-2-FFXfU8UbxsfPSBdUzQtx",
	"sortIcon": "sortIcon-fhjBdQYCvqSSig-kwpoBe"
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerURL = getServerURL;
/* eslint-disable import/prefer-default-export */

// Environment-aware functions

// Get the protocol://host:port of where the current server would bind
function getServerURL(host = "localhost", port = "8081", allowSSL = true) {
  // Check for SSL
  if (allowSSL && null) {
    const stub = `https://${host || "localhost"}`;

    // If we're on port 443, that's 'regular' SSL so no need to specify port
    if (null === '443') return stub;
    return `${stub}:${null}`;
  }

  // Plain HTTP
  const stub = `http://${host || "localhost"}`;

  // If we're on port 80, that's 'regular' HTTP so no need to specify port
  if (port === '80') return stub;
  return `${stub}:${port}`;
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("react-apollo");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("react-helmet");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const uuid = __webpack_require__(38);

exports.default = [{
  "uuid": uuid.v4(),
  "name": "Carlos-Hotel",
  "rating": 2,
  "cover": "carlos.jpg"
}, {
  "uuid": uuid.v4(),
  "name": "Bellagio-Hotel",
  "rating": 5,
  "cover": "bellagio.jpg"
}, {
  "uuid": uuid.v4(),
  "name": "Boston-Hotel",
  "rating": 4,
  "cover": "boston.jpg"
}, {
  "uuid": uuid.v4(),
  "name": "Poseidon-Hotel",
  "rating": 3,
  "cover": "poseidon.jpg"
}, {
  "uuid": "uuid5",
  "name": "Safari-Hotel",
  "rating": 5,
  "cover": "safari.jpg"
}];

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("seamless-immutable");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("react-fontawesome");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("font-awesome/css/font-awesome.css");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chalk = __webpack_require__(4);

var _chalk2 = _interopRequireDefault(_chalk);

var _console = __webpack_require__(17);

var _server = __webpack_require__(20);

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-console */

// Production server entry point.  Spawns the server on default HOST:PORT

// ----------------------
// IMPORTS

/* NPM */

// Chalk terminal library


/* Local */

// Import console messages


// Extend the server base


// ----------------------

// Get manifest values
const css = '/assets/css/style.css';
const scripts = ['vendor.js', 'browser.js'].map(key => `/${key}`);

// Spawn the development server.
// Runs inside an immediate `async` block, to await listening on ports
_asyncToGenerator(function* () {
  const { app, router, listen } = _server2.default;

  // Create proxy to tunnel requests to the browser `webpack-dev-server`
  router.get('/*', (0, _server.createReactHandler)(css, scripts));

  // Connect the development routes to the server
  app.use((0, _server.staticMiddleware)()).use(router.routes()).use(router.allowedMethods());

  // Spawn the server
  listen();

  // Log to the terminal that we're ready for action
  (0, _console.logServerStarted)({
    type: 'server-side rendering',
    chalk: _chalk2.default.bgYellow.black
  });
})();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logServerStarted = logServerStarted;

var _boxen = __webpack_require__(18);

var _boxen2 = _interopRequireDefault(_boxen);

var _chalk = __webpack_require__(4);

var _chalk2 = _interopRequireDefault(_chalk);

var _ip = __webpack_require__(19);

var _ip2 = _interopRequireDefault(_ip);

var _env = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

// IP library, for determining the local network interface
/* eslint-disable import/prefer-default-export, no-console */

// ----------------------
// IMPORTS

/* NPM */

// Display a border around a message
function logServerStarted(opt = {}) {
  let message = _chalk2.default.green(`Running ${(opt.chalk || _chalk2.default.bold)(opt.type)} in ${_chalk2.default.bold("development")} mode\n\n`);
  message += `- ${_chalk2.default.bold('Local:           ')} ${(0, _env.getServerURL)(opt.host, opt.port, opt.allowSSL)}`;

  try {
    const url = (0, _env.getServerURL)(_ip2.default.address(), opt.port, opt.allowSSL);
    message += `\n- ${_chalk2.default.bold('On Your Network: ')} ${url}`;
  } catch (err) {/* ignore errors */}

  console.log((0, _boxen2.default)(message, {
    padding: 1,
    borderColor: 'green',
    margin: 1
  }));
}

/* ReactQL */


// Chalk library, to add colour to our console logs

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("boxen");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("ip");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticMiddleware = staticMiddleware;
exports.createReactHandler = createReactHandler;

var _stream = __webpack_require__(21);

var _http = __webpack_require__(22);

var _http2 = _interopRequireDefault(_http);

var _https = __webpack_require__(23);

var _https2 = _interopRequireDefault(_https);

__webpack_require__(24);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(25);

var _server2 = _interopRequireDefault(_server);

var _koa = __webpack_require__(26);

var _koa2 = _interopRequireDefault(_koa);

var _reactApollo = __webpack_require__(6);

var _koaSslify = __webpack_require__(27);

var _koaSslify2 = _interopRequireDefault(_koaSslify);

var _kcors = __webpack_require__(28);

var _kcors2 = _interopRequireDefault(_kcors);

var _koaSend = __webpack_require__(29);

var _koaSend2 = _interopRequireDefault(_koaSend);

var _koaHelmet = __webpack_require__(30);

var _koaHelmet2 = _interopRequireDefault(_koaHelmet);

var _koaRouter = __webpack_require__(31);

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _microseconds = __webpack_require__(32);

var _microseconds2 = _interopRequireDefault(_microseconds);

var _reactRouter = __webpack_require__(33);

var _reactHelmet = __webpack_require__(7);

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _apolloServerKoa = __webpack_require__(34);

var _apolloLocalQuery = __webpack_require__(35);

var _apolloLocalQuery2 = _interopRequireDefault(_apolloLocalQuery);

var _graphql = __webpack_require__(8);

var graphql = _interopRequireWildcard(_graphql);

var _app = __webpack_require__(36);

var _app2 = _interopRequireDefault(_app);

var _redux = __webpack_require__(53);

var _redux2 = _interopRequireDefault(_redux);

var _ssr = __webpack_require__(56);

var _ssr2 = _interopRequireDefault(_ssr);

var _apollo = __webpack_require__(57);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

var _paths = __webpack_require__(58);

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-param-reassign, no-console */

// Server entry point, for Webpack.  This will spawn a Koa web server
// and listen for HTTP requests.  Clients will get a return render of React
// or the file they have requested
//
// Note:  No HTTP optimisation is performed here (gzip, http/2, etc).  Node.js
// will nearly always be slower than Nginx or an equivalent, dedicated proxy,
// so it's usually better to leave that stuff to a faster upstream provider

// ----------------------
// IMPORTS

/* Node */

// For pre-pending a `<!DOCTYPE html>` stream to the server response


// HTTP & SSL servers.  We can use `config.enableSSL|disableHTTP()` to enable
// HTTPS and disable plain HTTP respectively, so we'll use Node's core libs
// for building both server types.


/* NPM */

// Patch global.`fetch` so that Apollo calls to GraphQL work


// React UI


// React utility to transform JSX to HTML (to send back to the client)


// Koa 2 web server.  Handles incoming HTTP requests, and will serve back
// the React render, or any of the static assets being compiled


// Apollo tools to connect to a GraphQL server.  We'll grab the
// `ApolloProvider` HOC component, which will inject any 'listening' React
// components with GraphQL data props.  We'll also use `getDataFromTree`
// to await data being ready before rendering back HTML to the client


// Enforce SSL, if required


// Enable cross-origin requests


// Static file handler


// HTTP header hardening


// Koa Router, for handling URL requests


// High-precision timing, so we can debug response time to serve a request


// React Router HOC for figuring out the exact React hierarchy to display
// based on the URL


// <Helmet> component for retrieving <head> section, so we can set page
// title, meta info, etc along with the initial HTML


// Import the Apollo GraphQL server, for Koa


// Allow local GraphQL schema querying when using a built-in GraphQL server


// Import all of the GraphQL lib, for use with our Apollo client connection


/* ReactQL */

// App entry point.  This must come first, because app.js will set-up the
// server config that we'll use later


// Custom redux store creator.  This will allow us to create a store 'outside'
// of Apollo, so we can apply our own reducers and make use of the Redux dev
// tools in the browser


// Initial view to send back HTML render


// Grab the shared Apollo Client / network interface instantiation


// App settings, which we'll use to customise the server -- must be loaded
// *after* app.js has been called, so the correct settings have been set


// Import paths.  We'll use this to figure out where our public folder is
// so we can serve static files


// ----------------------

// Create a network layer based on settings.  This is an immediate function
// that binds either the `localInterface` function (if there's a built-in
// GraphQL) or `externalInterface` (if we're pointing outside of ReactQL)
const createNeworkInterface = (() => {
  // For a local interface, we want to allow passing in the request's
  // context object, which can then feed through to our GraphQL queries to
  // extract pertinent information and manipulate the response
  function localInterface(context) {
    return _apolloLocalQuery2.default.createLocalInterface(graphql, _config2.default.graphQLSchema, {
      // Attach the request's context, which certain GraphQL queries might
      // need for accessing cookies, auth headers, etc.
      context
    });
  }

  function externalInterface() {
    return (0, _apollo.getNetworkInterface)(_config2.default.graphQLEndpoint);
  }

  return _config2.default.graphQLServer ? localInterface : externalInterface;
})();

// Static file middleware
function staticMiddleware() {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      try {
        if (ctx.path !== '/') {
          return yield (0, _koaSend2.default)(ctx, ctx.path,  false ? {
            root: _paths2.default.public,
            immutable: true
          } : {
            root: _paths2.default.distDev
          });
        }
      } catch (e) {/* Errors will fall through */}
      return next();
    });

    function staticMiddlewareHandler(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return staticMiddlewareHandler;
  })();
}

// Function to create a React handler, per the environment's correct
// manifest files
function createReactHandler(css = [], scripts = [], chunkManifest = {}) {
  return (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      const routeContext = {};

      // Generate the HTML from our React tree.  We're wrapping the result
      // in `react-router`'s <StaticRouter> which will pull out URL info and
      // store it in our empty `route` object
      const components = _react2.default.createElement(
        _reactRouter.StaticRouter,
        { location: ctx.request.url, context: routeContext },
        _react2.default.createElement(
          _reactApollo.ApolloProvider,
          { store: ctx.store, client: ctx.apollo },
          _react2.default.createElement(_app2.default, null)
        )
      );

      // Wait for GraphQL data to be available in our initial render,
      // before dumping HTML back to the client
      yield (0, _reactApollo.getDataFromTree)(components);

      // Handle redirects
      if ([301, 302].includes(routeContext.status)) {
        // 301 = permanent redirect, 302 = temporary
        ctx.status = routeContext.status;

        // Issue the new `Location:` header
        ctx.redirect(routeContext.url);

        // Return early -- no need to set a response body
        return;
      }

      // Handle 404 Not Found
      if (routeContext.status === 404) {
        // By default, just set the status code to 404.  Or, we can use
        // `config.set404Handler()` to pass in a custom handler func that takes
        // the `ctx` and store

        if (_config2.default.handler404) {
          _config2.default.handler404(ctx);

          // Return early -- no need to set a response body, because that should
          // be taken care of by the custom 404 handler
          return;
        }

        ctx.status = routeContext.status;
      }

      // Create a HTML stream, to send back to the browser
      const htmlStream = new _stream.PassThrough();

      // Prefix the doctype, so the browser knows to expect HTML5
      htmlStream.write('<!DOCTYPE html>');

      // Create a stream of the React render. We'll pass in the
      // Helmet component to generate the <head> tag, as well as our Redux
      // store state so that the browser can continue from the server
      const reactStream = _server2.default.renderToNodeStream(_react2.default.createElement(
        _ssr2.default,
        {
          head: _reactHelmet2.default.rewind(),
          window: {
            webpackManifest: chunkManifest,
            __STATE__: ctx.store.getState()
          },
          css: css,
          scripts: scripts },
        components
      ));

      // Pipe the React stream to the HTML output
      reactStream.pipe(htmlStream);

      // Set the return type to `text/html`, and stream the response back to
      // the client
      ctx.type = 'text/html';
      ctx.body = htmlStream;
    });

    function reactHandler(_x3) {
      return _ref2.apply(this, arguments);
    }

    return reactHandler;
  })();
}

// Build the router, based on our app's settings.  This will define which
// Koa route handlers
const router = new _koaRouter2.default().
// Set-up a general purpose /ping route to check the server is alive
get('/ping', (() => {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    ctx.body = 'pong';
  });

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
})())

// Favicon.ico.  By default, we'll serve this as a 204 No Content.
// If /favicon.ico is available as a static file, it'll try that first
.get('/favicon.ico', (() => {
  var _ref4 = _asyncToGenerator(function* (ctx) {
    ctx.res.statusCode = 204;
  });

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
})());

// Build the app instance, which we'll use to define middleware for Koa
// as a precursor to handling routes
const app = new _koa2.default()
// Adds CORS config
.use((0, _kcors2.default)(_config2.default.corsOptions))

// Preliminary security for HTTP headers
.use((0, _koaHelmet2.default)())

// Error wrapper.  If an error manages to slip through the middleware
// chain, it will be caught and logged back here
.use((() => {
  var _ref5 = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (e) {
      // If we have a custom error handler, use that - else simply log a
      // message and return one to the user
      if (typeof _config2.default.errorHandler === 'function') {
        _config2.default.errorHandler(e, ctx, next);
      } else {
        console.log('Error:', e.message);
        ctx.body = 'There was an error. Please try again later.';
      }
    }
  });

  return function (_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
})())

// It's useful to see how long a request takes to respond.  Add the
// timing to a HTTP Response header
.use((() => {
  var _ref6 = _asyncToGenerator(function* (ctx, next) {
    const start = _microseconds2.default.now();
    yield next();
    const end = _microseconds2.default.parse(_microseconds2.default.since(start));
    const total = end.microseconds + end.milliseconds * 1e3 + end.seconds * 1e6;
    ctx.set('Response-Time', `${total / 1e3}ms`);
  });

  return function (_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
})())

// Create a new Apollo client and Redux store per request.  This will be
// stored on the `ctx` object, making it available for the React handler or
// any subsequent route/middleware
.use((() => {
  var _ref7 = _asyncToGenerator(function* (ctx, next) {
    // Create a new server Apollo client for this request
    ctx.apollo = (0, _apollo.createClient)({
      ssrMode: true,
      // Create a network request.  If we're running an internal server, this
      // will be a function that accepts the request's context, to feed through
      // to the GraphQL schema
      networkInterface: createNeworkInterface(ctx)
    });

    // Create a new Redux store for this request
    ctx.store = (0, _redux2.default)(ctx.apollo);

    // Pass to the next middleware in the chain: React, custom middleware, etc
    return next();
  });

  return function (_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
})());

/* FORCE SSL */

// Middleware to re-write HTTP requests to SSL, if required.
if (_config2.default.enableForceSSL) {
  app.use((0, _koaSslify2.default)(_config2.default.enableForceSSL));
}

// Attach custom middleware
_config2.default.middleware.forEach(middlewareFunc => app.use(middlewareFunc));

// Attach an internal GraphQL server, if we need one
if (_config2.default.graphQLServer) {
  // Attach the GraphQL schema to the server, and hook it up to the endpoint
  // to listen to POST requests
  router.post(_config2.default.graphQLEndpoint, (0, _apolloServerKoa.graphqlKoa)(context => ({
    // Bind the current request context, so it's accessible within GraphQL
    context,
    // Attach the GraphQL schema
    schema: _config2.default.graphQLSchema
  })));
}

// Do we need the GraphiQL query interface?  This can be used if we have an
// internal GraphQL server, or if we're pointing to an external server.  First,
// we check if `config.graphiql` === `true` to see if we need one...

if (_config2.default.graphiQL) {
  // The GraphiQL endpoint default depends on this order of precedence:
  // explicit -> internal GraphQL server endpoint -> /graphql
  let graphiQLEndpoint;

  if (typeof _config2.default.graphiQL === 'string') {
    // Since we've explicitly passed a string, we'll use that as the endpoint
    graphiQLEndpoint = _config2.default.graphiQL;
  } else if (_config2.default.graphQLServer) {
    // If we have an internal GraphQL server, AND we haven't set a string,
    // the default GraphiQL path should be the same as the server endpoint
    graphiQLEndpoint = _config2.default.graphQLEndpoint;
  } else {
    // Since we haven't set anything, AND we don't have an internal server,
    // by default we'll use `/graphql` which will work for an external server
    graphiQLEndpoint = '/graphql';
  }

  router.get(graphiQLEndpoint, (0, _apolloServerKoa.graphiqlKoa)({
    endpointURL: _config2.default.graphQLEndpoint
  }));
}

// Attach any custom routes we may have set in userland
_config2.default.routes.forEach(route => {
  router[route.method](route.route, ...route.handlers);
});

/* BODY PARSING */

// `koa-bodyparser` is used to process POST requests.  Check that it's enabled
// (default) and apply a custom config if we need one
if (_config2.default.enableBodyParser) {
  app.use(__webpack_require__(60)(
  // Pass in any options that may have been set in userland
  _config2.default.bodyParserOptions));
}

/* CUSTOM APP INSTANTIATION */

// Pass the `app` to do anything we need with it in userland. Useful for
// custom instantiation that doesn't fit into the middleware/route functions
if (typeof _config2.default.koaAppFunc === 'function') {
  _config2.default.koaAppFunc(app);
}

// Listener function that will start http(s) server(s) based on userland
// config and available ports
const listen = () => {
  // Spawn the listeners.
  const servers = [];

  // Plain HTTP
  if (_config2.default.enableHTTP) {
    servers.push(_http2.default.createServer(app.callback()).listen("8081"));
  }

  // SSL -- only enable this if we have an `SSL_PORT` set on the environment
  if (false) {
    servers.push(_https2.default.createServer(_config2.default.sslOptions, app.callback()).listen(process.env.SSL_PORT));
  }

  return servers;
};

// Export everything we need to run the server (in dev or prod)
exports.default = {
  router,
  app,
  listen
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("koa-sslify");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("kcors");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("koa-send");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("koa-helmet");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("microseconds");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("apollo-server-koa");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("apollo-local-query");

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

var _hotel = __webpack_require__(37);

var _hotel2 = _interopRequireDefault(_hotel);

var _main = __webpack_require__(39);

var _main2 = _interopRequireDefault(_main);

var _data = __webpack_require__(9);

var _data2 = _interopRequireDefault(_data);

__webpack_require__(50);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // Your app's entry point.  Every ReactQL projects requires 'src/app.js',
// which both the server and browser will import.
//
// In this file, you'll do two things:
//
// 1.  Import `kit/config`, and configure your app.  In this example, I'm
// adding a custom Redux reducer that acts as a simple counter, and enabling
// a built-in GraphQL server that imports a schema for a simple message.
//
// 2.  Export the root React component that goes between <div id="main"/>
// in the server-side HTML.

// ----------------------
// IMPORTS


/* ReactQL */

// Config API, for adding reducers and configuring our ReactQL app


/* App */

// Example counter reducer.  This simply increments the counter by +1


// Main component -- i.e. the 'root' React component in our app


// Init global styles.  These will be added to the resulting CSS automatically
// without any class hashing.  Use this to include default or framework CSS.


/* REDUCERS */
_config2.default.addReducer('hotels', _hotel2.default, _data2.default);

/* GRAPHQL */

// Enable the internal GraphQL server.  This will do two things:
//
// 1.  On the server, it will set-up the necessary route handlers to 'listen'
// to incoming GraphQL requests on `/graphql`, as well as (by default) set-up
// the GraphiQL IDE
//
// 2.  On the client, it will append the correct server URL so that we can
// call the ReactQL host properly, and let the server handle our requests
_config2.default.enableGraphQLServer();

/* SERVER */

// Set our server config, by checking `SERVER` -- this code path will be
// eliminated by Webpack in the browser, so we can safely add this.

if (true) {
  /* SSL */

  // By default, the Koa web server runs on a plain HTTP server. However,
  // you can easily enable HTTPS.  In the following commands, I grab a sample
  // self-signed key/cert combo and call `config.enableSSL()` with the options
  // I want to pass to the `https.createServer()` that happens under the hood.
  //
  // Note: Running https:// in your browser using this self-signed cert will
  // undoubtably raise a security error. But at least we can see it's working.
  //
  // Production note: I generally recommend using a dedicated upstream proxy
  // such as Nginx to handle HTTPS traffic, since the TLS handshake will likely
  // be faster, and you can add HTTP/2 and have much finer-grain control over
  // HTTP. But, if you need a fast SSL service, ReactQL has you covered!

  /*
    Uncomment the next two lines to enable SSL!
  */

  const cert = __webpack_require__(51);
  _config2.default.enableSSL({ key: cert.key, cert: cert.cert });

  // If wanted, you could also run an *SSL-only* server by uncommenting:
  // config.disableHTTP();

  // Or, you could automatically redirect non-HTTP traffic to SSL by
  // uncommenting the following: (Note: pass { port: 8081 }) for development
  // or { port: 4000 } for the default production port
  // config.forceSSL({ port: 8081 });

  /* GRAPHQL SCHEMA */
  // Pass in the schema to use for our internal GraphQL server.  Note we're
  // doing this inside a `SERVER` block to avoid importing a potentially large
  // file, which would then inflate our client bundle unnecessarily
  _config2.default.setGraphQLSchema(__webpack_require__(52).default);

  /* CUSTOM ROUTES */

  // We can add custom routes to the web server easily, by using
  // `config.add<Get|Post|Put|Patch>Route()`.  Note:  These are server routes only.
  _config2.default.addGetRoute('/test', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      // For demo purposes, let's get a JSON dump of the current Redux state
      // to see that we can expect its contents
      const stateDump = JSON.stringify(ctx.store.getState());

      // Display a simple message, along with the Redux dump.  Note that this
      // won't contain a full `apollo` response, because it hasn't passed through
      // the React handler -- but it *does* mean we can still manipulate the state
      // from within our root, or fire action handlers!
      ctx.body = `Hello from your ReactQL route. Redux dump: ${stateDump}`;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());

  /* CUSTOM 404 HANDLER */

  // By default, if the server gets a route request that results in a 404,
  // it will set `ctx.status = 404` but continue to render the <NotFound>
  // block as normal.  If we want to add our own custom handler, we can use
  // `config.set404Handler()` as below.
  //
  // Note:  This only applies to SERVER routes.  On the client, the
  // <NotFound> block will *always* run.

  _config2.default.set404Handler(ctx => {
    // Like above, we'll grab a dump of the store state again -- this time,
    // it *will* contain a full `apollo` dump because in order to figure out that
    // a route has hit a 404, it will already have rendered the React chain
    // and retrieved any relevant GraphQL
    const stateDump = JSON.stringify(ctx.store.getState());

    // Explicitly set the return status to 404.  This is done for us by
    // default if we don't have a custom 404 handler, but left to the function
    // otherwise (since we might not always want to return a 404)
    ctx.status = 404;

    // Set the body
    ctx.body = `This route does not exist on the server - Redux dump: ${stateDump}`;
  });

  /* CUSTOM ERROR HANDLER */

  // By default, any exceptions thrown anywhere in the middleware chain
  // (including inside the `createReactHandler` func) will propogate up the
  // call stack to a default error handler that simply logs the message and
  // informs the user that there's an error.  We can override that default
  // behaviour with a func with a (e, ctx, next) -> {} signature, where `e` is
  // the error thrown, `ctx` is the Koa context object, and `next()` should
  // be called if you want to recover from the error and continue processing
  // subsequent middleware.  Great for logging to third-party tools, tc.
  _config2.default.setErrorHandler((e, ctx /* `next` is unused in this example */) => {
    // Mimic the default behaviour with an overriden message, so we know it's
    // working
    // eslint-disable-next-line no-console
    console.log('Error: ', e.message);
    ctx.body = 'Some kind of error. Check your source code.';
  });

  /* CUSTOM KOA APP INSTANTIATION */

  // If you need to do something with `app` outside of middleware/routing,
  // you can pass a func to `config.getKoaApp()` that will be fed the `app`
  // instance directly.
  _config2.default.getKoaApp(app => {
    // First, we'll add a new `engine` key to the app.context`
    // prototype (that per-request `ctx` extends) that can be
    // used in the middleware below, to set a `Powered-By` header.
    // eslint-disable-next-line no-param-reassign
    app.context.engine = 'ReactQL';

    // We'll also add a generic error handler, that prints out to the console.
    // Note: This is a 'lower-level' than `config.setErrorHandler()` because
    // it's not middleware -- it's for errors that happen at the server level
    app.on('error', e => {
      // This function should never show up, because `config.setErrorHandler()`
      // is already catching errors -- but just an FYI for what you might do.
      // eslint-disable-next-line no-console
      console.error('Server error:', e);
    });
  });

  /* CUSTOM MIDDLEWARE */

  // We can set custom middleware to be processed on the server.  This gives us
  // fine-grain control over headers, requests, responses etc, and even decide
  // if we want to avoid the React handler until certain conditions
  _config2.default.addMiddleware((() => {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      // Let's add a custom header so we can see middleware in action
      ctx.set('Powered-By', ctx.engine); // <-- `ctx.engine` srt above!

      // For the fun of it, let's demonstrate that we can fire Redux actions
      // and it'll manipulate the state on the server side!  View the SSR version
      // to see that the counter is now 1 and has been passed down the wire
      ctx.store.dispatch({ type: 'INCREMENT_COUNTER' });

      // Always return `next()`, otherwise the request won't 'pass' to the next
      // middleware in the stack (likely, the React handler)
      return next();
    });

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  })());
}

// In app.js, we need to export the root component we want to mount as the
// starting point to our app.  We'll just export the `<Main>` component.
exports.default = _main2.default;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _data = __webpack_require__(9);

var _data2 = _interopRequireDefault(_data);

var _seamlessImmutable = __webpack_require__(10);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reducer(state, action) {
  switch (action.type) {
    case 'FIND_BY_NAME':
      if (action.name.length) {
        return state.filter(hotel => {
          let reg = new RegExp(action.name, "i");
          return hotel.name.match(reg);
        });
      } else {
        return _data2.default;
      }
    case 'SORT_BY_RAITING_ASK':
      return [].concat((0, _seamlessImmutable2.default)(state)).sort((a, b) => a.rating - b.rating);
    case 'SORT_BY_RAITING_DESC':
      return [].concat((0, _seamlessImmutable2.default)(state)).sort((a, b) => b.rating - a.rating);
  }
  return state;
}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(11);

var _reactHelmet = __webpack_require__(7);

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _routing = __webpack_require__(40);

var _hotelList = __webpack_require__(41);

var _hotelList2 = _interopRequireDefault(_hotelList);

var _filterSection = __webpack_require__(48);

var _filterSection2 = _interopRequireDefault(_filterSection);

var _hotel = __webpack_require__(3);

var _hotel2 = _interopRequireDefault(_hotel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ReactQL */

// NotFound 404 handler for unknown routes


// Routing via React Router
exports.default = () => _react2.default.createElement(
  'div',
  { className: _hotel2.default.content },
  _react2.default.createElement(_filterSection2.default, null),
  _react2.default.createElement(_hotelList2.default, null)
);

// Styles


// <Helmet> component for setting the page title/meta tags
// IMPORTS

// React

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Redirect = exports.NotFound = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

// <Status code="xxx"> component.  Updates the context router's context, which
// can be used by the server handler to respond to the status on the server.
let Status = class Status extends _react2.default.PureComponent {

  render() {
    const { code, children } = this.props;
    return _react2.default.createElement(_reactRouterDom.Route, { render: ({ staticContext }) => {
        if (staticContext) {
          staticContext.status = code;
        }
        return children;
      } });
  }
};

// <NotFound> component.  If this renders on the server in development mode,
// it will attempt to proxyify the request to the upstream `webpack-dev-server`.
// In production, it will issue a hard 404 and render.  In the browser, it will
// simply render.
/* eslint-disable no-param-reassign */

// ----------------------
// IMPORTS

Status.propTypes = {
  code: _propTypes2.default.number.isRequired,
  children: _propTypes2.default.node
};
Status.defaultProps = {
  children: null
};
let NotFound = exports.NotFound = class NotFound extends _react2.default.PureComponent {

  render() {
    const { children } = this.props;

    return _react2.default.createElement(
      Status,
      { code: 404 },
      children
    );
  }
};

// <Redirect> component. Mirrors React Router's component by the same name,
// except it sets a 301/302 status code for setting server-side HTTP headers.

NotFound.propTypes = {
  children: _propTypes2.default.node
};
NotFound.defaultProps = {
  children: null
};
let Redirect = exports.Redirect = class Redirect extends _react2.default.PureComponent {

  render() {
    const { to, from, push, permanent } = this.props;
    const code = permanent ? 301 : 302;
    return _react2.default.createElement(
      Status,
      { code: code },
      _react2.default.createElement(_reactRouterDom.Redirect, { to: to, from: from, push: push })
    );
  }
};
Redirect.propTypes = {
  to: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]).isRequired,
  from: _propTypes2.default.string,
  push: _propTypes2.default.bool,
  permanent: _propTypes2.default.bool
};
Redirect.defaultProps = {
  from: null,
  push: false,
  permanent: false
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _class; // IMPORTS

/* NPM */

// HOC/decorator to listen to Redux store state


// Styles


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(12);

var _reactFontawesome = __webpack_require__(13);

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _hotel = __webpack_require__(3);

var _hotel2 = _interopRequireDefault(_hotel);

var _fontAwesome = __webpack_require__(14);

var _fontAwesome2 = _interopRequireDefault(_fontAwesome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let HotelList = (_dec = (0, _reactRedux.connect)(state => ({ hotels: state.hotels })), _dec(_class = class HotelList extends _react2.default.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.getRange = rating => {
      let starCount = [];
      for (let i = 0; i < 5; i++) {
        if (i < rating) starCount.push('star');else starCount.push('star-o');
      }
      return _react2.default.createElement(
        'div',
        { className: _hotel2.default.rating },
        starCount.map((star, index) => _react2.default.createElement(_reactFontawesome2.default, {
          key: index,
          name: star,
          cssModule: _fontAwesome2.default,
          style: { color: 'yellow' }
        }))
      );
    }, _temp;
  }

  render() {
    const hotels = this.props.hotels;
    let content = "Not found";

    if (hotels.length) {
      content = _react2.default.createElement(
        'div',
        null,
        hotels.map(hotel => _react2.default.createElement(
          'div',
          { key: hotel.uuid, className: _hotel2.default.hotelItem },
          _react2.default.createElement(
            'div',
            { className: _hotel2.default.hotelCover, style: { background: "url(" + __webpack_require__(42)(`./${hotel.cover}`) + ") center center" } },
            _react2.default.createElement(
              'div',
              { className: _hotel2.default.hotelInfo },
              hotel.name,
              this.getRange(hotel.rating)
            )
          )
        ))
      );
    }
    return _react2.default.createElement(
      'div',
      null,
      content
    );
  }
}) || _class);
exports.default = HotelList;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./bellagio.jpg": 43,
	"./boston.jpg": 44,
	"./carlos.jpg": 45,
	"./poseidon.jpg": 46,
	"./safari.jpg": 47
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 42;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/bellagio.5031f12efee6b1822c6e8e609e8ef313.jpg";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/boston.7b3e14f447a22ccf162f7b4c9f328119.jpg";

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/carlos.c89090db5b08dda24cf64436236b5c71.jpg";

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/poseidon.1d9b736953400ba2189d2c8135f635b3.jpg";

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/safari.8d28fda3b2e5cfc1f6019fcbae29f6d0.jpg";

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _class; // IMPORTS

/* NPM */

// HOC/decorator to listen to Redux store state


// Actions to add/remove event


// Styles


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(12);

var _reactFontawesome = __webpack_require__(13);

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _actions = __webpack_require__(49);

var _hotel = __webpack_require__(3);

var _hotel2 = _interopRequireDefault(_hotel);

var _fontAwesome = __webpack_require__(14);

var _fontAwesome2 = _interopRequireDefault(_fontAwesome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let HotelList = (_dec = (0, _reactRedux.connect)(state => ({ hotels: state.hotels })), _dec(_class = class HotelList extends _react2.default.PureComponent {
  constructor(props) {
    super(props);

    this.setRef = ref => {
      this.ref = ref;
    };

    this.handleFindHotel = () => {
      this.props.dispatch((0, _actions.findByName)(this.ref.value));
      if (this.ref.value) this.setState({ clearBtn: true });else this.setState({ clearBtn: false });
    };

    this.handleClearSearch = () => {
      this.ref.value = '';
      this.props.dispatch((0, _actions.findByName)(this.ref.value));
      this.setState({ clearBtn: false });
    };

    this.handleSortByRaitingASK = () => {
      this.props.dispatch((0, _actions.sortByRaitingASK)());
      this.setState({ sortByRaiting: 'DESK' });
    };

    this.handleSortByRaitingDESC = () => {
      this.props.dispatch((0, _actions.sortByRaitingDESC)());
      this.setState({ sortByRaiting: 'ASK' });
    };

    this.state = {
      clearBtn: false,
      sortByRaiting: 'ASK'
    };
  }


  render() {
    const hotels = this.props.hotels;

    return _react2.default.createElement(
      'div',
      { className: _hotel2.default.filterSection },
      _react2.default.createElement(
        'div',
        { className: _hotel2.default.searchSection },
        _react2.default.createElement('input', { ref: this.setRef, type: 'text', onChange: () => this.handleFindHotel(), placeholder: 'Search...' }),
        this.state.clearBtn && _react2.default.createElement(
          'div',
          { className: _hotel2.default.searchBtn, onClick: this.handleClearSearch },
          'Clear'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _hotel2.default.sortSection },
        _react2.default.createElement(
          'div',
          { className: _hotel2.default.btn, onClick: () => {
              this.state.sortByRaiting == 'ASK' ? this.handleSortByRaitingASK() : this.handleSortByRaitingDESC();
            } },
          'Sort by ',
          _react2.default.createElement(
            'b',
            null,
            'rating'
          ),
          _react2.default.createElement(_reactFontawesome2.default, {
            name: 'sort',
            cssModule: _fontAwesome2.default,
            className: _hotel2.default.sortIcon
          })
        )
      )
    );
  }
}) || _class);
exports.default = HotelList;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findByName = findByName;
exports.sortByRaitingASK = sortByRaitingASK;
exports.sortByRaitingDESC = sortByRaitingDESC;
function findByName(name) {
  return {
    type: 'FIND_BY_NAME',
    name
  };
}

function sortByRaitingASK() {
  return {
    type: 'SORT_BY_RAITING_ASK'
  };
}

function sortByRaitingDESC() {
  return {
    type: 'SORT_BY_RAITING_DESC'
  };
}

/***/ }),
/* 50 */
/***/ (function(module, exports) {



/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Self-signed certificate. Used for the purposes of running a demo SSL server
// in the sample kit. Don't use in production!

// Private key file
const key = exports.key = `
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEArImW6u4aqhFf2sXDWjYiSg6W9e7LxNz6YbTk0E/G3vybHZk9
4DLe/LLF2x2740WV60DLBXSw1PXbRdNX90MDUJey++BMNDrNlYNTgKC5jBSO54mD
u3WKqhQfawYIaraNdzFix8yCgDgNyDuOziWTcIHRIO4DGH3zERcUH9yxrepoSuE9
HqROVF+dsgTvP+I6CYULMTIDncQi5QaK6DScykAFs8lobmBuZ6ncEZJWejIzzdAo
ZGaW1SQY7BwCauckiqbdlvYdLoRqijvnl/1IyYDBYbDpg+LGnw1US5dmzSf68biT
VpdsmoZi4TgH8Cmnx1VKzGErvaFjJmguhiqqSwIDAQABAoIBAECVsFx4jJqkrlDi
PmICaYt3MqMUpEoovcDdSdmAQ10tCZNmzXajFD1bXhzLYI2OerP5KQX9zEOrVE0q
836nIxKD9oe6Skwyxsn0wskfYNVCzMt2+kytjx5jMe+J7pSjiQjY/7TypNcCJIaT
ZL1d63bt4S6Gabo9S0NWdD4JCqmiu7X8AhJY4TcMr9taRKYH3ileGSRrp2jQyYGV
+E11f8jb6VLFNWJzYV0aRftOefbFm8IQv13vGkxPtJ054tqPfdrIiI6GY01yRxS2
xCPVREnw/nvPu2a3I7EdXdZjgkGMDt9rMGJOkWpEuk9UlEIQqsGRBZ2LfjnS8Kw2
X65JbMECgYEA2vbjJ+0Q7tyxHxp468r84NGiZT/W92p5B31S1yE6czSFtk2rw2vK
6nM5vlYwKnYt0ESlYtmdiWyl4mdrA2eclUczwuVbISlMxLphMs3puQFVcCoBYQ9q
B1Z60BkNfevWXbSN9SH+E/yqqGA9HMuCKcyDIgKsYXvBNyPMlhNloSMCgYEAybhs
3SbxS67NWlF7kT/A8rBDy8alWWAUcX4qD6fxzRpilrT7ChHPydMsgS9rd436GBId
hlFSy+wKfwNvFeyZ59tSWBruEo/9tIPy/aSJRWgxPXcmtoMN/URNvM0igm+ModYA
gMMddekNz+qjpD0a5gSMiw/nV18Kbg3N785haLkCgYB7YEcoFQTIgiNu8hyWR57r
ElPdlvYKHL0rQisuOnPTvBFnYiZZC2Cfb+NmYuvq0QIJatSBeTqx1z007661kWkC
F8eLlm4dpkayRo5D8RAzhRPeCl0SknvcvJagsK0QeZUk4XpnWArwuhpymx90HRsv
cCOnQzhcCT4aUpqRKUbHXwKBgCX2rZZZc+QYe9FZsHW/l+KUxc2eDxRo/q/1XJkh
tGIzawaN/QkCHScQtTmC4SjY8Y6CKkhTGdADFl6dGNT5eGWoYzDtsIyRyN+mTZ7q
zmLfnxTATerfc0yNBExaFvqRX9g9XE7fabX9LHpK4I1SarOLe5/YWGObIW1g77cI
ElERAoGAI0R8KGB6qLmAUx2Kt1LcrH8anhJ32q/qimYdae+0rpfJ7PgqtEyohJ2W
cPOb3RRB2Cte/tYfhZse91lhuFMksp5R+/7H1aAA6u8vw2RFRVfpQMIq8Jag9xoA
wreduKK1jVs++uTaWsz8hJm+OivXz+TVEbv14FxCG+UL0+jHgak=
-----END RSA PRIVATE KEY-----
`;

// Certificate
const cert = exports.cert = `
-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQDJpSJg3QqP6zANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDDAls
b2NhbGhvc3QwHhcNMTcwODI4MTUzNDM3WhcNMjcwODI2MTUzNDM3WjAUMRIwEAYD
VQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCs
iZbq7hqqEV/axcNaNiJKDpb17svE3PphtOTQT8be/JsdmT3gMt78ssXbHbvjRZXr
QMsFdLDU9dtF01f3QwNQl7L74Ew0Os2Vg1OAoLmMFI7niYO7dYqqFB9rBghqto13
MWLHzIKAOA3IO47OJZNwgdEg7gMYffMRFxQf3LGt6mhK4T0epE5UX52yBO8/4joJ
hQsxMgOdxCLlBoroNJzKQAWzyWhuYG5nqdwRklZ6MjPN0ChkZpbVJBjsHAJq5ySK
pt2W9h0uhGqKO+eX/UjJgMFhsOmD4safDVRLl2bNJ/rxuJNWl2yahmLhOAfwKafH
VUrMYSu9oWMmaC6GKqpLAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAGu3NXny0wNR
ltJnRujm5hIDfvu/buG6KUcC/7VIfqWbu2sRjc6ItRWhLZhG46GpfBkU30drSlAe
YAS8vxPPAXegX+X6spdWZu8YMAEncZQyOQsNnGGMUCH9D58Jb8XAGdYUp43M6bE8
muhQs6HDdtEqYpimiGhgBRgnMgbit0dN4jn2U7x0Z+TXbOOJHSN7WGDj5Cm12Dw8
dG1lxJQxNCJuqV/E7Mw6L6Q7KDxiY3hqUeR1wcIE7lgtzhgoFBWv2P0KCyiH3VB/
N9pdArD1KgMyvF7gUZ9jCsrsovOoCfxj8EQ2acgELHDnKA9pfwE8dX5N5iIb8AoE
qoTa3AOG8Vk=
-----END CERTIFICATE-----
`;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

// ----------------------

// GraphQL can handle Promises from its `resolve()` calls, so we'll create a
// simple async function that returns a simple message.  In practice, `resolve()`
// will generally pull from a 'real' data source such as a database
let getMessage = (() => {
  var _ref = _asyncToGenerator(function* () {
    return {
      text: `Hello from the GraphQL server @ ${new Date()}`
    };
  });

  return function getMessage() {
    return _ref.apply(this, arguments);
  };
})();

// Message type.  Imagine this like static type hinting on the 'message'
// object we're going to throw back to the user


var _graphql = __webpack_require__(8);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // Schema for sample GraphQL server.

// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema


const Message = new _graphql.GraphQLObjectType({
  name: 'Message',
  description: 'GraphQL server message',
  fields() {
    return {
      text: {
        type: _graphql.GraphQLString,
        resolve(msg) {
          return msg.text;
        }
      }
    };
  }
});

const Hotels = new _graphql.GraphQLObjectType({
  name: 'Hotels',
  description: 'Hotels list',
  fields() {
    return {
      hotels: {
        type: _graphql.GraphQLString,
        resolve(msg) {
          return msg.text;
        }
      }
    };
  }
});

// Root query.  This is our 'public API'.
const Query = new _graphql.GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields() {
    return {
      message: {
        type: Message,
        resolve() {
          return getMessage();
        }
      }
    };
  }
});

// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
exports.default = new _graphql.GraphQLSchema({
  query: Query
});

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable no-underscore-dangle */

/*
Custom Redux store creation.  Along with the default Apollo store,
we can define custom reducers using `kit/config.addReducer()` which will
be available on the server and in the browser.

Store state is wrapped by `seamless-immutable` to enforce a pattern of
immutability, to prevent weird side effects.
*/

// ----------------------
// IMPORTS

/* NPM */


/* Local */


exports.default = createNewStore;

var _redux = __webpack_require__(54);

var _reduxThunk = __webpack_require__(55);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _seamlessImmutable = __webpack_require__(10);

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

// Detect if we're both in the browser, AND we have dehydrated state
const hasState = !!(!true && window.__STATE__);

// Helper function that 'unwinds' the `config.reducers` Map, and provides
// the `reducer` function or `initialState` (wrapped in `seamless-immutable`)
// depending on what we asked for
function unwind(reducer = true) {
  // Unwind `config.reducers`.  If we're looking for the `reducer`, we'll
  // wrap this in a `defaultReducer` function that properly handles the Redux
  // 'undefined' sentinel value, or calls 'real' reducer if it's not undefined.
  //
  // If we're not looking for reducers, it'll pull out the `initialState`
  // variable instead, which we'll further process below
  const r = Object.assign({}, ...[].concat([..._config2.default.reducers].map(arr => ({
    [arr[0]]: reducer ? function defaultReducer(state, action) {
      // If `state` === undefined, this is Redux sending a sentinel value
      // to check our set-up.  So we'll send back a plain object to prove
      // that we're properly handling our reducer
      if (typeof state === 'undefined') return {};

      // Otherwise, call our real reducer with the {state, action}
      return arr[1].reducer(state, action);
    } : arr[1].initialState
  }))));

  // If this is a reducer, return at this point
  if (reducer) return r;

  // If not, we're looking for the state -- so let's map it and wrap the
  // object in `seamless-immutable`, to avoid side-effects with Redux
  return Object.assign({}, ...Object.keys(r).map(key => ({
    [key]: (0, _seamlessImmutable2.default)(hasState && window.__STATE__[key] || r[key])
  })));
}

function createNewStore(apolloClient) {
  const store = (0, _redux.createStore)(
  // By default, we'll use just the apollo reducer.  We can easily add our
  // own here, for global store management outside of Apollo
  (0, _redux.combineReducers)(_extends({
    apollo: apolloClient.reducer()
  }, unwind())),
  // Initial server state, provided by the server.
  _extends({
    apollo: hasState && window.__STATE__.apollo || {}
  }, unwind(false)), (0, _redux.compose)((0, _redux.applyMiddleware)(apolloClient.middleware(), _reduxThunk2.default),
  // Enable Redux Devtools on the browser, for easy state debugging
  // eslint-disable-next-line no-underscore-dangle
   false ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f));

  return store;
}

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

/* eslint-disable react/no-danger, no-return-assign, no-param-reassign */

// Component to render the full HTML response in React

// ----------------------
// IMPORTS
const Html = ({ head, scripts, window, css, children }) => _react2.default.createElement(
  'html',
  { lang: 'en', prefix: 'og: http://ogp.me/ns#' },
  _react2.default.createElement(
    'head',
    null,
    _react2.default.createElement('meta', { charSet: 'utf-8' }),
    _react2.default.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }),
    _react2.default.createElement('meta', { httpEquiv: 'Content-Language', content: 'en' }),
    _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
    head.meta.toComponent(),
    _react2.default.createElement('link', { rel: 'stylesheet', href: css }),
    head.title.toComponent()
  ),
  _react2.default.createElement(
    'body',
    null,
    _react2.default.createElement(
      'div',
      { id: 'main' },
      children
    ),
    _react2.default.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: Object.keys(window).reduce((out, key) => out += `window.${key}=${JSON.stringify(window[key])};`, '')
      } }),
    scripts.map(src => _react2.default.createElement('script', { key: src, src: src }))
  )
);

Html.propTypes = {
  head: _propTypes2.default.object.isRequired,
  window: _propTypes2.default.object.isRequired,
  scripts: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  css: _propTypes2.default.string.isRequired,
  children: _propTypes2.default.element.isRequired
};

exports.default = Html;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClient = createClient;
exports.getNetworkInterface = getNetworkInterface;
exports.browserClient = browserClient;

var _reactApollo = __webpack_require__(6);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

var _env = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

// Helper function to create a new Apollo client, by merging in
// passed options alongside any set by `config.setApolloOptions` and defaults


/* ReactQL */

// Configuration
function createClient(opt = {}) {
  return new _reactApollo.ApolloClient(Object.assign({
    reduxRootSelector: state => state.apollo
  }, _config2.default.apolloClientOptions, opt));
}

// Wrap `createNetworkInterface` to attach middleware


// Get environment, to figure out where we're running the GraphQL server
// ----------------------
// IMPORTS

/* NPM */

// Apollo client library
function getNetworkInterface(uri) {
  const networkInterface = (0, _reactApollo.createNetworkInterface)({
    uri,
    opts: _config2.default.apolloNetworkOptions
  });

  // Attach middleware
  networkInterface.use(_config2.default.apolloMiddleware.map(f => ({ applyMiddleware: f })));
  networkInterface.useAfter(_config2.default.apolloAfterware.map(f => ({ applyAfterware: f })));

  return networkInterface;
}

// Creates a new browser client
function browserClient() {
  // If we have an internal GraphQL server, we need to append it with a
  // call to `getServerURL()` to add the correct host (in dev + production)
  const uri = _config2.default.graphQLServer ? `${(0, _env.getServerURL)()}${_config2.default.graphQLEndpoint}` : _config2.default.graphQLEndpoint;

  return createClient({
    networkInterface: getNetworkInterface(uri)
  });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ----------------------
// IMPORTS

const path = __webpack_require__(59);

// ----------------------

// Parent folder = project root
const root = path.join(__dirname, '..');

module.exports = {
  // Root project folder.  This is the current dir.
  root,

  // Kit.  ReactQL starter kit code.  You can edit these files, but be
  // aware that upgrading your starter kit could overwrite them
  kit: path.join(root, 'kit'),

  // Entry points.  This is where webpack will look for our browser.js,
  // server.js and vendor.js files to start building
  entry: path.join(root, 'kit', 'entry'),

  // Webpack configuration files
  webpack: path.join(root, 'kit', 'webpack'),

  // Views for internal use
  views: path.join(root, 'kit', 'views'),

  // Source path; where we'll put our application files
  src: path.join(root, 'src'),

  // Static files.  HTML, images, etc that can be processed by Webpack
  // before being moved into the final `dist` folder
  static: path.join(root, 'static'),

  // Dist path; where bundled assets will wind up
  dist: path.join(root, 'dist'),

  // Dist path for development; where dev assets will wind up
  distDev: path.resolve(root, 'dist', 'dev'),

  // Public.  This is where our web server will start looking to serve
  // static files from
  public: path.join(root, 'dist', 'public')
};

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ })
/******/ ]);
//# sourceMappingURL=server_dev.js.map
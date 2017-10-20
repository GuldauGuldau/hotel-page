webpackJsonp([0],{

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kit_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_reducers_hotel__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_src_components_main__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_data_js__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_global_css__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_global_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__styles_global_css__);
var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Your app's entry point.  Every ReactQL projects requires 'src/app.js',
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
__WEBPACK_IMPORTED_MODULE_0_kit_config__["a" /* default */].addReducer('hotels', __WEBPACK_IMPORTED_MODULE_1_src_reducers_hotel__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__data_data_js__["a" /* default */]);

/* GRAPHQL */

// Enable the internal GraphQL server.  This will do two things:
//
// 1.  On the server, it will set-up the necessary route handlers to 'listen'
// to incoming GraphQL requests on `/graphql`, as well as (by default) set-up
// the GraphiQL IDE
//
// 2.  On the client, it will append the correct server URL so that we can
// call the ReactQL host properly, and let the server handle our requests
__WEBPACK_IMPORTED_MODULE_0_kit_config__["a" /* default */].enableGraphQLServer();

/* SERVER */

// Set our server config, by checking `SERVER` -- this code path will be
// eliminated by Webpack in the browser, so we can safely add this.

if (false) {
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

  var cert = require('src/cert/self_signed');
  config.enableSSL({ key: cert.key, cert: cert.cert });

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
  config.setGraphQLSchema(require('src/graphql/schema').default);

  /* CUSTOM ROUTES */

  // We can add custom routes to the web server easily, by using
  // `config.add<Get|Post|Put|Patch>Route()`.  Note:  These are server routes only.
  config.addGetRoute('/test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
      var stateDump;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // For demo purposes, let's get a JSON dump of the current Redux state
              // to see that we can expect its contents
              stateDump = JSON.stringify(ctx.store.getState());

              // Display a simple message, along with the Redux dump.  Note that this
              // won't contain a full `apollo` response, because it hasn't passed through
              // the React handler -- but it *does* mean we can still manipulate the state
              // from within our root, or fire action handlers!

              ctx.body = 'Hello from your ReactQL route. Redux dump: ' + stateDump;

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  /* CUSTOM 404 HANDLER */

  // By default, if the server gets a route request that results in a 404,
  // it will set `ctx.status = 404` but continue to render the <NotFound>
  // block as normal.  If we want to add our own custom handler, we can use
  // `config.set404Handler()` as below.
  //
  // Note:  This only applies to SERVER routes.  On the client, the
  // <NotFound> block will *always* run.

  config.set404Handler(function (ctx) {
    // Like above, we'll grab a dump of the store state again -- this time,
    // it *will* contain a full `apollo` dump because in order to figure out that
    // a route has hit a 404, it will already have rendered the React chain
    // and retrieved any relevant GraphQL
    var stateDump = JSON.stringify(ctx.store.getState());

    // Explicitly set the return status to 404.  This is done for us by
    // default if we don't have a custom 404 handler, but left to the function
    // otherwise (since we might not always want to return a 404)
    ctx.status = 404;

    // Set the body
    ctx.body = 'This route does not exist on the server - Redux dump: ' + stateDump;
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
  config.setErrorHandler(function (e, ctx /* `next` is unused in this example */) {
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
  config.getKoaApp(function (app) {
    // First, we'll add a new `engine` key to the app.context`
    // prototype (that per-request `ctx` extends) that can be
    // used in the middleware below, to set a `Powered-By` header.
    // eslint-disable-next-line no-param-reassign
    app.context.engine = 'ReactQL';

    // We'll also add a generic error handler, that prints out to the console.
    // Note: This is a 'lower-level' than `config.setErrorHandler()` because
    // it's not middleware -- it's for errors that happen at the server level
    app.on('error', function (e) {
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
  config.addMiddleware(function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Let's add a custom header so we can see middleware in action
              ctx.set('Powered-By', ctx.engine); // <-- `ctx.engine` srt above!

              // For the fun of it, let's demonstrate that we can fire Redux actions
              // and it'll manipulate the state on the server side!  View the SSR version
              // to see that the counter is now 1 and has been passed down the wire
              ctx.store.dispatch({ type: 'INCREMENT_COUNTER' });

              // Always return `next()`, otherwise the request won't 'pass' to the next
              // middleware in the stack (likely, the React handler)
              return _context2.abrupt('return', next());

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }());
}

// In app.js, we need to export the root component we want to mount as the
// starting point to our app.  We'll just export the `<Main>` component.
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_2_src_components_main__["a" /* default */]);

/***/ }),

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = reducer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_data_js__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_seamless_immutable__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_seamless_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_seamless_immutable__);



function reducer(state, action) {
  switch (action.type) {
    case 'FIND_BY_NAME':
      if (action.name.length) {
        return state.filter(function (hotel) {
          var reg = new RegExp(action.name, "i");
          return hotel.name.match(reg);
        });
      } else {
        return __WEBPACK_IMPORTED_MODULE_0__data_data_js__["a" /* default */];
      }
    case 'SORT_BY_RAITING_ASK':
      return [].concat(__WEBPACK_IMPORTED_MODULE_1_seamless_immutable___default()(state)).sort(function (a, b) {
        return a.rating - b.rating;
      });
    case 'SORT_BY_RAITING_DESC':
      return [].concat(__WEBPACK_IMPORTED_MODULE_1_seamless_immutable___default()(state)).sort(function (a, b) {
        return b.rating - a.rating;
      });
  }
  return state;
}

/***/ }),

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_helmet__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_helmet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_helmet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kit_lib_routing__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_src_components_hotelList_js__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_src_components_filterSection_js__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hotel_scss__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hotel_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__hotel_scss__);
// IMPORTS

// React


// Routing via React Router


// <Helmet> component for setting the page title/meta tags


/* ReactQL */

// NotFound 404 handler for unknown routes





// Styles


/* harmony default export */ __webpack_exports__["a"] = (function () {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    { className: __WEBPACK_IMPORTED_MODULE_6__hotel_scss___default.a.content },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_src_components_filterSection_js__["a" /* default */], null),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_src_components_hotelList_js__["a" /* default */], null)
  );
});

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export NotFound */
/* unused harmony export Redirect */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom__ = __webpack_require__(27);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-param-reassign */

// ----------------------
// IMPORTS






// ----------------------

// <Status code="xxx"> component.  Updates the context router's context, which
// can be used by the server handler to respond to the status on the server.

var Status = function (_React$PureComponent) {
  _inherits(Status, _React$PureComponent);

  function Status() {
    _classCallCheck(this, Status);

    return _possibleConstructorReturn(this, (Status.__proto__ || Object.getPrototypeOf(Status)).apply(this, arguments));
  }

  _createClass(Status, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          code = _props.code,
          children = _props.children;

      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["c" /* Route */], { render: function render(_ref) {
          var staticContext = _ref.staticContext;

          if (staticContext) {
            staticContext.status = code;
          }
          return children;
        } });
    }
  }]);

  return Status;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent);

// <NotFound> component.  If this renders on the server in development mode,
// it will attempt to proxyify the request to the upstream `webpack-dev-server`.
// In production, it will issue a hard 404 and render.  In the browser, it will
// simply render.


Status.propTypes = {
  code: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number.isRequired,
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.node
};
Status.defaultProps = {
  children: null
};
var NotFound = function (_React$PureComponent2) {
  _inherits(NotFound, _React$PureComponent2);

  function NotFound() {
    _classCallCheck(this, NotFound);

    return _possibleConstructorReturn(this, (NotFound.__proto__ || Object.getPrototypeOf(NotFound)).apply(this, arguments));
  }

  _createClass(NotFound, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        Status,
        { code: 404 },
        children
      );
    }
  }]);

  return NotFound;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent);

// <Redirect> component. Mirrors React Router's component by the same name,
// except it sets a 301/302 status code for setting server-side HTTP headers.
NotFound.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.node
};
NotFound.defaultProps = {
  children: null
};
var Redirect = function (_React$PureComponent3) {
  _inherits(Redirect, _React$PureComponent3);

  function Redirect() {
    _classCallCheck(this, Redirect);

    return _possibleConstructorReturn(this, (Redirect.__proto__ || Object.getPrototypeOf(Redirect)).apply(this, arguments));
  }

  _createClass(Redirect, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          to = _props2.to,
          from = _props2.from,
          push = _props2.push,
          permanent = _props2.permanent;

      var code = permanent ? 301 : 302;
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        Status,
        { code: code },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["b" /* Redirect */], { to: to, from: from, push: push })
      );
    }
  }]);

  return Redirect;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent);
Redirect.propTypes = {
  to: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object]).isRequired,
  from: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  push: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  permanent: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool
};
Redirect.defaultProps = {
  from: null,
  push: false,
  permanent: false
};

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HotelList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_fontawesome__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_fontawesome___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_fontawesome__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hotel_scss__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hotel_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__hotel_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_font_awesome_css_font_awesome_css__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_font_awesome_css_font_awesome_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_font_awesome_css_font_awesome_css__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// IMPORTS

/* NPM */


// HOC/decorator to listen to Redux store state




// Styles



var HotelList = (_dec = Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__["a" /* connect */])(function (state) {
  return { hotels: state.hotels };
}), _dec(_class = function (_React$PureComponent) {
  _inherits(HotelList, _React$PureComponent);

  function HotelList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HotelList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HotelList.__proto__ || Object.getPrototypeOf(HotelList)).call.apply(_ref, [this].concat(args))), _this), _this.getRange = function (rating) {
      var starCount = [];
      for (var i = 0; i < 5; i++) {
        if (i < rating) starCount.push('star');else starCount.push('star-o');
      }
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { className: __WEBPACK_IMPORTED_MODULE_4__hotel_scss___default.a.rating },
        starCount.map(function (star, index) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_react_fontawesome___default.a, {
            key: index,
            name: star,
            cssModule: __WEBPACK_IMPORTED_MODULE_5_font_awesome_css_font_awesome_css___default.a,
            style: { color: 'yellow' }
          });
        })
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HotelList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var hotels = this.props.hotels;
      var content = "Not found";

      if (hotels.length) {
        content = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          null,
          hotels.map(function (hotel) {
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { key: hotel.uuid, className: __WEBPACK_IMPORTED_MODULE_4__hotel_scss___default.a.hotelItem },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: __WEBPACK_IMPORTED_MODULE_4__hotel_scss___default.a.hotelCover, style: { background: "url(" + __webpack_require__(210)("./" + hotel.cover) + ") center center" } },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: __WEBPACK_IMPORTED_MODULE_4__hotel_scss___default.a.hotelInfo },
                  hotel.name,
                  _this2.getRange(hotel.rating)
                )
              )
            );
          })
        );
      }
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        null,
        content
      );
    }
  }]);

  return HotelList;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent)) || _class);


/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./bellagio.jpg": 211,
	"./boston.jpg": 212,
	"./carlos.jpg": 213,
	"./poseidon.jpg": 214,
	"./safari.jpg": 215
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
webpackContext.id = 210;

/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/bellagio.5031f12efee6b1822c6e8e609e8ef313.jpg";

/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/boston.7b3e14f447a22ccf162f7b4c9f328119.jpg";

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/carlos.c89090db5b08dda24cf64436236b5c71.jpg";

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/poseidon.1d9b736953400ba2189d2c8135f635b3.jpg";

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/safari.8d28fda3b2e5cfc1f6019fcbae29f6d0.jpg";

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HotelList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_fontawesome__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_fontawesome___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_fontawesome__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_src_actions__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__hotel_scss__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__hotel_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_css__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_css__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// IMPORTS

/* NPM */


// HOC/decorator to listen to Redux store state



// Actions to add/remove event


// Styles



var HotelList = (_dec = Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__["a" /* connect */])(function (state) {
  return { hotels: state.hotels };
}), _dec(_class = function (_React$PureComponent) {
  _inherits(HotelList, _React$PureComponent);

  function HotelList(props) {
    _classCallCheck(this, HotelList);

    var _this = _possibleConstructorReturn(this, (HotelList.__proto__ || Object.getPrototypeOf(HotelList)).call(this, props));

    _this.setRef = function (ref) {
      _this.ref = ref;
    };

    _this.handleFindHotel = function () {
      _this.props.dispatch(Object(__WEBPACK_IMPORTED_MODULE_4_src_actions__["a" /* findByName */])(_this.ref.value));
      if (_this.ref.value) _this.setState({ clearBtn: true });else _this.setState({ clearBtn: false });
    };

    _this.handleClearSearch = function () {
      _this.ref.value = '';
      _this.props.dispatch(Object(__WEBPACK_IMPORTED_MODULE_4_src_actions__["a" /* findByName */])(_this.ref.value));
      _this.setState({ clearBtn: false });
    };

    _this.handleSortByRaitingASK = function () {
      _this.props.dispatch(Object(__WEBPACK_IMPORTED_MODULE_4_src_actions__["b" /* sortByRaitingASK */])());
      _this.setState({ sortByRaiting: 'DESK' });
    };

    _this.handleSortByRaitingDESC = function () {
      _this.props.dispatch(Object(__WEBPACK_IMPORTED_MODULE_4_src_actions__["c" /* sortByRaitingDESC */])());
      _this.setState({ sortByRaiting: 'ASK' });
    };

    _this.state = {
      clearBtn: false,
      sortByRaiting: 'ASK'
    };
    return _this;
  }

  _createClass(HotelList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var hotels = this.props.hotels;

      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.filterSection },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.searchSection },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { ref: this.setRef, type: 'text', onChange: function onChange() {
              return _this2.handleFindHotel();
            }, placeholder: 'Search...' }),
          this.state.clearBtn && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.searchBtn, onClick: this.handleClearSearch },
            'Clear'
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.sortSection },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.btn, onClick: function onClick() {
                _this2.state.sortByRaiting == 'ASK' ? _this2.handleSortByRaitingASK() : _this2.handleSortByRaitingDESC();
              } },
            'Sort by ',
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'b',
              null,
              'rating'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_react_fontawesome___default.a, {
              name: 'sort',
              cssModule: __WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_css___default.a,
              className: __WEBPACK_IMPORTED_MODULE_5__hotel_scss___default.a.sortIcon
            })
          )
        )
      );
    }
  }]);

  return HotelList;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent)) || _class);


/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = findByName;
/* harmony export (immutable) */ __webpack_exports__["b"] = sortByRaitingASK;
/* harmony export (immutable) */ __webpack_exports__["c"] = sortByRaitingDESC;
function findByName(name) {
  return {
    type: 'FIND_BY_NAME',
    name: name
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

/***/ 218:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createClient */
/* unused harmony export getNetworkInterface */
/* harmony export (immutable) */ __webpack_exports__["a"] = browserClient;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react_apollo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kit_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kit_lib_env__ = __webpack_require__(220);
// ----------------------
// IMPORTS

/* NPM */

// Apollo client library


/* ReactQL */

// Configuration


// Get environment, to figure out where we're running the GraphQL server


// ----------------------

// Helper function to create a new Apollo client, by merging in
// passed options alongside any set by `config.setApolloOptions` and defaults
function createClient() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new __WEBPACK_IMPORTED_MODULE_0_react_apollo__["ApolloClient"](Object.assign({
    reduxRootSelector: function reduxRootSelector(state) {
      return state.apollo;
    }
  }, __WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].apolloClientOptions, opt));
}

// Wrap `createNetworkInterface` to attach middleware
function getNetworkInterface(uri) {
  var networkInterface = Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__["createNetworkInterface"])({
    uri: uri,
    opts: __WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].apolloNetworkOptions
  });

  // Attach middleware
  networkInterface.use(__WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].apolloMiddleware.map(function (f) {
    return { applyMiddleware: f };
  }));
  networkInterface.useAfter(__WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].apolloAfterware.map(function (f) {
    return { applyAfterware: f };
  }));

  return networkInterface;
}

// Creates a new browser client
function browserClient() {
  // If we have an internal GraphQL server, we need to append it with a
  // call to `getServerURL()` to add the correct host (in dev + production)
  var uri = __WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].graphQLServer ? '' + Object(__WEBPACK_IMPORTED_MODULE_2_kit_lib_env__["a" /* getServerURL */])() + __WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].graphQLEndpoint : __WEBPACK_IMPORTED_MODULE_1_kit_config__["a" /* default */].graphQLEndpoint;

  return createClient({
    networkInterface: getNetworkInterface(uri)
  });
}

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getServerURL;
/* eslint-disable import/prefer-default-export */

// Environment-aware functions

// Get the protocol://host:port of where the current server would bind
function getServerURL() {
  var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "localhost";
  var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "8081";
  var allowSSL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  // Check for SSL
  if (allowSSL && null) {
    var _stub = 'https://' + (host || "localhost");

    // If we're on port 443, that's 'regular' SSL so no need to specify port
    if (null === '443') return _stub;
    return _stub + ':' + null;
  }

  // Plain HTTP
  var stub = 'http://' + (host || "localhost");

  // If we're on port 80, that's 'regular' HTTP so no need to specify port
  if (port === '80') return stub;
  return stub + ':' + port;
}

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createNewStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_seamless_immutable__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_seamless_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_seamless_immutable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kit_config__ = __webpack_require__(44);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-underscore-dangle */

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


// ----------------------

// Detect if we're both in the browser, AND we have dehydrated state
var hasState = !!(!false && window.__STATE__);

// Helper function that 'unwinds' the `config.reducers` Map, and provides
// the `reducer` function or `initialState` (wrapped in `seamless-immutable`)
// depending on what we asked for
function unwind() {
  var reducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  // Unwind `config.reducers`.  If we're looking for the `reducer`, we'll
  // wrap this in a `defaultReducer` function that properly handles the Redux
  // 'undefined' sentinel value, or calls 'real' reducer if it's not undefined.
  //
  // If we're not looking for reducers, it'll pull out the `initialState`
  // variable instead, which we'll further process below
  var r = Object.assign.apply(Object, [{}].concat(_toConsumableArray([].concat([].concat(_toConsumableArray(__WEBPACK_IMPORTED_MODULE_3_kit_config__["a" /* default */].reducers)).map(function (arr) {
    return _defineProperty({}, arr[0], reducer ? function defaultReducer(state, action) {
      // If `state` === undefined, this is Redux sending a sentinel value
      // to check our set-up.  So we'll send back a plain object to prove
      // that we're properly handling our reducer
      if (typeof state === 'undefined') return {};

      // Otherwise, call our real reducer with the {state, action}
      return arr[1].reducer(state, action);
    } : arr[1].initialState);
  })))));

  // If this is a reducer, return at this point
  if (reducer) return r;

  // If not, we're looking for the state -- so let's map it and wrap the
  // object in `seamless-immutable`, to avoid side-effects with Redux
  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(Object.keys(r).map(function (key) {
    return _defineProperty({}, key, __WEBPACK_IMPORTED_MODULE_2_seamless_immutable___default()(hasState && window.__STATE__[key] || r[key]));
  }))));
}

function createNewStore(apolloClient) {
  var store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(
  // By default, we'll use just the apollo reducer.  We can easily add our
  // own here, for global store management outside of Apollo
  Object(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])(_extends({
    apollo: apolloClient.reducer()
  }, unwind())),
  // Initial server state, provided by the server.
  _extends({
    apollo: hasState && window.__STATE__.apollo || {}
  }, unwind(false)), Object(__WEBPACK_IMPORTED_MODULE_0_redux__["compose"])(Object(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(apolloClient.middleware(), __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a),
  // Enable Redux Devtools on the browser, for easy state debugging
  // eslint-disable-next-line no-underscore-dangle
  !false && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (f) {
    return f;
  }));

  return store;
}

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Simple class to act as a singleton for app-wide configuration.

// We'll start with a common config that can be extended separately by the
// server/client, to provide environment-specific functionality
var Common = function () {
  function Common() {
    _classCallCheck(this, Common);

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


  _createClass(Common, [{
    key: 'addReducer',
    value: function addReducer(key, reducer) {
      var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof reducer !== 'function') {
        throw new Error('Can\'t add reducer for \'' + key + '\' - reducer must be a function');
      }
      this.reducers.set(key, {
        reducer: reducer,
        initialState: initialState
      });
    }

    /* GRAPHQL */

    // Enables internal GraphQL server.  Default GraphQL and GraphiQL endpoints
    // can be overridden

  }, {
    key: 'enableGraphQLServer',
    value: function enableGraphQLServer() {
      var endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/graphql';
      var graphiQL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.graphQLServer = true;
      this.graphQLEndpoint = endpoint;
      this.graphiQL = graphiQL;
    }

    // Set an external GraphQL URI for use with Apollo

  }, {
    key: 'setGraphQLEndpoint',
    value: function setGraphQLEndpoint(uri) {
      var graphiQL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.graphQLEndpoint = uri;
      this.graphiQL = graphiQL;
    }

    // Register Apollo middleware function

  }, {
    key: 'addApolloMiddleware',
    value: function addApolloMiddleware(middlewareFunc) {
      this.apolloMiddleware.push(middlewareFunc);
    }

    // Register Apollo afterware function

  }, {
    key: 'addApolloAfterware',
    value: function addApolloAfterware(afterwareFunc) {
      this.apolloAfterware.push(afterwareFunc);
    }

    // Apollo Client options.  These will be merged in with the `createClient`
    // default options defined in `kit/lib/apollo.js`

  }, {
    key: 'setApolloClientOptions',
    value: function setApolloClientOptions() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.apolloClientOptions = opt;
    }

    // Apollo Network options.  These will be merged in with the `createNetworkInterface`
    // default options defined in `kit/lib/apollo.js`

  }, {
    key: 'setApolloNetworkOptions',
    value: function setApolloNetworkOptions() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.apolloNetworkOptions = opt;
    }
  }]);

  return Common;
}();

// Placeholder for the class we'll attach


var Config = void 0;

// Server Config extensions.  This is wrapped in a `SERVER` block to avoid
// adding unnecessary functionality to the client bundle.  Every byte counts!
if (false) {
  Config = function (_Common) {
    _inherits(ServerConfig, _Common);

    function ServerConfig() {
      _classCallCheck(this, ServerConfig);

      // Create a set for routes -- to retrieve based on insertion order
      var _this = _possibleConstructorReturn(this, (ServerConfig.__proto__ || Object.getPrototypeOf(ServerConfig)).call(this));

      _this.routes = new Set();

      // Koa application function. But default, this is null
      _this.koaAppFunc = null;

      // Flag for setting whether plain HTTP should be disabled
      _this.enableHTTP = true;

      // Force SSL. Rewrites all non-SSL queries to SSL.  False, by default.
      _this.enableForceSSL = false;

      // Options for enabling SSL. By default, this is null. If SSL is enabled
      // in userland, this would instead hold an object of options
      _this.sslOptions = null;

      // Custom middleware -- again, based on insertion order
      _this.middleware = new Set();

      // GraphQL schema (if we're using an internal server)
      _this.graphQLSchema = null;

      // Attach a GraphiQL IDE endpoint to our server?  By default - no.  If
      // this === true, this will default to `/graphql`.  If it's a string, it'll
      // default to the string value
      _this.graphiQL = false;

      // Enable body parsing by default.  Leave `koa-bodyparser` opts as default
      _this.enableBodyParser = true;
      _this.bodyParserOptions = {};

      // CORS options for `koa-cors`
      _this.corsOptions = {};
      return _this;
    }

    /* WEB SERVER / SSR */

    // Get access to Koa's `app` instance, for adding custom instantiation
    // or doing something that's not covered by other functions


    _createClass(ServerConfig, [{
      key: 'getKoaApp',
      value: function getKoaApp(func) {
        this.koaAppFunc = func;
      }

      // Enable SSL. Normally, you'd use an upstream proxy like Nginx to handle
      // SSL. But if you want to run a 'bare' Koa HTTPS web server, you can pass
      // in the certificate details here and it'll respond to SSL requests

    }, {
      key: 'enableSSL',
      value: function enableSSL(opt) {
        // At a minimum, we should have `key` and `cert` -- check for those
        if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) !== 'object' || !opt.key || !opt.cert) {
          throw new Error('Cannot enable SSL. Missing `key` and/or `cert`');
        }
        this.sslOptions = opt;
      }

      // Force SSL. Rewrites all non-SSL queries to SSL. Any options here are
      // passed to `koa-sslify`, the SSL enforcement middleware

    }, {
      key: 'forceSSL',
      value: function forceSSL() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.enableForceSSL = opt;
      }

      // Disable plain HTTP.  Note this should only be used if you've also set
      // `enableSSL()` and you don't want dual-HTTP+SSL config

    }, {
      key: 'disableHTTP',
      value: function disableHTTP() {
        this.enableHTTP = false;
      }

      // Disable the optional `koa-bodyparser`, to prevent POST data being sent to
      // each request.  By default, body parsing is enabled.

    }, {
      key: 'disableBodyParser',
      value: function disableBodyParser() {
        this.enableBodyParser = false;
      }
    }, {
      key: 'setBodyParserOptions',
      value: function setBodyParserOptions() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.bodyParserOptions = opt;
      }

      // 404 handler for the server.  By default, `kit/entry/server.js` will
      // simply return a 404 status code without modifying the HTML render.  By
      // setting a handler here, this will be returned instead

    }, {
      key: 'set404Handler',
      value: function set404Handler(func) {
        if (typeof func !== 'function') {
          throw new Error('404 handler must be a function');
        }
        this.handler404 = func;
      }

      // Error handler.  If this isn't defined, the server will simply return a
      // 'There was an error. Please try again later.' message, and log the output
      // to the console.  Override that behaviour by passing a (e, ctx, next) -> {} func

    }, {
      key: 'setErrorHandler',
      value: function setErrorHandler(func) {
        if (typeof func !== 'function') {
          throw new Error('Error handler must be a function');
        }
        this.errorHandler = func;
      }

      // Add custom middleware.  This should be an async func, for use with Koa

    }, {
      key: 'addMiddleware',
      value: function addMiddleware(middlewareFunc) {
        this.middleware.add(middlewareFunc);
      }

      // Adds a custom server route to attach to our Koa router

    }, {
      key: 'addRoute',
      value: function addRoute(method, route) {
        for (var _len = arguments.length, handlers = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          handlers[_key - 2] = arguments[_key];
        }

        this.routes.add({
          method: method,
          route: route,
          handlers: handlers
        });
      }

      // Adds custom GET route

    }, {
      key: 'addGetRoute',
      value: function addGetRoute(route) {
        for (var _len2 = arguments.length, handlers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          handlers[_key2 - 1] = arguments[_key2];
        }

        this.addRoute.apply(this, ['get', route].concat(handlers));
      }

      // Adds custom POST route

    }, {
      key: 'addPostRoute',
      value: function addPostRoute(route) {
        for (var _len3 = arguments.length, handlers = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          handlers[_key3 - 1] = arguments[_key3];
        }

        this.addRoute.apply(this, ['post', route].concat(handlers));
      }

      // Adds custom PUT route

    }, {
      key: 'addPutRoute',
      value: function addPutRoute(route) {
        for (var _len4 = arguments.length, handlers = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          handlers[_key4 - 1] = arguments[_key4];
        }

        this.addRoute.apply(this, ['put', route].concat(handlers));
      }

      // Adds custom PATCH route

    }, {
      key: 'addPatchRoute',
      value: function addPatchRoute(route) {
        for (var _len5 = arguments.length, handlers = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          handlers[_key5 - 1] = arguments[_key5];
        }

        this.addRoute.apply(this, ['patch', route].concat(handlers));
      }

      // Adds custom DELETE route

    }, {
      key: 'addDeleteRoute',
      value: function addDeleteRoute(route) {
        for (var _len6 = arguments.length, handlers = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          handlers[_key6 - 1] = arguments[_key6];
        }

        this.addRoute.apply(this, ['delete', route].concat(handlers));
      }

      // Set the GraphQL schema. This should only be called on the server, otherwise
      // the bundle size passed by the `schema` object will be unnecessarily inflated

    }, {
      key: 'setGraphQLSchema',
      value: function setGraphQLSchema(schema) {
        this.graphQLSchema = schema;
      }

      // CORS options, for `koa-cors` instantiation

    }, {
      key: 'setCORSOptions',
      value: function setCORSOptions() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.corsOptions = opt;
      }
    }]);

    return ServerConfig;
  }(Common);
} else {
  // For the client config, we'll extend `Common` by default -- but if we need
  // anything unique to the browser in the future, we'd add it here...
  Config = function (_Common2) {
    _inherits(ClientConfig, _Common2);

    function ClientConfig() {
      _classCallCheck(this, ClientConfig);

      return _possibleConstructorReturn(this, (ClientConfig.__proto__ || Object.getPrototypeOf(ClientConfig)).apply(this, arguments));
    }

    return ClientConfig;
  }(Common);
}

// Since there's only one `Config` instance globally, we'll create the new
// instance here and export it.  This will then provide any subsequent imports
// with the same object, so we can add settings to a common config
/* harmony default export */ __webpack_exports__["a"] = (new Config());

/***/ }),

/***/ 46:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"content":"content-2VPQHqsWcFYcoqtr8QBr8w","hotelItem":"hotelItem-lZdK4RxhVnOEBqBfuo_tP","hotelCover":"hotelCover-qbk-HzIUm6N5vIRKyKF4B","hotelInfo":"hotelInfo-GXmYR35-sK5PLVOGOubRf","searchSection":"searchSection-2KdqQgriloRir7SOHml9Tu","sortSection":"sortSection-1fvoLMuBRknThGxO6zIq6E","filterSection":"filterSection-1P7aaQtCE2-zAsYWNsD0XD","btn":"btn-3X7vTkeBV0ClrGHNzNYLgD","searchBtn":"searchBtn-2-FFXfU8UbxsfPSBdUzQtx","sortIcon":"sortIcon-fhjBdQYCvqSSig-kwpoBe"};

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var uuid = __webpack_require__(186);

/* harmony default export */ __webpack_exports__["a"] = ([{
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
}]);

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(92);


/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_router_dom__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_apollo__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_apollo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_apollo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_src_app__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_kit_lib_apollo__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_kit_lib_redux__ = __webpack_require__(221);
// Browser entry point, for Webpack.  We'll grab the browser-flavoured
// versions of React mounting, routing etc to hook into the DOM

// ----------------------
// IMPORTS

/* NPM */

// Enable async/await and generators, cross-browser


// Patch global.`fetch` so that Apollo calls to GraphQL work


// React parts



// Browser routing


// Apollo Provider. This HOC will 'wrap' our React component chain
// and handle injecting data down to any listening component


/* ReactQL */

// Root component.  This is our 'entrypoint' into the app.  If you're using
// the ReactQL starter kit for the first time, `src/app.js` is where
// you can start editing to add your own code.  Note:  This first is imported
// first, since it sets up our app's settings


// Grab the shared Apollo Client


// Custom redux store creator.  This will allow us to create a store 'outside'
// of Apollo, so we can apply our own reducers and make use of the Redux dev
// tools in the browser


// ----------------------

// Create a new browser Apollo client
var client = Object(__WEBPACK_IMPORTED_MODULE_7_kit_lib_apollo__["a" /* browserClient */])();

// Create a new Redux store
var store = Object(__WEBPACK_IMPORTED_MODULE_8_kit_lib_redux__["a" /* default */])(client);

// Create the 'root' entry point into the app.  If we have React hot loading
// (i.e. if we're in development), then we'll wrap the whole thing in an
// <AppContainer>.  Otherwise, we'll jump straight to the browser router
function doRender() {
  __WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.hydrate(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Root, null), document.getElementById('main'));
}

// The <Root> component.  We'll run this as a self-contained function since
// we're using a bunch of temporary vars that we can safely discard.
//
// If we have hot reloading enabled (i.e. if we're in development), then
// we'll wrap the whole thing in <AppContainer> so that our views can respond
// to code changes as needed
var Root = function () {
  // Wrap the component hierarchy in <BrowserRouter>, so that our children
  // can respond to route changes
  var Chain = function Chain() {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_5_react_apollo__["ApolloProvider"],
      { store: store, client: client },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_4_react_router_dom__["a" /* BrowserRouter */],
        null,
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_src_app__["a" /* default */], null)
      )
    );
  };

  // React hot reloading -- only enabled in development.  This branch will
  // be shook from production, so we can run a `require` statement here
  // without fear that it'll inflate the bundle size
  if (false) {
    // <AppContainer> will respond to our Hot Module Reload (HMR) changes
    // back from WebPack, and handle re-rendering the chain as needed
    var AppContainer = require('react-hot-loader').AppContainer;

    // Start our 'listener' at the root component, so that any changes that
    // occur in the hierarchy can be captured
    module.hot.accept('src/app', function () {
      // Refresh the entry point of our app, to get the changes.

      // eslint-disable-next-line
      require('src/app').default;

      // Re-render the hierarchy
      doRender();
    });

    return function () {
      return React.createElement(
        AppContainer,
        null,
        React.createElement(Chain, null)
      );
    };
  }
  return Chain;
}();

doRender();

/***/ })

},[91]);
//# sourceMappingURL=browser.js.map

/*!*************************************************************************
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. 
 **************************************************************************/

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = requireMs();
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

/* eslint-env browser */

(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 */

	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;

		return () => {
			if (!warned) {
				warned = true;
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}
		};
	})();

	/**
	 * Colors.
	 */

	exports.colors = [
		'#0000CC',
		'#0000FF',
		'#0033CC',
		'#0033FF',
		'#0066CC',
		'#0066FF',
		'#0099CC',
		'#0099FF',
		'#00CC00',
		'#00CC33',
		'#00CC66',
		'#00CC99',
		'#00CCCC',
		'#00CCFF',
		'#3300CC',
		'#3300FF',
		'#3333CC',
		'#3333FF',
		'#3366CC',
		'#3366FF',
		'#3399CC',
		'#3399FF',
		'#33CC00',
		'#33CC33',
		'#33CC66',
		'#33CC99',
		'#33CCCC',
		'#33CCFF',
		'#6600CC',
		'#6600FF',
		'#6633CC',
		'#6633FF',
		'#66CC00',
		'#66CC33',
		'#9900CC',
		'#9900FF',
		'#9933CC',
		'#9933FF',
		'#99CC00',
		'#99CC33',
		'#CC0000',
		'#CC0033',
		'#CC0066',
		'#CC0099',
		'#CC00CC',
		'#CC00FF',
		'#CC3300',
		'#CC3333',
		'#CC3366',
		'#CC3399',
		'#CC33CC',
		'#CC33FF',
		'#CC6600',
		'#CC6633',
		'#CC9900',
		'#CC9933',
		'#CCCC00',
		'#CCCC33',
		'#FF0000',
		'#FF0033',
		'#FF0066',
		'#FF0099',
		'#FF00CC',
		'#FF00FF',
		'#FF3300',
		'#FF3333',
		'#FF3366',
		'#FF3399',
		'#FF33CC',
		'#FF33FF',
		'#FF6600',
		'#FF6633',
		'#FF9900',
		'#FF9933',
		'#FFCC00',
		'#FFCC33'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	// eslint-disable-next-line complexity
	function useColors() {
		// NB: In an Electron preload script, document will be defined but not fully
		// initialized. Since we know we're in Chrome, we'll just detect this case
		// explicitly
		if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
			return true;
		}

		// Internet Explorer and Edge do not support colors.
		if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
			return false;
		}

		// Is webkit? http://stackoverflow.com/a/16459606/376773
		// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
		return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
			// Is firebug? http://stackoverflow.com/a/398120/376773
			(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
			// Is firefox >= v31?
			// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
			// Double check webkit in userAgent just in case we are in a worker
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
		args[0] = (this.useColors ? '%c' : '') +
			this.namespace +
			(this.useColors ? ' %c' : ' ') +
			args[0] +
			(this.useColors ? '%c ' : ' ') +
			'+' + module.exports.humanize(this.diff);

		if (!this.useColors) {
			return;
		}

		const c = 'color: ' + this.color;
		args.splice(1, 0, c, 'color: inherit');

		// The final "%c" is somewhat tricky, because there could be other
		// arguments passed either before or after the %c, so we need to
		// figure out the correct index to insert the CSS into
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, match => {
			if (match === '%%') {
				return;
			}
			index++;
			if (match === '%c') {
				// We only are interested in the *last* %c
				// (the user may have provided their own)
				lastC = index;
			}
		});

		args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.debug()` when available.
	 * No-op when `console.debug` is not a "function".
	 * If `console.debug` is not available, falls back
	 * to `console.log`.
	 *
	 * @api public
	 */
	exports.log = console.debug || console.log || (() => {});

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	function save(namespaces) {
		try {
			if (namespaces) {
				exports.storage.setItem('debug', namespaces);
			} else {
				exports.storage.removeItem('debug');
			}
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	function load() {
		let r;
		try {
			r = exports.storage.getItem('debug');
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}

		// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
		if (!r && typeof process !== 'undefined' && 'env' in process) {
			r = process.env.DEBUG;
		}

		return r;
	}

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
		try {
			// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
			// The Browser also has localStorage in the global context.
			return localStorage;
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	module.exports = common(exports);

	const {formatters} = module.exports;

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	formatters.j = function (v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return '[UnexpectedJSONParseError]: ' + error.message;
		}
	};
} (browser, browser.exports));

var debug = browser.exports;

var makeError = {exports: {}};

(function (module, exports) {

	// ===================================================================

	var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined;
	var defineProperty = Object.defineProperty;

	// -------------------------------------------------------------------

	var captureStackTrace = Error.captureStackTrace;
	if (captureStackTrace === undefined) {
	  captureStackTrace = function captureStackTrace(error) {
	    var container = new Error();

	    defineProperty(error, "stack", {
	      configurable: true,
	      get: function getStack() {
	        var stack = container.stack;

	        // Replace property with value for faster future accesses.
	        defineProperty(this, "stack", {
	          configurable: true,
	          value: stack,
	          writable: true,
	        });

	        return stack;
	      },
	      set: function setStack(stack) {
	        defineProperty(error, "stack", {
	          configurable: true,
	          value: stack,
	          writable: true,
	        });
	      },
	    });
	  };
	}

	// -------------------------------------------------------------------

	function BaseError(message) {
	  if (message !== undefined) {
	    defineProperty(this, "message", {
	      configurable: true,
	      value: message,
	      writable: true,
	    });
	  }

	  var cname = this.constructor.name;
	  if (cname !== undefined && cname !== this.name) {
	    defineProperty(this, "name", {
	      configurable: true,
	      value: cname,
	      writable: true,
	    });
	  }

	  captureStackTrace(this, this.constructor);
	}

	BaseError.prototype = Object.create(Error.prototype, {
	  // See: https://github.com/JsCommunity/make-error/issues/4
	  constructor: {
	    configurable: true,
	    value: BaseError,
	    writable: true,
	  },
	});

	// -------------------------------------------------------------------

	// Sets the name of a function if possible (depends of the JS engine).
	var setFunctionName = (function() {
	  function setFunctionName(fn, name) {
	    return defineProperty(fn, "name", {
	      configurable: true,
	      value: name,
	    });
	  }
	  try {
	    var f = function() {};
	    setFunctionName(f, "foo");
	    if (f.name === "foo") {
	      return setFunctionName;
	    }
	  } catch (_) {}
	})();

	// -------------------------------------------------------------------

	function makeError(constructor, super_) {
	  if (super_ == null || super_ === Error) {
	    super_ = BaseError;
	  } else if (typeof super_ !== "function") {
	    throw new TypeError("super_ should be a function");
	  }

	  var name;
	  if (typeof constructor === "string") {
	    name = constructor;
	    constructor =
	      construct !== undefined
	        ? function() {
	            return construct(super_, arguments, this.constructor);
	          }
	        : function() {
	            super_.apply(this, arguments);
	          };

	    // If the name can be set, do it once and for all.
	    if (setFunctionName !== undefined) {
	      setFunctionName(constructor, name);
	      name = undefined;
	    }
	  } else if (typeof constructor !== "function") {
	    throw new TypeError("constructor should be either a string or a function");
	  }

	  // Also register the super constructor also as `constructor.super_` just
	  // like Node's `util.inherits()`.
	  //
	  // eslint-disable-next-line dot-notation
	  constructor.super_ = constructor["super"] = super_;

	  var properties = {
	    constructor: {
	      configurable: true,
	      value: constructor,
	      writable: true,
	    },
	  };

	  // If the name could not be set on the constructor, set it on the
	  // prototype.
	  if (name !== undefined) {
	    properties.name = {
	      configurable: true,
	      value: name,
	      writable: true,
	    };
	  }
	  constructor.prototype = Object.create(super_.prototype, properties);

	  return constructor;
	}
	exports = module.exports = makeError;
	exports.BaseError = BaseError;
} (makeError, makeError.exports));

/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
class IncompatibleBrowserError extends makeError.exports.BaseError {
    constructor() {
        super("The browser you are using isn't compatible with this application, or HTTPS is not being used on a non-localhost domain.");
    }
}
class InvalidWorkerSourceError extends makeError.exports.BaseError {
    constructor(url, res, err) {
        super(`Could not fetch web worker from ${url}`);
        this.url = url;
        this.response = res;
        this.originalError = err ?? null;
    }
}
class InvalidInputError extends makeError.exports.BaseError {
    constructor() {
        super(`Invalid input passed`);
    }
}
class InvalidMimeTypeError extends makeError.exports.BaseError {
    constructor(mimeType) {
        super(`Invalid mime type found on asset`);
        this.mimeType = mimeType;
    }
}
class UrlFetchError extends makeError.exports.BaseError {
    constructor(url, res, err) {
        super(`Could not fetch resource from ${url}`);
        this.url = url;
        this.response = res;
        this.originalError = err ?? null;
    }
}

/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const WINDOW_FEATURES = [
    'ArrayBuffer',
    'File',
    'FileReader',
    'SubtleCrypto',
    'Uint8Array',
    'WebAssembly',
    'fetch',
];
/**
 * Checks if the current browser is compatible with the features needed for
 * this library.
 *
 * @return {boolean}
 */
function isCompatible() {
    return WINDOW_FEATURES.every((x) => x in self);
}
/**
 * Throws an error if the current browser is incompatible with this library.
 */
function ensureCompatibility() {
    if (!isCompatible()) {
        throw new IncompatibleBrowserError();
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  var buf = null;
  var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  if (filepath && isNode) {
    var fs = require("fs");
    var path = require("path");

    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, filepath), (error, buffer) => {
        if (error != null) {
          reject(error);
        }

        resolve(_instantiateOrCompile(buffer, imports, false));
      });
    });
  } else if (filepath) {
    return _instantiateOrCompile(fetch(filepath), imports, true)
  }

  if (isNode) {
    buf = Buffer.from(src, 'base64');
  } else {
    var raw = globalThis.atob(src);
    var rawLength = raw.length;
    buf = new Uint8Array(new ArrayBuffer(rawLength));
    for(var i = 0; i < rawLength; i++) {
       buf[i] = raw.charCodeAt(i);
    }
  }

  if(sync) {
    var mod = new WebAssembly.Module(buf);
    return imports ? new WebAssembly.Instance(mod, imports) : mod
  } else {
    return _instantiateOrCompile(buf, imports, false)
  }
}

function detectorWasm(imports){return _loadWasmModule(0, null, 'AGFzbQEAAAAB3QEhYAJ/fwF/YAN/f38Bf2ACf38AYAN/f38AYAF/AGABfwF/YAFvAX9gBX9/f39/AGAAAGAEf39/fwBgAn9vAGABfwF+YAZ/f39/f38AYAABf2AFf39/f38Bf2ACf38Bb2AAAW9gAW8Bb2AEf39/fwF/YAZ/f39/f38Bf2ACb38Bb2ADb29/AGACb28Bf2AJf39/f39/fn5+AGAHf39/f39/fwF/YAN+f38Bf2ACf38BfmAFf399f38AYAR/fX9/AGAFf398f38AYAR/fH9/AGAFf39+f38AYAR/fn9/AAKNBhcDd2JnHl9fd2JnX2lzQXJyYXlfMjdjNDZjNjdmNDk4ZTE1ZAAGA3diZx1fX3diZ19sZW5ndGhfNmUzYmJlN2M4YmQ0ZGJkOAAGA3diZxpfX3diZ19nZXRfNTcyNDVjYzdkN2M3NjE5ZAAUA3diZyRfX3diZ19pc1NhZmVJbnRlZ2VyX2RmYTA1OTNlOGQ3YWMzNWEABgN3YmcVX193YmluZGdlbl9zdHJpbmdfbmV3AA8Dd2JnGl9fd2JnX25ld19hYmRhNzZlODgzYmE4YTVmABADd2JnHF9fd2JnX3N0YWNrXzY1ODI3OWZlNDQ1NDFjZjYACgN3YmccX193YmdfZXJyb3JfZjg1MTY2N2FmNzFiY2ZjNgACA3diZx1fX3diZ19sZW5ndGhfOWUxYWUxOTAwY2IwZmJkNQAGA3diZxFfX3diaW5kZ2VuX21lbW9yeQAQA3diZx1fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NAARA3diZxpfX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YQARA3diZxpfX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OQAVA3diZyxfX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMwAGA3diZy1fX3diZ19pbnN0YW5jZW9mX0FycmF5QnVmZmVyX2U1ZTQ4ZjQ3NjJjNTYxMGIABgN3YmcZX193YmluZGdlbl9qc3ZhbF9sb29zZV9lcQAWA3diZxZfX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0AAYDd2JnFV9fd2JpbmRnZW5fc3RyaW5nX2dldAAKA3diZxVfX3diaW5kZ2VuX251bWJlcl9nZXQACgN3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JAACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAALQAAQQFrDhEBAgMEBQYHCAkKCwwNDg8QEQALIAIgAC0AAToACCACQSRqQQI2AgAgAkEsakEBNgIAIAJB/LTAADYCICACQQA2AhggAkEENgIUIAFBBGooAgAhACACIAJBEGo2AiggAiACQQhqNgIQIAEoAgAgACACQRhqEFAMEQsgAiAAKQMINwMIIAJBJGpBAjYCACACQSxqQQE2AgAgAkHgtMAANgIgIAJBADYCGCACQQU2AhQgAUEEaigCACEAIAIgAkEQajYCKCACIAJBCGo2AhAgASgCACAAIAJBGGoQUAwQCyACIAApAwg3AwggAkEkakECNgIAIAJBLGpBATYCACACQeC0wAA2AiAgAkEANgIYIAJBBjYCFCABQQRqKAIAIQAgAiACQRBqNgIoIAIgAkEIajYCECABKAIAIAAgAkEYahBQDA8LIAIgACsDCDkDCCACQSRqQQI2AgAgAkEsakEBNgIAIAJBxLTAADYCICACQQA2AhggAkEHNgIUIAFBBGooAgAhACACIAJBEGo2AiggAiACQQhqNgIQIAEoAgAgACACQRhqEFAMDgsgAiAAKAIENgIIIAJBJGpBAjYCACACQSxqQQE2AgAgAkGktMAANgIgIAJBADYCGCACQQg2AhQgAUEEaigCACEAIAIgAkEQajYCKCACIAJBCGo2AhAgASgCACAAIAJBGGoQUAwNCyACIAApAgQ3AwggAkEkakEBNgIAIAJBLGpBATYCACACQZC0wAA2AiAgAkEANgIYIAJBCTYCFCABQQRqKAIAIQAgAiACQRBqNgIoIAIgAkEIajYCECABKAIAIAAgAkEYahBQDAwLIAJBJGpBATYCACACQSxqQQA2AgAgAkGAtMAANgIgIAJBuLfAADYCKCACQQA2AhggASgCACABQQRqKAIAIAJBGGoQUAwLCyACQSRqQQE2AgAgAkEsakEANgIAIAJB+LPAADYCICACQbi3wAA2AiggAkEANgIYIAEoAgAgAUEEaigCACACQRhqEFAMCgsgAkEkakEBNgIAIAJBLGpBADYCACACQeSzwAA2AiAgAkG4t8AANgIoIAJBADYCGCABKAIAIAFBBGooAgAgAkEYahBQDAkLIAJBJGpBATYCACACQSxqQQA2AgAgAkHQs8AANgIgIAJBuLfAADYCKCACQQA2AhggASgCACABQQRqKAIAIAJBGGoQUAwICyACQSRqQQE2AgAgAkEsakEANgIAIAJBuLPAADYCICACQbi3wAA2AiggAkEANgIYIAEoAgAgAUEEaigCACACQRhqEFAMBwsgAkEkakEBNgIAIAJBLGpBADYCACACQaizwAA2AiAgAkG4t8AANgIoIAJBADYCGCABKAIAIAFBBGooAgAgAkEYahBQDAYLIAJBJGpBATYCACACQSxqQQA2AgAgAkGcs8AANgIgIAJBuLfAADYCKCACQQA2AhggASgCACABQQRqKAIAIAJBGGoQUAwFCyACQSRqQQE2AgAgAkEsakEANgIAIAJBkLPAADYCICACQbi3wAA2AiggAkEANgIYIAEoAgAgAUEEaigCACACQRhqEFAMBAsgAkEkakEBNgIAIAJBLGpBADYCACACQfyywAA2AiAgAkG4t8AANgIoIAJBADYCGCABKAIAIAFBBGooAgAgAkEYahBQDAMLIAJBJGpBATYCACACQSxqQQA2AgAgAkHkssAANgIgIAJBuLfAADYCKCACQQA2AhggASgCACABQQRqKAIAIAJBGGoQUAwCCyACQSRqQQE2AgAgAkEsakEANgIAIAJBzLLAADYCICACQbi3wAA2AiggAkEANgIYIAEoAgAgAUEEaigCACACQRhqEFAMAQsgASgCACAAKAIEIABBCGooAgAgASgCBCgCDBEBAAsgAkEwaiQAC5kIAQd/AkAgAUH/CU0EQCABQQV2IQUCQAJAAkAgACgCoAEiBARAIARBAWshAyAEQQJ0IABqQQRrIQIgBCAFakECdCAAakEEayEGIARBKEshBANAIAQNBCADIAVqIgdBKE8NAiAGIAIoAgA2AgAgBkEEayEGIAJBBGshAiADQQFrIgNBf0cNAAsLIAFBIEkNBCAAQQA2AgAgAUHAAE8NAQwECyAHQShB6KnAABBHAAsgAEEANgIEQQEgBSAFQQFNGyICQQJGDQIgAEEANgIIIAJBA0YNAiAAQQA2AgwgAkEERg0CIABBADYCECACQQVGDQIgAEEANgIUIAJBBkYNAiAAQQA2AhggAkEHRg0CIABBADYCHCACQQhGDQIgAEEANgIgIAJBCUYNAiAAQQA2AiQgAkEKRg0CIABBADYC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ACACNgIsIABBDDYCNCAAIABBLGo2AjAgAEEBNgJcIABBAjYCVCAAQZSVwAA2AlAgAEEANgJIIAAgAEEwajYCWCAAQSBqQfiBwAAgAEHIAGoQIw0BCyABKAIMIQEgAEHEAGpBDTYCACAAQTxqQQ02AgAgACABQQxqNgJAIAAgAUEIajYCOCAAQQ42AjQgACABNgIwIABBAzYCXCAAQQM2AlQgAEHslMAANgJQIABBADYCSCAAIABBMGo2AlggAEEgakH4gcAAIABByABqECMNACAAQSBqIgJBqoLAAEGggsAAEEoQBSEIEDAiASAIJgEgAEEYaiABJQEQBiAAKAIYIQMgACAAKAIcIgU2AlAgACADNgJMIAAgBTYCSCAAQRBqIABByABqIgMQSyACIAAoAhAiBSAAKAIUIgcQfCACQayCwABBqoLAABBKIABB0ABqIABBKGooAgA2AgAgACAAKQMgNwNIIABBCGogAxBLIAAoAgggACgCDBAHIAcgBRB6IAFBJE8EQCABED8LIABB4ABqJAAMAQtB0LXAAEE3IABByABqQZCCwABB5LbAABBDAAtByLvAACgCAEEBawUgAgs2AgAgBkEBSw0AIAQNAQsACwALrgEBBn8CQCAAQSRPBEAgANBvJgEQXyIBRQ0BIAEoAhAhAyABQQA2AhAgASgCDCEEIAEoAgghBSABQoCAgIDAADcCCCABKAIAIQYgASgCBCECIAFCADcCACAAIAJJDQEgACACayIAIANPDQEgBCAAQQJ0aiAGNgIAIAEgAzYCECABIAI2AgQgASAANgIAIAEoAgwhACABIAQ2AgwgASgCCCABIAU2AgggABB6Cw8LAAuqAQEBfyMAQUBqIgIkACACQgA3AzggAkE4aiAAKAIAJQEQFCACQRRqQQI2AgAgAkEcakEBNgIAIAIgAigCPCIANgIwIAIgAigCODYCLCACIAA2AiggAkEfNgIkIAJBuLvAADYCECACQQA2AgggAUEEaigCACEAIAIgAkEoajYCICACIAJBIGo2AhggASgCACAAIAJBCGoQUCACKAIoIAIoAiwQeiACQUBrJAALkgEAAn8CQAJAIAIEQAJAIAFBAE4EQCADKAIIDQEMBAsMAgsgAygCBCICRQ0CIAMoAgAgAkEBIAEQHgwDCyAAIAE2AgQLIABBCGpBADYCACAAQQE2AgAPCyABEBcLIgIEQCAAIAI2AgQgAEEIaiABNgIAIABBADYCAA8LIAAgATYCBCAAQQhqQQE2AgAgAEEBNgIAC5EBAQF/IwBBEGsiBiQAAkAgAQRAIAYgASADIAQgBSACKAIQEQcAIAYoAgAiAyAGKAIIIgFLBEAgBigCBCECAkAgAUUEQCACEB9BBCEFDAELIAIgA0ECdEEEIAFBAnQQHiIFRQ0DCyAGIAU2AgQLIAYoAgQhAiAAIAE2AgQgACACNgIAIAZBEGokAA8LEIkBAAsAC4cBAQF/IwBBQGoiBSQAIAUgATYCDCAFIAA2AgggBSADNgIUIAUgAjYCECAFQSRqQQI2AgAgBUEsakECNgIAIAVBPGpBDzYCACAFQYiXwAA2AiAgBUEANgIYIAVBDjYCNCAFIAVBMGo2AiggBSAFQRBqNgI4IAUgBUEIajYCMCAFQRhqIAQQWQALowECBX8BbyMAQRBrIgMkAAJAAkACQCABEI4BIgJFBEBBASEEDAELIAJBAEgNASADQQhqIAJBARBtIAMoAggiBEUNAgsgACAENgIEIAAgAjYCABAJIQcQMCICIAcmASACJQEQCiEHEDAiBSAHJgEgBRBvIQYgBRB1IAYlASABJQEgBBAMIAYQdSACEHUgACABEI4BNgIIIANBEGokAA8LEFMACwALowECAX8BbyMAQUBqIgEkACABQQA2AgggAUKAgICAEDcDACABQQM6ADAgAUKAgICAgAQ3AyggAUEANgIgIAFBADYCGCABQbi1wAA2AhQgASABNgIQIAAgAUEQahB9BEBB0LXAAEE3IAFBOGpBiLbAAEHktsAAEEMACyABKAIEIAEoAggQEyECEDAiACACJgEgASgCACABKAIEEHogAUFAayQAIAALhAEBAX8jAEEQayICJAACQAJAIAEoAgAiASUBEA1FBEAgASUBEA4NASAAQQA2AgQMAgsgAiABEEQgAEEIaiACQQhqKAIANgIAIAAgAikDADcCAAwBCyACIAEQbyIBEEQgAEEIaiACQQhqKAIANgIAIAAgAikDADcCACABEHULIAJBEGokAAt2AQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EUakECNgIAIANBHGpBAjYCACADQSxqQQ02AgAgA0HolcAANgIQIANBADYCCCADQQ02AiQgAyADQSBqNgIYIAMgAzYCKCADIANBBGo2AiAgA0EIaiACEFkAC3UBA38jAEEgayICJAACf0EBIAAoAgAgARAyDQAaIAEoAgQhAyABKAIAIQQgAkEANgIcIAJBuLfAADYCGCACQQE2AhQgAkHglMAANgIQIAJBADYCCEEBIAQgAyACQQhqECMNABogACgCBCABEDILIAJBIGokAAt5AQN/IwBBEGsiAiQAIAEoAgRFBEAgASgCDCEDIAJBCGoiBEEANgIAIAJCgICAgBA3AwAgAiACNgIMIAJBDGpBoLfAACADECMaIAFBCGogBCgCADYCACABIAIpAwA3AgALIABB3LjAADYCBCAAIAE2AgAgAkEQaiQAC2YBAn8jAEEQayIDJAAgASACayIEIAAoAgAgACgCCCIBa0sEQCADQQhqIAAgASAEEDsgAygCCCADKAIMEGUgACgCCCEBCyAAKAIEIAFqIAIgBBCLARogACABIARqNgIIIANBEGokAAtuAQN/IAEoAgAiBCABKAIIIgJLBEAgASgCBCEDIAICfwJAIAJFBEAgAxAfQQEhAwwBC0EBIAMgBEEBIAIQHiIDRQ0BGgsgASACNgIAIAEgAzYCBEGBgICAeAsQZQsgACACNgIEIAAgASgCBDYCAAtdAQF/IwBBIGsiAiQAIAAoAgAhACACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACIAA2AgQgAkEEakGsgMAAIAJBCGoQIyACQSBqJAALXQEBfyMAQSBrIgIkACAAKAIAIQAgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAiAANgIEIAJBBGpBoLfAACACQQhqECMgAkEgaiQAC1YBAX8jAEEgayICJAAgAiAANgIEIAJBGGogAUEQaikCADcDACACQRBqIAFBCGopAgA3AwAgAiABKQIANwMIIAJBBGpBmLXAACACQQhqECMgAkEgaiQAC0oBAX8jAEEgayICJAAgACgCACACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACQQhqEE4gAkEgaiQAC0kBAX8jAEEgayIDJAAgA0EYaiACQRBqKQIANwMAIANBEGogAkEIaikCADcDACADIAIpAgA3AwggACABIANBCGoQIyADQSBqJAALUQEBfyMAQSBrIgMkACADQQxqQQE2AgAgA0EUakEANgIAIANBuLfAADYCECADQQA2AgAgAyABNgIcIAMgADYCGCADIANBGGo2AgggAyACEFkAC0cBAX8gAiAAKAIAIgAoAgAgACgCCCIDa0sEQCAAIAMgAhA6IAAoAgghAwsgACgCBCADaiABIAIQiwEaIAAgAiADajYCCEEAC0kBAX8jAEEgayIAJAAgAEEUakEBNgIAIABBHGpBADYCACAAQfSAwAA2AhAgAEG4t8AANgIYIABBADYCCCAAQQhqQfyAwAAQWQALPAACQCABIAJNBEAgAiAETQ0BIAIgBCAFEIUBAAsgASACIAUQhgEACyAAIAIgAWs2AgQgACABIANqNgIACz0BAX8jAEEQayIFJAAgBUEIakEAIAMgASACIAQQVCAFKAIMIQEgACAFKAIINgIAIAAgATYCBCAFQRBqJAALOQACQAJ/IAJBgIDEAEcEQEEBIAAgAiABKAIQEQAADQEaCyADDQFBAAsPCyAAIAMgBCABKAIMEQEACzgBAn9B4LzAACgCACIBBEADQCAAQQFqIQAgASgCCCIBDQALC0GYv8AAQf8fIAAgAEH/H00bNgIAC/twAyF/G34BfCABKAIYQQFxIQUgACsDACE+AkACQCABKAIQBEACfyABIQMgAUEUaigCACESIwBB4A5rIgYkACA+vSEmAkAgPiA+YgRAQQIhBAwBCyAmQv////////8HgyInQoCAgICAgIAIhCAmQgGGQv7///////8PgyAmQjSIp0H/D3EiARsiKEIBg0EDIQQCfwJAAkACQEEBQQJBBCAmQoCAgICAgID4/wCDIiNQIgAbICNCgICAgICAgPj/AFEbQQNBBCAAGyAnUBtBAmsOAwABAgQLQQQhBAwDCyABQbMIawwBC0KAgICAgICAICAoQgGGIChCgICAgICAgAhRIgAbIShBy3dBzHcgABsgAWoLIQtQIQQLAkACQAJAAn8CQAJAAkACQAJAAkACQAJAAkACQAJAAkBBAyAEQQJrQf8BcSIAIABBA08bIgAEQEGblMAAQZyUwABBuLfAACAFGyAmQgBTGyEWQQEhBEEBICZCP4inIAUbIRwCQAJAAkAgAEECaw4CAQACC0F0QQUgC8EiCUEASBsgCWwiAEG//QBLDQYgKFAN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ASgCACEDQQgQFyIBRQRAAAsgASACNgIEIAEgAzYCACAAQey4wAA2AgQgACABNgIACysBAX4DQCABBEAgAUEBayEBQgEgADEAAIYgAoQhAiAAQQFqIQAMAQsLIAILMgACQCAAQfz///8HSw0AIABFBEBBBA8LIAAgAEH9////B0lBAnQQJyIARQ0AIAAPCwALLQEBfyMAQRBrIgIkACACQQhqIAAgAUEBEDsgAigCCCACKAIMEGUgAkEQaiQACz8BAX9BoL/AACgCACIABEBBpL/AAEEAIAAbDwtBsL/AAEIENwIAQai/wABCADcCAEGgv8AAQgE3AgBBpL/AAAsfAQJ+IAApAwAiAiACQj+HIgOFIAN9IAJCAFkgARAuCyIAAkAgAUH8////B00EQCAAIAFBBCACEB4iAA0BCwALIAALIAEBfwJAIABBBGooAgAiAUUNACAAKAIARQ0AIAEQHwsLIgAgAC0AAEUEQCABQZCawABBBRAYDwsgAUGMmsAAQQQQGAseACAARQRAEIkBAAsgACACIAMgBCAFIAEoAhARDgALGwACQCABQYGAgIB4RwRAIAFFDQEACw8LEFMACxwAIABFBEAQiQEACyAAIAIgAyAEIAEoAhARCQALHAAgAEUEQBCJAQALIAAgAiADIAQgASgCEBESAAscACAARQRAEIkBAAsgACACIAMgBCABKAIQERwACxwAIABFBEAQiQEACyAAIAIgAyAEIAEoAhARHgALHAAgAEUEQBCJAQALIAAgAiADIAQgASgCEBEgAAsaACAARQRAEIkBAAsgACACIAMgASgCEBEDAAsYACAARQRAEIkBAAsgACACIAEoAhARAAALGAAgASACECchAiAAIAE2AgQgACACNgIACxQAIAAoAgAEQCAAQQRqKAIAEB8LCxYBAW8gACUBEAshARAwIgAgASYBIAALFQAgASAAKAIAIgAoAgAgACgCBBAYCxkAIAEoAgBByqrAAEEFIAEoAgQoAgwRAQALGQAgASgCAEGOtcAAQQogASgCBCgCDBEBAAsZACABKAIAQYy1wABBAiABKAIEKAIMEQEACxQAIAAoAgAgASAAKAIEKAIMEQAACw4AIABBJE8EQCAAED8LCxMAIAEoAgAgASgCBCAAKAIAECMLsAkBBX8jAEHwAGsiBSQAIAUgAzYCDCAFIAI2AggC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', imports)}

/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
var _Validator_pool, _Validator_detectionLength;
const dbg$6 = debug('c2pa:Validator');
/**
 * Handles validation of input before processing it for C2PA metadata
 *
 * @public
 */
class Validator {
    constructor(pool, detectionLength) {
        _Validator_pool.set(this, void 0);
        _Validator_detectionLength.set(this, void 0);
        __classPrivateFieldSet(this, _Validator_pool, pool, "f");
        __classPrivateFieldSet(this, _Validator_detectionLength, detectionLength ?? Validator.DEFAULT_DETECTION_LENGTH, "f");
    }
    /**
     * Sanitizes mime type strings for proper file type checking
     *
     * @remarks
     * We need to do this since some Content-Types can coming in such as `image/jpeg; charset=utf-8`.
     *
     * @param type - The mime type of the asset
     */
    static sanitizeMimeType(type) {
        return type.split(';')[0];
    }
    /**
     * Checks if the asset has a mime type that is compatible with C2PA
     *
     * @param type - The mime type of the asset to check
     */
    static isValidMimeType(type) {
        return this.VALID_MIME_TYPES.includes(this.sanitizeMimeType(type));
    }
    /**
     * Scans an individual binary chunk for a C2PA metadata marker
     *
     * @param chunk - the chunk to check for the metadata marker
     */
    async scanChunk(chunk) {
        const wasm = await detectorWasm();
        dbg$6('Scanning buffer for C2PA marker with length %d', chunk.byteLength);
        // TODO: Add support for transferable objects
        const result = await __classPrivateFieldGet(this, _Validator_pool, "f").scanInput(wasm, chunk);
        dbg$6('Scanned buffer and got result', result);
        return result;
    }
    /**
     * Scans a buffer/Blob for a C2PA metadata marker
     *
     * @remarks
     * This will automatically handle both a `ArrayBuffer` or a `Blob` as input
     * and automatically decide if it should be passed as a transferable object or not.
     * It will then pass it to `scanChunk` for the actual processing.
     *
     * @param input - The buffer/blob to scan
     */
    async scanInput(input) {
        let buffer = null;
        if (input instanceof ArrayBuffer) {
            buffer = input;
        }
        else if (input instanceof Blob) {
            // Only send this as a transferable object if we are extracting an array
            // buffer from a blob, since we won't be re-using this buffer anywhere else
            const fullBuffer = await input.arrayBuffer();
            if (__classPrivateFieldGet(this, _Validator_detectionLength, "f") > 0) {
                buffer = fullBuffer.slice(0, __classPrivateFieldGet(this, _Validator_detectionLength, "f"));
            }
            else {
                buffer = fullBuffer;
            }
        }
        if (!buffer) {
            throw new InvalidInputError();
        }
        return this.scanChunk(buffer);
    }
}
_Validator_pool = new WeakMap(), _Validator_detectionLength = new WeakMap();
Validator.VALID_MIME_TYPES = [
    'application/c2pa',
    'application/mp4',
    'application/x-c2pa-manifest-store',
    'audio/mp4',
    'audio/mpeg',
    'audio/vnd.wave',
    'audio/wav',
    'audio/x-wav',
    'image/avif',
    'image/heic',
    'image/heif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    'image/x-adobe-dng',
    'video/mp4',
    'video/x-msvideo',
    'application/pdf',
];
Validator.DEFAULT_DETECTION_LENGTH = 65535;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

function eq$5(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq$5;

var eq$4 = eq_1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$4(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf$4;

var assocIndexOf$3 = _assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$3(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete$1;

var assocIndexOf$2 = _assocIndexOf;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet$1;

var assocIndexOf$1 = _assocIndexOf;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas$1;

var assocIndexOf = _assocIndexOf;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet$1;

var listCacheClear = _listCacheClear,
    listCacheDelete = _listCacheDelete,
    listCacheGet = _listCacheGet,
    listCacheHas = _listCacheHas,
    listCacheSet = _listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$4(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype['delete'] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;

var _ListCache = ListCache$4;

var ListCache$3 = _ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear$1() {
  this.__data__ = new ListCache$3;
  this.size = 0;
}

var _stackClear = stackClear$1;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function stackDelete$1(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete$1;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function stackGet$1(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet$1;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function stackHas$1(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas$1;

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$a = freeGlobal || freeSelf || Function('return this')();

var _root = root$a;

var _Symbol;
var hasRequired_Symbol;

function require_Symbol () {
	if (hasRequired_Symbol) return _Symbol;
	hasRequired_Symbol = 1;
	var root = _root;

	/** Built-in value references. */
	var Symbol = root.Symbol;

	_Symbol = Symbol;
	return _Symbol;
}

var Symbol$4 = require_Symbol();

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$f.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$f.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$4 ? Symbol$4.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$d.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto$e = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$e.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString$1;

var Symbol$3 = require_Symbol(),
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$3 ? Symbol$3.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$7(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$7;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject$c(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$c;

var baseGetTag$6 = _baseGetTag,
    isObject$b = isObject_1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$3(value) {
  if (!isObject$b(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$6(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction$3;

var root$9 = _root;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$9['__core-js_shared__'];

var _coreJsData = coreJsData$1;

var coreJsData = _coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked$1;

/** Used for built-in method references. */

var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource$2;

var isFunction$2 = isFunction_1,
    isMasked = _isMasked,
    isObject$a = isObject_1,
    toSource$1 = _toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$d = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$d.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$c).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$a(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}

var _baseIsNative = baseIsNative$1;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

var baseIsNative = _baseIsNative,
    getValue = _getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$6(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var _getNative = getNative$6;

var getNative$5 = _getNative,
    root$8 = _root;

/* Built-in method references that are verified to be native. */
var Map$4 = getNative$5(root$8, 'Map');

var _Map = Map$4;

var getNative$4 = _getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate$4 = getNative$4(Object, 'create');

var _nativeCreate = nativeCreate$4;

var nativeCreate$3 = _nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}

var _hashClear = hashClear$1;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete$1;

var nativeCreate$2 = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$c.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$b.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet$1;

var nativeCreate$1 = _nativeCreate;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$b.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$a.call(data, key);
}

var _hashHas = hashHas$1;

var nativeCreate = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

var _hashSet = hashSet$1;

var hashClear = _hashClear,
    hashDelete = _hashDelete,
    hashGet = _hashGet,
    hashHas = _hashHas,
    hashSet = _hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear;
Hash$1.prototype['delete'] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;

var _Hash = Hash$1;

var Hash = _Hash,
    ListCache$2 = _ListCache,
    Map$3 = _Map;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$3 || ListCache$2),
    'string': new Hash
  };
}

var _mapCacheClear = mapCacheClear$1;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable$1;

var isKeyable = _isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$4(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData$4;

var getMapData$3 = _getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete$1;

var getMapData$2 = _getMapData;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}

var _mapCacheGet = mapCacheGet$1;

var getMapData$1 = _getMapData;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

var _mapCacheHas = mapCacheHas$1;

var getMapData = _getMapData;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet$1;

var mapCacheClear = _mapCacheClear,
    mapCacheDelete = _mapCacheDelete,
    mapCacheGet = _mapCacheGet,
    mapCacheHas = _mapCacheHas,
    mapCacheSet = _mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$2(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache$2.prototype.clear = mapCacheClear;
MapCache$2.prototype['delete'] = mapCacheDelete;
MapCache$2.prototype.get = mapCacheGet;
MapCache$2.prototype.has = mapCacheHas;
MapCache$2.prototype.set = mapCacheSet;

var _MapCache = MapCache$2;

var ListCache$1 = _ListCache,
    Map$2 = _Map,
    MapCache$1 = _MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet$1(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache$1) {
    var pairs = data.__data__;
    if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache$1(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet$1;

var ListCache = _ListCache,
    stackClear = _stackClear,
    stackDelete = _stackDelete,
    stackGet = _stackGet,
    stackHas = _stackHas,
    stackSet = _stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack$4(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack$4.prototype.clear = stackClear;
Stack$4.prototype['delete'] = stackDelete;
Stack$4.prototype.get = stackGet;
Stack$4.prototype.has = stackHas;
Stack$4.prototype.set = stackSet;

var _Stack = Stack$4;

var getNative$3 = _getNative;

var defineProperty$2 = (function() {
  try {
    var func = getNative$3(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$2;

var defineProperty$1 = _defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue$4(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue$4;

var baseAssignValue$3 = _baseAssignValue,
    eq$3 = eq_1;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue$2(object, key, value) {
  if ((value !== undefined && !eq$3(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue$3(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue$2;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */

function createBaseFor$1(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor$1;

var createBaseFor = _createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor$2 = createBaseFor();

var _baseFor = baseFor$2;

var _cloneBuffer = {exports: {}};

(function (module, exports) {
	var root = _root;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
} (_cloneBuffer, _cloneBuffer.exports));

var root$7 = _root;

/** Built-in value references. */
var Uint8Array$3 = root$7.Uint8Array;

var _Uint8Array = Uint8Array$3;

var Uint8Array$2 = _Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer$3(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$2(result).set(new Uint8Array$2(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer$3;

var cloneArrayBuffer$2 = _cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray$2(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$2(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray$2;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */

function copyArray$4(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray$4;

var isObject$9 = isObject_1;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate$2 = (function() {
  function object() {}
  return function(proto) {
    if (!isObject$9(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate$2;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg$2;

var overArg$1 = _overArg;

/** Built-in value references. */
var getPrototype$3 = overArg$1(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype$3;

/** Used for built-in method references. */

var objectProto$a = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$3(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$a;

  return value === proto;
}

var _isPrototype = isPrototype$3;

var baseCreate$1 = _baseCreate,
    getPrototype$2 = _getPrototype,
    isPrototype$2 = _isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject$2(object) {
  return (typeof object.constructor == 'function' && !isPrototype$2(object))
    ? baseCreate$1(getPrototype$2(object))
    : {};
}

var _initCloneObject = initCloneObject$2;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike$b(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$b;

var baseGetTag$5 = _baseGetTag,
    isObjectLike$a = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$a(value) && baseGetTag$5(value) == argsTag$3;
}

var _baseIsArguments = baseIsArguments$1;

var baseIsArguments = _baseIsArguments,
    isObjectLike$9 = isObjectLike_1;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$9.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$3 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike$9(value) && hasOwnProperty$9.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1 = isArguments$3;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray$d = Array.isArray;

var isArray_1 = isArray$d;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$3(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength$3;

var isFunction$1 = isFunction_1,
    isLength$2 = isLength_1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$5(value) {
  return value != null && isLength$2(value.length) && !isFunction$1(value);
}

var isArrayLike_1 = isArrayLike$5;

var isArrayLike$4 = isArrayLike_1,
    isObjectLike$8 = isObjectLike_1;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$8(value) && isArrayLike$4(value);
}

var isArrayLikeObject_1 = isArrayLikeObject$1;

var isBuffer$4 = {exports: {}};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */

function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

(function (module, exports) {
	var root = _root,
	    stubFalse = stubFalse_1;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	module.exports = isBuffer;
} (isBuffer$4, isBuffer$4.exports));

var baseGetTag$4 = _baseGetTag,
    getPrototype$1 = _getPrototype,
    isObjectLike$7 = isObjectLike_1;

/** `Object#toString` result references. */
var objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$8 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$8.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$2(value) {
  if (!isObjectLike$7(value) || baseGetTag$4(value) != objectTag$4) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$8.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject$2;

var baseGetTag$3 = _baseGetTag,
    isLength$1 = isLength_1,
    isObjectLike$6 = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$3 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    weakMapTag$3 = '[object WeakMap]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] =
typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] =
typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] =
typedArrayTags[errorTag$3] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] =
typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$3] =
typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] =
typedArrayTags[weakMapTag$3] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
  return isObjectLike$6(value) &&
    isLength$1(value.length) && !!typedArrayTags[baseGetTag$3(value)];
}

var _baseIsTypedArray = baseIsTypedArray$1;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

var _baseUnary;
var hasRequired_baseUnary;

function require_baseUnary () {
	if (hasRequired_baseUnary) return _baseUnary;
	hasRequired_baseUnary = 1;
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	_baseUnary = baseUnary;
	return _baseUnary;
}

var _nodeUtil = {exports: {}};

(function (module, exports) {
	var freeGlobal = _freeGlobal;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
} (_nodeUtil, _nodeUtil.exports));

var baseIsTypedArray = _baseIsTypedArray,
    baseUnary$2 = require_baseUnary(),
    nodeUtil$2 = _nodeUtil.exports;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray$3 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray_1 = isTypedArray$3;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function safeGet$2(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet$2;

var baseAssignValue$2 = _baseAssignValue,
    eq$2 = eq_1;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$7.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue$3(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$7.call(object, key) && eq$2(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue$2(object, key, value);
  }
}

var _assignValue = assignValue$3;

var assignValue$2 = _assignValue,
    baseAssignValue$1 = _baseAssignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject$5(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue$1(object, key, newValue);
    } else {
      assignValue$2(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject$5;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */

function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes$1;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$5(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex$5;

var baseTimes = _baseTimes,
    isArguments$2 = isArguments_1,
    isArray$c = isArray_1,
    isBuffer$3 = isBuffer$4.exports,
    isIndex$4 = _isIndex,
    isTypedArray$2 = isTypedArray_1;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$6.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$c(value),
      isArg = !isArr && isArguments$2(value),
      isBuff = !isArr && !isArg && isBuffer$3(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$2(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex$4(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys$2;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn$1;

var isObject$8 = isObject_1,
    isPrototype$1 = _isPrototype,
    nativeKeysIn = _nativeKeysIn;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn$1(object) {
  if (!isObject$8(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$5.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn$1;

var arrayLikeKeys$1 = _arrayLikeKeys,
    baseKeysIn = _baseKeysIn,
    isArrayLike$3 = isArrayLike_1;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$5(object) {
  return isArrayLike$3(object) ? arrayLikeKeys$1(object, true) : baseKeysIn(object);
}

var keysIn_1 = keysIn$5;

var copyObject$4 = _copyObject,
    keysIn$4 = keysIn_1;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject$1(value) {
  return copyObject$4(value, keysIn$4(value));
}

var toPlainObject_1 = toPlainObject$1;

var assignMergeValue$1 = _assignMergeValue,
    cloneBuffer$1 = _cloneBuffer.exports,
    cloneTypedArray$1 = _cloneTypedArray,
    copyArray$3 = _copyArray,
    initCloneObject$1 = _initCloneObject,
    isArguments$1 = isArguments_1,
    isArray$b = isArray_1,
    isArrayLikeObject = isArrayLikeObject_1,
    isBuffer$2 = isBuffer$4.exports,
    isFunction = isFunction_1,
    isObject$7 = isObject_1,
    isPlainObject$1 = isPlainObject_1,
    isTypedArray$1 = isTypedArray_1,
    safeGet$1 = _safeGet,
    toPlainObject = toPlainObject_1;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet$1(object, key),
      srcValue = safeGet$1(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue$1(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray$b(srcValue),
        isBuff = !isArr && isBuffer$2(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray$b(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray$3(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer$1(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray$1(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject$1(srcValue) || isArguments$1(srcValue)) {
      newValue = objValue;
      if (isArguments$1(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject$7(objValue) || isFunction(objValue)) {
        newValue = initCloneObject$1(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue$1(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep$1;

var Stack$3 = _Stack,
    assignMergeValue = _assignMergeValue,
    baseFor$1 = _baseFor,
    baseMergeDeep = _baseMergeDeep,
    isObject$6 = isObject_1,
    keysIn$3 = keysIn_1,
    safeGet = _safeGet;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge$1(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor$1(source, function(srcValue, key) {
    stack || (stack = new Stack$3);
    if (isObject$6(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge$1, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn$3);
}

var _baseMerge = baseMerge$1;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */

function identity$5(value) {
  return value;
}

var identity_1 = identity$5;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */

function apply$3(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply$3;

var apply$2 = _apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$3 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$1(func, start, transform) {
  start = nativeMax$3(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$3(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply$2(func, this, otherArgs);
  };
}

var _overRest = overRest$1;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */

function constant$1(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant$1;

var constant = constant_1,
    defineProperty = _defineProperty,
    identity$4 = identity_1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString$1 = !defineProperty ? identity$4 : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString$1;

/** Used to detect hot functions by number of calls within a span of milliseconds. */

var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut$2(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut$2;

var baseSetToString = _baseSetToString,
    shortOut$1 = _shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString$2 = shortOut$1(baseSetToString);

var _setToString = setToString$2;

var identity$3 = identity_1,
    overRest = _overRest,
    setToString$1 = _setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$1(func, start) {
  return setToString$1(overRest(func, start, identity$3), func + '');
}

var _baseRest = baseRest$1;

var eq$1 = eq_1,
    isArrayLike$2 = isArrayLike_1,
    isIndex$3 = _isIndex,
    isObject$5 = isObject_1;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall$1(value, index, object) {
  if (!isObject$5(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$2(object) && isIndex$3(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq$1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall$1;

var baseRest = _baseRest,
    isIterateeCall = _isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner$1(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner$1;

var baseMerge = _baseMerge,
    createAssigner = _createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

var merge_1 = merge;

/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
var _a, _Downloader_options, _Downloader_pool, _Downloader_validator, _Downloader_responseCache, _Downloader_defaultOptions, _Downloader_defaultFetchOptions;
const dbg$5 = debug('c2pa:Downloader');
const cacheDbg = debug('c2pa:Downloader:Cache');
/**
 * Handles downloading of any assets
 *
 * @public
 */
class Downloader {
    constructor(pool, opts = {}) {
        _Downloader_options.set(this, void 0);
        _Downloader_pool.set(this, void 0);
        _Downloader_validator.set(this, void 0);
        __classPrivateFieldSet(this, _Downloader_options, { ...__classPrivateFieldGet(Downloader, _a, "f", _Downloader_defaultOptions), ...opts }, "f");
        __classPrivateFieldSet(this, _Downloader_pool, pool, "f");
        __classPrivateFieldSet(this, _Downloader_validator, new Validator(__classPrivateFieldGet(this, _Downloader_pool, "f"), __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize), "f");
    }
    /**
     * Wrapper around `fetch` to download an asset
     *
     * @remarks
     * This has convenience logic for range requests
     *
     * @param url - The URL to fetch
     * @param fetchOptions - Options for this particular request
     */
    static async download(url, fetchOptions = {}) {
        dbg$5('Downloading', url);
        try {
            const defaultOpts = __classPrivateFieldGet(Downloader, _a, "f", _Downloader_defaultFetchOptions);
            const opts = merge_1({}, defaultOpts, fetchOptions);
            // Only use range if it is specified. If not, it may lead to CORS issues due to not being whitelisted
            const useRange = opts.rangeStart !== defaultOpts.rangeStart ||
                opts.rangeEnd !== defaultOpts.rangeEnd;
            const range = [opts.rangeStart, opts.rangeEnd ?? ''].join('-');
            const rangeHeaders = useRange
                ? { headers: { range: `bytes=${range}` } }
                : null;
            const res = await fetch(url, merge_1({}, opts.fetchConfig, rangeHeaders));
            if (res.ok) {
                return res;
            }
            else {
                throw new UrlFetchError(url, res);
            }
        }
        catch (err) {
            throw new UrlFetchError(url, null, err);
        }
    }
    /**
     * This allows us to inspect the image to see if the header contains C2PA data
     *
     * @remarks
     * We will request a download to the server requesting the first `inspectSize` bytes. From there:
     * - if the server responds with a payload less than the content-length, we will inspect that chunk and
     *   download the rest if the content-type matches and that chunk contains metadata
     * - if it responds with a payload equal to or greater than the content-length, we will inspect that the
     *   content type matches, scan the chunk, and return the data
     * - we'll return `null` if the content-type is invalid or if CAI data does not exist
     *
     * @param url - The URL to fetch
     */
    async inspect(url) {
        dbg$5('Inspecting', url);
        let res;
        let contentType = null;
        const shouldInspect = __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize > 0;
        if (shouldInspect) {
            try {
                res = await Downloader.download(url, {
                    rangeEnd: __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize,
                });
                contentType = res.headers.get('content-type');
                if (res.status === 206) {
                    dbg$5('Successfully downloaded first part of url (supports range requests)', url, res);
                }
                else {
                    dbg$5('Successfully downloaded complete url (server does not support range requests)', url, res);
                }
            }
            catch (err) {
                dbg$5('Attempting to download with a range header failed, trying again without one', err);
            }
        }
        else {
            dbg$5('inspectSize of 0 given, downloading entire file');
        }
        if (!res) {
            try {
                // We don't have an initial response due to not doing the initial range download
                // Do a HEAD request to determine if we should download the entire file based on content-type
                const headRes = await Downloader.download(url, {
                    fetchConfig: {
                        method: 'HEAD',
                    },
                });
                contentType = headRes.headers.get('content-type');
                dbg$5('Performed HEAD request and got content-type', url, contentType);
            }
            catch (err) {
                dbg$5('HEAD request to check for content-type failed, downloading entire file');
            }
        }
        if (contentType && !Validator.isValidMimeType(contentType)) {
            dbg$5('Resource has invalid content type', contentType);
            throw new InvalidMimeTypeError(contentType);
        }
        if (!res) {
            res = await Downloader.download(url);
        }
        const blob = await res.blob();
        if (!shouldInspect) {
            dbg$5(`Skipping inspection due to disabling the config`);
            return blob;
        }
        const buffer = await blob.arrayBuffer();
        const { found } = await __classPrivateFieldGet(this, _Downloader_validator, "f").scanChunk(buffer);
        if (found) {
            dbg$5('C2PA metadata found for url', url);
        }
        else {
            dbg$5('No C2PA metadata found for url', url);
            return null;
        }
        // We don't get a full content-length back from the server when doing a range
        // request, so we need to guess based on the response. We should continue if
        // we get a 206 back from the server instead of a 200, and that equals the `inspectSize`.
        // In that case, changes are the second request will yield more data, unless the image
        // size is exactly the `inspectSize`, and we get no data back.
        const shouldContinue = res.status === 206 && buffer.byteLength === __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize + 1;
        if (shouldContinue) {
            dbg$5('Continuing download at offset %d', __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize);
            const tailRes = await Downloader.download(url, {
                // We need to start the range at the next byte
                rangeStart: __classPrivateFieldGet(this, _Downloader_options, "f").inspectSize + 1,
            });
            const tailBuffer = await tailRes.arrayBuffer();
            dbg$5('Successfully downloaded rest of file (%d bytes)', tailBuffer.byteLength);
            return new Blob([buffer, tailBuffer], { type: blob.type });
        }
        return blob;
    }
    /**
     * Fetches a JSON payload and caches it, using the requested URL as the key
     *
     * @param url - The URL to fetch and cache
     */
    static async cachedGetJson(url) {
        if (!__classPrivateFieldGet(this, _a, "f", _Downloader_responseCache).get(url)) {
            cacheDbg('No cache found for %s', url);
            const res = await Downloader.download(url, {
                fetchConfig: {
                    credentials: 'omit',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            });
            const data = await res.json();
            cacheDbg('Saving data for %s', url, data);
            __classPrivateFieldGet(this, _a, "f", _Downloader_responseCache).set(url, data);
        }
        cacheDbg('Returning cached data for %s', url);
        return __classPrivateFieldGet(this, _a, "f", _Downloader_responseCache).get(url);
    }
}
_a = Downloader, _Downloader_options = new WeakMap(), _Downloader_pool = new WeakMap(), _Downloader_validator = new WeakMap();
_Downloader_responseCache = { value: new Map() };
_Downloader_defaultOptions = { value: {
        inspectSize: 0,
    } };
_Downloader_defaultFetchOptions = { value: {
        rangeStart: 0,
        rangeEnd: undefined,
        fetchConfig: {},
    } };

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
function createTask(task) {
    return task;
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
// From https://github.com/josdejong/workerpool/blob/master/src/WorkerHandler.js#L179-L193
function deserializeError(serializedError) {
    var temp = new Error('');
    var props = Object.keys(serializedError);
    for (var i = 0; i < props.length; i++) {
        // @ts-ignore
        temp[props[i]] = serializedError[props[i]];
    }
    return temp;
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Create a wrapper responsible for managing a single worker
 *
 * @param scriptUrl URL to worker script
 * @returns {WorkerManager}
 */
function createWorkerManager(scriptUrl) {
    const worker = new Worker(scriptUrl);
    let working = false;
    const execute = async (request) => {
        worker.postMessage(request);
        working = true;
        return new Promise((resolve, reject) => {
            worker.onmessage = function (e) {
                if (e.data.type === 'success') {
                    resolve(e.data.data);
                }
                else {
                    reject(deserializeError(e.data.error));
                }
                working = false;
            };
            worker.onerror = function (e) {
                working = false;
                reject(e);
            };
        });
    };
    const isWorking = () => working;
    const terminate = () => worker.terminate();
    return {
        execute,
        isWorking,
        terminate,
    };
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Create a configurable pool of workers capable of concurrent task execution
 *
 * @param {WorkerPoolConfig} config
 * @returns {WorkerPool}
 */
function createWorkerPool(config) {
    const workers = [];
    const tasks = [];
    /**
     * Retrieve an available worker. If none are available and the max is not reached,
     * a new one will be created and returned.
     *
     * @returns {WorkerManager | null} worker
     */
    const getWorker = () => {
        for (const worker of workers) {
            if (!worker.isWorking())
                return worker;
        }
        if (workers.length < config.maxWorkers) {
            const newWorker = createWorkerManager(config.scriptSrc);
            workers.push(newWorker);
            return newWorker;
        }
        return null;
    };
    /**
     * Attempt to process the task queue by retrieving a worker, assigning it a task,
     * and resolving the task once complete.
     */
    const assignTask = async () => {
        const worker = getWorker();
        if (!worker) {
            return;
        }
        const task = tasks.pop();
        if (!task) {
            return;
        }
        try {
            const result = await worker.execute(task.request);
            task.resolve(result);
        }
        catch (error) {
            task.reject(error);
        }
    };
    /**
     * Attempt to execute a method on the worker
     *
     * @param method Name of method to execute
     * @param args Arguments to be passed
     * @returns Promise that resolves once the method has finished executing
     */
    const execute = (method, args) => {
        return new Promise((resolve, reject) => {
            const task = createTask({
                request: {
                    method,
                    args,
                },
                resolve: (value) => {
                    resolve(value);
                    // Upon completion of this task, its worker is now free and the queue should be checked
                    assignTask();
                },
                reject: (value) => {
                    reject(value);
                    assignTask();
                },
            });
            tasks.push(task);
            assignTask();
        });
    };
    const terminate = () => {
        workers.forEach((worker) => worker.terminate());
    };
    return {
        execute,
        terminate,
    };
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const dbg$4 = debug('c2pa:workers');
async function createPoolWrapper(config) {
    const res = await fetch(config.scriptSrc);
    if (!res.ok)
        throw new InvalidWorkerSourceError(config.scriptSrc, res);
    const src = await res.text();
    // @TODO: check subresource integrity
    dbg$4('Fetched worker from %s (%d bytes)', config.scriptSrc, src.length);
    const workerBlob = new Blob([src], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);
    const workerPool = createWorkerPool({
        ...config,
        scriptSrc: workerUrl,
    });
    const pool = {
        compileWasm: async (...args) => workerPool.execute('compileWasm', args),
        getReport: async (...args) => workerPool.execute('getReport', args),
        getReportFromAssetAndManifestBuffer: async (...args) => workerPool.execute('getReportFromAssetAndManifestBuffer', args),
        scanInput: async (...args) => workerPool.execute('scanInput', args),
    };
    return {
        ...pool,
        dispose: () => {
            URL.revokeObjectURL(workerUrl);
            return workerPool.terminate();
        },
    };
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const dbg$3 = debug('c2pa:wasm');
/**
 * Fetches the WASM binary from a supplied URL
 *
 * @param pool Worker pool to be used when compiling WASM
 * @param binaryUrl URL pointing to WASM binary
 */
async function fetchWasm(pool, binaryUrl) {
    const integrity = {"toolkit.d.ts":"sha512-wBFl2Ek4hFY+J+ZTxfHBlYQ5gd4QN6gLqq+2IUa86L2GKNa6m2w+DIcRkkK4Yy4REvPARLxLkKBx1so37w7nAA==","toolkit.js":"sha512-zr6vXIcwpwvnePM1XlrsT7OUpYlqsZuvsk+TavI+7oe5P2AyOcBulxnJyywnMxmvXpBPukSprKgOLjcsLTNkBA==","toolkit_bg.wasm":"sha512-nQDUqmm7vrhjGmvPQqtEMQ46uSSFkQYZyBcPg7dbkNGvGp0tK6kKdp+TwZ8imR9GxUI41p6Z2xT+is049OQt1w==","toolkit_bg.wasm.d.ts":"sha512-YVCrRx/OSisl3kFdOQ1kH0w+CfykYxA1ktowGPCWo1lE+NZ1ycH7EjrUSpi8SfqJh52+VpcuJ8BL4i4rJLj4cg=="};
    const wasmIntegrity = integrity?.['toolkit_bg.wasm'];
    dbg$3('Fetching WASM binary from url %s', binaryUrl, {
        expectedIntegrity: wasmIntegrity,
    });
    const response = await fetch(binaryUrl, {
        integrity: wasmIntegrity,
    });
    const buffer = await response.arrayBuffer();
    dbg$3('Sending WASM binary buffer to worker for compilation', {
        size: buffer.byteLength,
    });
    const wasm = await pool.compileWasm(buffer);
    dbg$3('Compilation finished');
    return wasm;
}

// TODO: use call-bind, is-date, is-regex, is-string, is-boolean-object, is-number-object
function toS(obj) { return Object.prototype.toString.call(obj); }
function isDate(obj) { return toS(obj) === '[object Date]'; }
function isRegExp(obj) { return toS(obj) === '[object RegExp]'; }
function isError$1(obj) { return toS(obj) === '[object Error]'; }
function isBoolean(obj) { return toS(obj) === '[object Boolean]'; }
function isNumber(obj) { return toS(obj) === '[object Number]'; }
function isString(obj) { return toS(obj) === '[object String]'; }

// TODO: use isarray
var isArray$a = Array.isArray || function isArray(xs) {
	return Object.prototype.toString.call(xs) === '[object Array]';
};

// TODO: use for-each?
function forEach$1(xs, fn) {
	if (xs.forEach) { return xs.forEach(fn); }
	for (var i = 0; i < xs.length; i++) {
		fn(xs[i], i, xs);
	}
	return void undefined;
}

// TODO: use object-keys
var objectKeys = Object.keys || function keys(obj) {
	var res = [];
	for (var key in obj) { res.push(key); } // eslint-disable-line no-restricted-syntax
	return res;
};

// TODO: use object.hasown
var hasOwnProperty$4 = Object.prototype.hasOwnProperty || function (obj, key) {
	return key in obj;
};

function copy(src) {
	if (typeof src === 'object' && src !== null) {
		var dst;

		if (isArray$a(src)) {
			dst = [];
		} else if (isDate(src)) {
			dst = new Date(src.getTime ? src.getTime() : src);
		} else if (isRegExp(src)) {
			dst = new RegExp(src);
		} else if (isError$1(src)) {
			dst = { message: src.message };
		} else if (isBoolean(src) || isNumber(src) || isString(src)) {
			dst = Object(src);
		} else if (Object.create && Object.getPrototypeOf) {
			dst = Object.create(Object.getPrototypeOf(src));
		} else if (src.constructor === Object) {
			dst = {};
		} else {
			var proto = (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {};
			var T = function T() {}; // eslint-disable-line func-style, func-name-matching
			T.prototype = proto;
			dst = new T();
		}

		forEach$1(objectKeys(src), function (key) {
			dst[key] = src[key];
		});
		return dst;
	}
	return src;
}

function walk(root, cb, immutable) {
	var path = [];
	var parents = [];
	var alive = true;

	return (function walker(node_) {
		var node = immutable ? copy(node_) : node_;
		var modifiers = {};

		var keepGoing = true;

		var state = {
			node: node,
			node_: node_,
			path: [].concat(path),
			parent: parents[parents.length - 1],
			parents: parents,
			key: path[path.length - 1],
			isRoot: path.length === 0,
			level: path.length,
			circular: null,
			update: function (x, stopHere) {
				if (!state.isRoot) {
					state.parent.node[state.key] = x;
				}
				state.node = x;
				if (stopHere) { keepGoing = false; }
			},
			delete: function (stopHere) {
				delete state.parent.node[state.key];
				if (stopHere) { keepGoing = false; }
			},
			remove: function (stopHere) {
				if (isArray$a(state.parent.node)) {
					state.parent.node.splice(state.key, 1);
				} else {
					delete state.parent.node[state.key];
				}
				if (stopHere) { keepGoing = false; }
			},
			keys: null,
			before: function (f) { modifiers.before = f; },
			after: function (f) { modifiers.after = f; },
			pre: function (f) { modifiers.pre = f; },
			post: function (f) { modifiers.post = f; },
			stop: function () { alive = false; },
			block: function () { keepGoing = false; },
		};

		if (!alive) { return state; }

		function updateState() {
			if (typeof state.node === 'object' && state.node !== null) {
				if (!state.keys || state.node_ !== state.node) {
					state.keys = objectKeys(state.node);
				}

				state.isLeaf = state.keys.length === 0;

				for (var i = 0; i < parents.length; i++) {
					if (parents[i].node_ === node_) {
						state.circular = parents[i];
						break; // eslint-disable-line no-restricted-syntax
					}
				}
			} else {
				state.isLeaf = true;
				state.keys = null;
			}

			state.notLeaf = !state.isLeaf;
			state.notRoot = !state.isRoot;
		}

		updateState();

		// use return values to update if defined
		var ret = cb.call(state, state.node);
		if (ret !== undefined && state.update) { state.update(ret); }

		if (modifiers.before) { modifiers.before.call(state, state.node); }

		if (!keepGoing) { return state; }

		if (
			typeof state.node === 'object'
			&& state.node !== null
			&& !state.circular
		) {
			parents.push(state);

			updateState();

			forEach$1(state.keys, function (key, i) {
				path.push(key);

				if (modifiers.pre) { modifiers.pre.call(state, state.node[key], key); }

				var child = walker(state.node[key]);
				if (immutable && hasOwnProperty$4.call(state.node, key)) {
					state.node[key] = child.node;
				}

				child.isLast = i === state.keys.length - 1;
				child.isFirst = i === 0;

				if (modifiers.post) { modifiers.post.call(state, child); }

				path.pop();
			});
			parents.pop();
		}

		if (modifiers.after) { modifiers.after.call(state, state.node); }

		return state;
	}(root)).node;
}

function Traverse(obj) {
	this.value = obj;
}

Traverse.prototype.get = function (ps) {
	var node = this.value;
	for (var i = 0; i < ps.length; i++) {
		var key = ps[i];
		if (!node || !hasOwnProperty$4.call(node, key)) {
			return void undefined;
		}
		node = node[key];
	}
	return node;
};

Traverse.prototype.has = function (ps) {
	var node = this.value;
	for (var i = 0; i < ps.length; i++) {
		var key = ps[i];
		if (!node || !hasOwnProperty$4.call(node, key)) {
			return false;
		}
		node = node[key];
	}
	return true;
};

Traverse.prototype.set = function (ps, value) {
	var node = this.value;
	for (var i = 0; i < ps.length - 1; i++) {
		var key = ps[i];
		if (!hasOwnProperty$4.call(node, key)) { node[key] = {}; }
		node = node[key];
	}
	node[ps[i]] = value;
	return value;
};

Traverse.prototype.map = function (cb) {
	return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
	this.value = walk(this.value, cb, false);
	return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
	var skip = arguments.length === 1;
	var acc = skip ? this.value : init;
	this.forEach(function (x) {
		if (!this.isRoot || !skip) {
			acc = cb.call(this, acc, x);
		}
	});
	return acc;
};

Traverse.prototype.paths = function () {
	var acc = [];
	this.forEach(function () {
		acc.push(this.path);
	});
	return acc;
};

Traverse.prototype.nodes = function () {
	var acc = [];
	this.forEach(function () {
		acc.push(this.node);
	});
	return acc;
};

Traverse.prototype.clone = function () {
	var parents = [];
	var nodes = [];

	return (function clone(src) {
		for (var i = 0; i < parents.length; i++) {
			if (parents[i] === src) {
				return nodes[i];
			}
		}

		if (typeof src === 'object' && src !== null) {
			var dst = copy(src);

			parents.push(src);
			nodes.push(dst);

			forEach$1(objectKeys(src), function (key) {
				dst[key] = clone(src[key]);
			});

			parents.pop();
			nodes.pop();
			return dst;
		}

		return src;

	}(this.value));
};

function traverse(obj) {
	return new Traverse(obj);
}

// TODO: replace with object.assign?
forEach$1(objectKeys(Traverse.prototype), function (key) {
	traverse[key] = function (obj) {
		var args = [].slice.call(arguments, 1);
		var t = new Traverse(obj);
		return t[key].apply(t, args);
	};
});

var traverse_1 = traverse;

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Creates a facade object with convenience methods over assertion data returned from the toolkit.
 *
 * @param assertionData Raw assertion data returned by the toolkit
 */
function createAssertionAccessor(assertionData) {
    const sortedAssertions = assertionData.sort((a, b) => (a?.instance ?? 0) - (b?.instance ?? 0));
    return {
        data: sortedAssertions,
        get: (label) => {
            // @TODO: can the "any" cast be avoided?
            return sortedAssertions.filter((data) => data.label === label);
        },
    };
}

/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Calculates the SHA of a buffer or blob using WebCrypto
 */
async function sha(data, algorithm = 'SHA-1') {
    const buffer = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
    // deepcode ignore InsecureHash: used for comparison, not security
    const hashBuf = await crypto.subtle.digest(algorithm, buffer);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
function getResourceAsBlob(store, reference) {
    const { format: type, identifier } = reference;
    const data = store.resources?.[identifier];
    if (data) {
        return new Blob([Uint8Array.from(data)], {
            type,
        });
    }
    return null;
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Creates a facade object with convenience methods over thumbnail data returned from the toolkit.
 *
 * @param resourceStore The resource store attached to the ResourceParent
 * @param resourceReference The reference to the resource that provides the thumbnail data
 */
function createThumbnail(resourceStore, resourceReference) {
    if (!resourceStore || !resourceReference) {
        return null;
    }
    const blob = getResourceAsBlob(resourceStore, resourceReference);
    if (!blob) {
        return null;
    }
    return {
        blob,
        contentType: blob.type,
        hash: () => sha(blob),
        getUrl: () => createObjectUrlFromBlob(blob),
    };
}
function createThumbnailFromBlob(blob, contentType) {
    return {
        blob,
        contentType,
        hash: () => sha(blob),
        getUrl: () => createObjectUrlFromBlob(blob),
    };
}
function createThumbnailFromUrl(url) {
    return {
        contentType: undefined,
        getUrl: () => ({
            url,
            dispose: () => { },
        }),
    };
}
function createObjectUrlFromBlob(blob) {
    const url = URL.createObjectURL(blob);
    return {
        url,
        dispose: () => URL.revokeObjectURL(url),
    };
}

/**
 * Creates a facade object with convenience methods over ingredient data returned from the toolkit.
 *
 * @param ingredientData Raw ingredient data returned by the toolkit
 * @param manifest If provided, the created ingredient will link to this manifest. This should be the manifest with a label matching this ingredient's manifestId field.
 */
function createIngredient(ingredientData, manifest) {
    return {
        title: ingredientData.title,
        format: ingredientData.format,
        documentId: ingredientData.document_id ?? null,
        instanceId: ingredientData.instance_id,
        provenance: ingredientData.provenance ?? null,
        hash: ingredientData.hash ?? null,
        isParent: ingredientData.relationship === 'parentOf',
        validationStatus: ingredientData.validation_status ?? [],
        metadata: ingredientData.metadata ?? null,
        manifest: manifest ?? null,
        thumbnail: createThumbnail(ingredientData.resources, ingredientData.thumbnail),
    };
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Creates a facade object with convenience methods over manifest data returned from the toolkit.
 *
 * @param manifestData Raw manifest data returned by the toolkit
 * @param manifests A map of previously-created manifest objects to be provided to ingredients. Must contain any manifest referenced by this manifest's ingredients.
 */
function createManifest(manifestData, manifests) {
    const ingredients = manifestData.ingredients.map((ingredientData) => createIngredient(ingredientData, ingredientData.active_manifest
        ? manifests[ingredientData.active_manifest]
        : undefined));
    return {
        title: manifestData.title,
        format: manifestData.format,
        vendor: manifestData.vendor ?? null,
        claimGenerator: manifestData.claim_generator,
        claimGeneratorHints: manifestData.claim_generator_hints ?? null,
        claimGeneratorInfo: manifestData.claim_generator_info ?? [],
        instanceId: manifestData.instance_id,
        signatureInfo: manifestData.signature_info ?? null,
        credentials: manifestData.credentials ?? [],
        ingredients,
        redactions: manifestData.redactions ?? [],
        parent: null,
        thumbnail: createThumbnail(manifestData.resources, manifestData.thumbnail),
        assertions: createAssertionAccessor(manifestData.assertions),
    };
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const dbg$2 = debug('c2pa:manifestStore');
const SERDE_ARBITRARY_PRECISION_KEY = '$serde_json::private::Number';
/**
 * Since the integration of #107 (specifically adding `arbitrary_precision`),
 * some JSON values may have a `SERDE_ARBITRARY_PRECISION_KEY` that signals
 * that the string value is really a number. We should either change this to a
 * number or BigInt so that we can work with this without downstream clients
 * having to deal with the implementation details.
 *
 * @param manifestStoreData
 */
function parseJsonTypeHints(manifestStoreData) {
    return traverse_1(manifestStoreData).forEach(function (x) {
        if (typeof x === 'object' &&
            x.constructor === Object &&
            x.hasOwnProperty(SERDE_ARBITRARY_PRECISION_KEY)) {
            const val = x[SERDE_ARBITRARY_PRECISION_KEY];
            if (val > Number.MAX_SAFE_INTEGER) {
                this.update(BigInt(val));
            }
            else {
                this.update(parseInt(val, 10));
            }
        }
    });
}
/**
 * Creates a facade object with convenience methods over manifest store data returned from the toolkit.
 *
 * @param config C2pa configuration object
 * @param manifestStoreData Manifest store data returned by the toolkit
 */
function createManifestStore(manifestStoreData) {
    const manifests = createManifests(parseJsonTypeHints(manifestStoreData));
    return {
        manifests,
        activeManifest: manifests[manifestStoreData.active_manifest],
        validationStatus: manifestStoreData?.validation_status ?? [],
    };
}
/**
 * Ensures manifests are resolved in the correct order to build the "tree" of manifests and their ingredients.
 *
 * @param manifestStoreData
 * @returns
 */
function createManifests(manifestStoreData) {
    const { manifests: toolkitManifests, active_manifest: toolkitActiveManifestId, } = manifestStoreData;
    dbg$2('Received manifest store from toolkit', manifestStoreData);
    // Perform a post-order traversal of the manifest tree (leaves-to-root) to guarantee that a manifest's ingredient
    // manifests are already available when it is created.
    const stack = [
        {
            data: toolkitManifests[toolkitActiveManifestId],
            label: toolkitActiveManifestId,
        },
    ];
    const postorderManifests = [];
    while (stack.length) {
        const current = stack.pop();
        postorderManifests.unshift(current);
        const { data: currentManifest } = current;
        currentManifest?.ingredients?.forEach(({ active_manifest: manifestId }) => {
            if (manifestId) {
                if (manifestStoreData.manifests[manifestId]) {
                    stack.push({
                        data: manifestStoreData.manifests[manifestId],
                        label: manifestId,
                    });
                }
                else {
                    dbg$2('No manifest found for id', manifestId);
                }
            }
        });
    }
    const orderedManifests = postorderManifests.reduce((manifests, stackManifestData) => {
        const { data: manifestData, label } = stackManifestData;
        dbg$2('Creating manifest with data', manifestData);
        const manifest = createManifest(manifestData, manifests);
        manifests[label] = manifest;
        return manifests;
    }, {});
    const manifestStack = [orderedManifests[toolkitActiveManifestId]];
    // Perform an in-order traversal of the manifest tree to set 'parent' values of ingredient manifests
    while (manifestStack.length) {
        const currentManifest = manifestStack.pop();
        currentManifest.ingredients?.forEach(({ manifest }) => {
            if (manifest) {
                const selectedManifest = manifest;
                selectedManifest.parent = currentManifest;
                manifestStack.push(selectedManifest);
            }
        });
    }
    return orderedManifests;
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Creates an object containing data for the image provided to the c2pa object.
 *
 * @param downloader Downloader instance used to inspect/download images from a URL
 * @param input Input provided to the c2pa object
 * @param metadata Any additional metadata for the referenced image
 */
async function createSource(downloader, input, metadata) {
    const { blob, metadata: inputMetadata } = await getDataFromInput(downloader, input, metadata ?? {});
    if (!blob) {
        return {
            thumbnail: createThumbnailFromUrl(input),
            metadata: { ...inputMetadata, ...metadata },
            type: '',
            blob: null,
            arrayBuffer: async () => new ArrayBuffer(0),
        };
    }
    if (!Validator.isValidMimeType(blob.type))
        throw new InvalidMimeTypeError(blob.type);
    return {
        thumbnail: createThumbnailFromBlob(blob, blob.type),
        metadata: { ...inputMetadata, ...metadata },
        type: blob.type,
        blob: blob,
        arrayBuffer: () => blob.arrayBuffer(),
    };
}
async function getDataFromInput(downloader, input, metadata) {
    if (input instanceof Blob) {
        // Handle file/blob inputs
        const finalMetadata = {
            ...metadata,
            filename: input instanceof File ? input.name : undefined,
        };
        return {
            blob: input,
            metadata: finalMetadata,
        };
    }
    else {
        // handle string / HTMLImageElement inputs
        const url = typeof input === 'string' ? input : input.src;
        const blob = await downloader.inspect(url);
        let path = url;
        try {
            const { pathname } = new URL(url);
            path = pathname;
        }
        catch (err) { }
        const filename = path.split('/').pop() ?? '';
        return {
            blob,
            metadata: { ...metadata, filename },
        };
    }
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const dbg$1 = debug('c2pa');
const dbgTask = debug('c2pa:task');
/**
 * Creates a c2pa object that can be used to read c2pa metadata from an image.
 *
 * @param config - Configuration options for the created c2pa object
 */
async function createC2pa(config) {
    let jobCounter = 0;
    dbg$1('Creating c2pa with config', config);
    ensureCompatibility();
    const pool = await createPoolWrapper({
        scriptSrc: config.workerSrc,
        maxWorkers: navigator.hardwareConcurrency || 4,
    });
    const downloader = new Downloader(pool, config.downloaderOptions);
    const wasm = config.wasmSrc instanceof WebAssembly.Module
        ? config.wasmSrc
        : await fetchWasm(pool, config.wasmSrc);
    const read = async (input) => {
        const jobId = ++jobCounter;
        dbgTask('[%s] Reading from input', jobId, input);
        const source = await createSource(downloader, input);
        dbgTask('[%s] Processing input', jobId, input);
        if (!source.blob) {
            return {
                manifestStore: null,
                source,
            };
        }
        const buffer = await source.arrayBuffer();
        try {
            const result = await pool.getReport(wasm, buffer, source.type);
            dbgTask('[%s] Received worker result', jobId, result);
            return {
                manifestStore: createManifestStore(result),
                source,
            };
        }
        catch (err) {
            const manifestStore = await handleErrors(source, err, pool, wasm, config.fetchRemoteManifests);
            return {
                manifestStore,
                source,
            };
        }
    };
    const readAll = async (inputs) => Promise.all(inputs.map((input) => read(input)));
    return {
        read,
        readAll,
        dispose: () => pool.dispose(),
    };
}
/**
 * Generates a URL that pre-loads the `assetUrl` into the Content Authenticity Verify site
 * for deeper inspection by users.
 *
 * @param assetUrl - The URL of the asset you want to view in Verify
 */
function generateVerifyUrl(assetUrl) {
    const url = new URL('https://verify.contentauthenticity.org/inspect');
    url.searchParams.set('source', assetUrl);
    return url.toString();
}
/**
 * Regular expression list of error names that we can ignore and still display the asset
 * even though we can't inspect Content Credentials
 */
const ignoreErrors = [
    // No embedded or remote provenance found in the asset
    /^C2pa\(ProvenanceMissing\)$/,
    // Could not parse JUMBF data
    /^C2pa\(JumbfParseError\([^\)]+\)\)$/,
    // JUMBF or required box not found
    /^C2pa\(Jumbf(?:Box)?NotFound\)$/,
];
/**
 * Handles errors from the toolkit and fetches/processes remote manifests, if applicable.
 *
 * @param source - Source object representing the asset
 * @param error - Error from toolkit
 * @param pool - Worker pool to use when processing remote manifests (triggered by Toolkit(RemoteManifestUrl) error)
 * @param wasm - WASM module to use when processing remote manifests
 * @param fetchRemote - Controls remote-fetching behavior
 * @returns A manifestStore, if applicable, null otherwise or a re-thrown error.
 */
function handleErrors(source, error, pool, wasm, fetchRemote = true) {
    if (error.name === 'Toolkit(RemoteManifestUrl)') {
        if (fetchRemote && error.url) {
            return fetchRemoteManifest(source, error.url, pool, wasm);
        }
        return null;
    }
    if (ignoreErrors.some((re) => re.test(error.name))) {
        dbg$1('Missing or invalid provenance data found', { error: error.name });
        return null;
    }
    throw error;
}
async function fetchRemoteManifest(source, manifestUrl, pool, wasm) {
    try {
        const url = new URL(manifestUrl);
        dbg$1('Fetching remote manifest from', url);
        if (!source.blob) {
            dbg$1('No blob found on source, skipping remote manifest loading', source);
            throw new InvalidInputError();
        }
        const manifestBytes = await fetch(url.toString());
        const manifestBlob = await manifestBytes.blob();
        const manifestBuffer = await manifestBlob.arrayBuffer();
        const result = await pool.getReportFromAssetAndManifestBuffer(wasm, manifestBuffer, source.blob);
        return createManifestStore(result);
    }
    catch (err) {
        if (err instanceof TypeError) {
            dbg$1('Invalid URL given, skipping remote manifest loading', manifestUrl);
            return null;
        }
        dbg$1('Error loading remote manifest from', manifestUrl, err);
        throw err;
    }
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Gets the producer of this manifest, derived from its `stds.schema-org.CreativeWork` assertion, if available
 *
 * @param manifest - Manifest to derive data from
 */
function selectProducer(manifest) {
    const [cwAssertion] = manifest.assertions.get('stds.schema-org.CreativeWork');
    if (!cwAssertion) {
        return null;
    }
    const producer = cwAssertion.data.author?.find((x) => !x.hasOwnProperty('@id'));
    return producer ?? null;
}

var each$1 = {exports: {}};

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */

function arrayEach$3(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach$3;

var overArg = _overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$1 = overArg(Object.keys, Object);

var _nativeKeys = nativeKeys$1;

var isPrototype = _isPrototype,
    nativeKeys = _nativeKeys;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys$1;

var arrayLikeKeys = _arrayLikeKeys,
    baseKeys = _baseKeys,
    isArrayLike$1 = isArrayLike_1;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$5(object) {
  return isArrayLike$1(object) ? arrayLikeKeys(object) : baseKeys(object);
}

var keys_1 = keys$5;

var baseFor = _baseFor,
    keys$4 = keys_1;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn$2(object, iteratee) {
  return object && baseFor(object, iteratee, keys$4);
}

var _baseForOwn = baseForOwn$2;

var isArrayLike = isArrayLike_1;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach$1(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach$1;

var baseForOwn$1 = _baseForOwn,
    createBaseEach = _createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach$1 = createBaseEach(baseForOwn$1);

var _baseEach = baseEach$1;

var identity$2 = identity_1;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction$1(value) {
  return typeof value == 'function' ? value : identity$2;
}

var _castFunction = castFunction$1;

var arrayEach$2 = _arrayEach,
    baseEach = _baseEach,
    castFunction = _castFunction,
    isArray$9 = isArray_1;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray$9(collection) ? arrayEach$2 : baseEach;
  return func(collection, castFunction(iteratee));
}

var forEach_1 = forEach;

(function (module) {
	module.exports = forEach_1;
} (each$1));

var each = /*@__PURE__*/getDefaultExportFromCjs(each$1.exports);

var _mapping = {};

/** Used to map aliases to their real names. */

(function (exports) {
	exports.aliasToReal = {

	  // Lodash aliases.
	  'each': 'forEach',
	  'eachRight': 'forEachRight',
	  'entries': 'toPairs',
	  'entriesIn': 'toPairsIn',
	  'extend': 'assignIn',
	  'extendAll': 'assignInAll',
	  'extendAllWith': 'assignInAllWith',
	  'extendWith': 'assignInWith',
	  'first': 'head',

	  // Methods that are curried variants of others.
	  'conforms': 'conformsTo',
	  'matches': 'isMatch',
	  'property': 'get',

	  // Ramda aliases.
	  '__': 'placeholder',
	  'F': 'stubFalse',
	  'T': 'stubTrue',
	  'all': 'every',
	  'allPass': 'overEvery',
	  'always': 'constant',
	  'any': 'some',
	  'anyPass': 'overSome',
	  'apply': 'spread',
	  'assoc': 'set',
	  'assocPath': 'set',
	  'complement': 'negate',
	  'compose': 'flowRight',
	  'contains': 'includes',
	  'dissoc': 'unset',
	  'dissocPath': 'unset',
	  'dropLast': 'dropRight',
	  'dropLastWhile': 'dropRightWhile',
	  'equals': 'isEqual',
	  'identical': 'eq',
	  'indexBy': 'keyBy',
	  'init': 'initial',
	  'invertObj': 'invert',
	  'juxt': 'over',
	  'omitAll': 'omit',
	  'nAry': 'ary',
	  'path': 'get',
	  'pathEq': 'matchesProperty',
	  'pathOr': 'getOr',
	  'paths': 'at',
	  'pickAll': 'pick',
	  'pipe': 'flow',
	  'pluck': 'map',
	  'prop': 'get',
	  'propEq': 'matchesProperty',
	  'propOr': 'getOr',
	  'props': 'at',
	  'symmetricDifference': 'xor',
	  'symmetricDifferenceBy': 'xorBy',
	  'symmetricDifferenceWith': 'xorWith',
	  'takeLast': 'takeRight',
	  'takeLastWhile': 'takeRightWhile',
	  'unapply': 'rest',
	  'unnest': 'flatten',
	  'useWith': 'overArgs',
	  'where': 'conformsTo',
	  'whereEq': 'isMatch',
	  'zipObj': 'zipObject'
	};

	/** Used to map ary to method names. */
	exports.aryMethod = {
	  '1': [
	    'assignAll', 'assignInAll', 'attempt', 'castArray', 'ceil', 'create',
	    'curry', 'curryRight', 'defaultsAll', 'defaultsDeepAll', 'floor', 'flow',
	    'flowRight', 'fromPairs', 'invert', 'iteratee', 'memoize', 'method', 'mergeAll',
	    'methodOf', 'mixin', 'nthArg', 'over', 'overEvery', 'overSome','rest', 'reverse',
	    'round', 'runInContext', 'spread', 'template', 'trim', 'trimEnd', 'trimStart',
	    'uniqueId', 'words', 'zipAll'
	  ],
	  '2': [
	    'add', 'after', 'ary', 'assign', 'assignAllWith', 'assignIn', 'assignInAllWith',
	    'at', 'before', 'bind', 'bindAll', 'bindKey', 'chunk', 'cloneDeepWith',
	    'cloneWith', 'concat', 'conformsTo', 'countBy', 'curryN', 'curryRightN',
	    'debounce', 'defaults', 'defaultsDeep', 'defaultTo', 'delay', 'difference',
	    'divide', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'endsWith', 'eq',
	    'every', 'filter', 'find', 'findIndex', 'findKey', 'findLast', 'findLastIndex',
	    'findLastKey', 'flatMap', 'flatMapDeep', 'flattenDepth', 'forEach',
	    'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'get',
	    'groupBy', 'gt', 'gte', 'has', 'hasIn', 'includes', 'indexOf', 'intersection',
	    'invertBy', 'invoke', 'invokeMap', 'isEqual', 'isMatch', 'join', 'keyBy',
	    'lastIndexOf', 'lt', 'lte', 'map', 'mapKeys', 'mapValues', 'matchesProperty',
	    'maxBy', 'meanBy', 'merge', 'mergeAllWith', 'minBy', 'multiply', 'nth', 'omit',
	    'omitBy', 'overArgs', 'pad', 'padEnd', 'padStart', 'parseInt', 'partial',
	    'partialRight', 'partition', 'pick', 'pickBy', 'propertyOf', 'pull', 'pullAll',
	    'pullAt', 'random', 'range', 'rangeRight', 'rearg', 'reject', 'remove',
	    'repeat', 'restFrom', 'result', 'sampleSize', 'some', 'sortBy', 'sortedIndex',
	    'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexOf', 'sortedUniqBy',
	    'split', 'spreadFrom', 'startsWith', 'subtract', 'sumBy', 'take', 'takeRight',
	    'takeRightWhile', 'takeWhile', 'tap', 'throttle', 'thru', 'times', 'trimChars',
	    'trimCharsEnd', 'trimCharsStart', 'truncate', 'union', 'uniqBy', 'uniqWith',
	    'unset', 'unzipWith', 'without', 'wrap', 'xor', 'zip', 'zipObject',
	    'zipObjectDeep'
	  ],
	  '3': [
	    'assignInWith', 'assignWith', 'clamp', 'differenceBy', 'differenceWith',
	    'findFrom', 'findIndexFrom', 'findLastFrom', 'findLastIndexFrom', 'getOr',
	    'includesFrom', 'indexOfFrom', 'inRange', 'intersectionBy', 'intersectionWith',
	    'invokeArgs', 'invokeArgsMap', 'isEqualWith', 'isMatchWith', 'flatMapDepth',
	    'lastIndexOfFrom', 'mergeWith', 'orderBy', 'padChars', 'padCharsEnd',
	    'padCharsStart', 'pullAllBy', 'pullAllWith', 'rangeStep', 'rangeStepRight',
	    'reduce', 'reduceRight', 'replace', 'set', 'slice', 'sortedIndexBy',
	    'sortedLastIndexBy', 'transform', 'unionBy', 'unionWith', 'update', 'xorBy',
	    'xorWith', 'zipWith'
	  ],
	  '4': [
	    'fill', 'setWith', 'updateWith'
	  ]
	};

	/** Used to map ary to rearg configs. */
	exports.aryRearg = {
	  '2': [1, 0],
	  '3': [2, 0, 1],
	  '4': [3, 2, 0, 1]
	};

	/** Used to map method names to their iteratee ary. */
	exports.iterateeAry = {
	  'dropRightWhile': 1,
	  'dropWhile': 1,
	  'every': 1,
	  'filter': 1,
	  'find': 1,
	  'findFrom': 1,
	  'findIndex': 1,
	  'findIndexFrom': 1,
	  'findKey': 1,
	  'findLast': 1,
	  'findLastFrom': 1,
	  'findLastIndex': 1,
	  'findLastIndexFrom': 1,
	  'findLastKey': 1,
	  'flatMap': 1,
	  'flatMapDeep': 1,
	  'flatMapDepth': 1,
	  'forEach': 1,
	  'forEachRight': 1,
	  'forIn': 1,
	  'forInRight': 1,
	  'forOwn': 1,
	  'forOwnRight': 1,
	  'map': 1,
	  'mapKeys': 1,
	  'mapValues': 1,
	  'partition': 1,
	  'reduce': 2,
	  'reduceRight': 2,
	  'reject': 1,
	  'remove': 1,
	  'some': 1,
	  'takeRightWhile': 1,
	  'takeWhile': 1,
	  'times': 1,
	  'transform': 2
	};

	/** Used to map method names to iteratee rearg configs. */
	exports.iterateeRearg = {
	  'mapKeys': [1],
	  'reduceRight': [1, 0]
	};

	/** Used to map method names to rearg configs. */
	exports.methodRearg = {
	  'assignInAllWith': [1, 0],
	  'assignInWith': [1, 2, 0],
	  'assignAllWith': [1, 0],
	  'assignWith': [1, 2, 0],
	  'differenceBy': [1, 2, 0],
	  'differenceWith': [1, 2, 0],
	  'getOr': [2, 1, 0],
	  'intersectionBy': [1, 2, 0],
	  'intersectionWith': [1, 2, 0],
	  'isEqualWith': [1, 2, 0],
	  'isMatchWith': [2, 1, 0],
	  'mergeAllWith': [1, 0],
	  'mergeWith': [1, 2, 0],
	  'padChars': [2, 1, 0],
	  'padCharsEnd': [2, 1, 0],
	  'padCharsStart': [2, 1, 0],
	  'pullAllBy': [2, 1, 0],
	  'pullAllWith': [2, 1, 0],
	  'rangeStep': [1, 2, 0],
	  'rangeStepRight': [1, 2, 0],
	  'setWith': [3, 1, 2, 0],
	  'sortedIndexBy': [2, 1, 0],
	  'sortedLastIndexBy': [2, 1, 0],
	  'unionBy': [1, 2, 0],
	  'unionWith': [1, 2, 0],
	  'updateWith': [3, 1, 2, 0],
	  'xorBy': [1, 2, 0],
	  'xorWith': [1, 2, 0],
	  'zipWith': [1, 2, 0]
	};

	/** Used to map method names to spread configs. */
	exports.methodSpread = {
	  'assignAll': { 'start': 0 },
	  'assignAllWith': { 'start': 0 },
	  'assignInAll': { 'start': 0 },
	  'assignInAllWith': { 'start': 0 },
	  'defaultsAll': { 'start': 0 },
	  'defaultsDeepAll': { 'start': 0 },
	  'invokeArgs': { 'start': 2 },
	  'invokeArgsMap': { 'start': 2 },
	  'mergeAll': { 'start': 0 },
	  'mergeAllWith': { 'start': 0 },
	  'partial': { 'start': 1 },
	  'partialRight': { 'start': 1 },
	  'without': { 'start': 1 },
	  'zipAll': { 'start': 0 }
	};

	/** Used to identify methods which mutate arrays or objects. */
	exports.mutate = {
	  'array': {
	    'fill': true,
	    'pull': true,
	    'pullAll': true,
	    'pullAllBy': true,
	    'pullAllWith': true,
	    'pullAt': true,
	    'remove': true,
	    'reverse': true
	  },
	  'object': {
	    'assign': true,
	    'assignAll': true,
	    'assignAllWith': true,
	    'assignIn': true,
	    'assignInAll': true,
	    'assignInAllWith': true,
	    'assignInWith': true,
	    'assignWith': true,
	    'defaults': true,
	    'defaultsAll': true,
	    'defaultsDeep': true,
	    'defaultsDeepAll': true,
	    'merge': true,
	    'mergeAll': true,
	    'mergeAllWith': true,
	    'mergeWith': true,
	  },
	  'set': {
	    'set': true,
	    'setWith': true,
	    'unset': true,
	    'update': true,
	    'updateWith': true
	  }
	};

	/** Used to map real names to their aliases. */
	exports.realToAlias = (function() {
	  var hasOwnProperty = Object.prototype.hasOwnProperty,
	      object = exports.aliasToReal,
	      result = {};

	  for (var key in object) {
	    var value = object[key];
	    if (hasOwnProperty.call(result, value)) {
	      result[value].push(key);
	    } else {
	      result[value] = [key];
	    }
	  }
	  return result;
	}());

	/** Used to map method names to other names. */
	exports.remap = {
	  'assignAll': 'assign',
	  'assignAllWith': 'assignWith',
	  'assignInAll': 'assignIn',
	  'assignInAllWith': 'assignInWith',
	  'curryN': 'curry',
	  'curryRightN': 'curryRight',
	  'defaultsAll': 'defaults',
	  'defaultsDeepAll': 'defaultsDeep',
	  'findFrom': 'find',
	  'findIndexFrom': 'findIndex',
	  'findLastFrom': 'findLast',
	  'findLastIndexFrom': 'findLastIndex',
	  'getOr': 'get',
	  'includesFrom': 'includes',
	  'indexOfFrom': 'indexOf',
	  'invokeArgs': 'invoke',
	  'invokeArgsMap': 'invokeMap',
	  'lastIndexOfFrom': 'lastIndexOf',
	  'mergeAll': 'merge',
	  'mergeAllWith': 'mergeWith',
	  'padChars': 'pad',
	  'padCharsEnd': 'padEnd',
	  'padCharsStart': 'padStart',
	  'propertyOf': 'get',
	  'rangeStep': 'range',
	  'rangeStepRight': 'rangeRight',
	  'restFrom': 'rest',
	  'spreadFrom': 'spread',
	  'trimChars': 'trim',
	  'trimCharsEnd': 'trimEnd',
	  'trimCharsStart': 'trimStart',
	  'zipAll': 'zip'
	};

	/** Used to track methods that skip fixing their arity. */
	exports.skipFixed = {
	  'castArray': true,
	  'flow': true,
	  'flowRight': true,
	  'iteratee': true,
	  'mixin': true,
	  'rearg': true,
	  'runInContext': true
	};

	/** Used to track methods that skip rearranging arguments. */
	exports.skipRearg = {
	  'add': true,
	  'assign': true,
	  'assignIn': true,
	  'bind': true,
	  'bindKey': true,
	  'concat': true,
	  'difference': true,
	  'divide': true,
	  'eq': true,
	  'gt': true,
	  'gte': true,
	  'isEqual': true,
	  'lt': true,
	  'lte': true,
	  'matchesProperty': true,
	  'merge': true,
	  'multiply': true,
	  'overArgs': true,
	  'partial': true,
	  'partialRight': true,
	  'propertyOf': true,
	  'random': true,
	  'range': true,
	  'rangeRight': true,
	  'subtract': true,
	  'zip': true,
	  'zipObject': true,
	  'zipObjectDeep': true
	};
} (_mapping));

/**
 * The default argument placeholder value for methods.
 *
 * @type {Object}
 */

var placeholder;
var hasRequiredPlaceholder;

function requirePlaceholder () {
	if (hasRequiredPlaceholder) return placeholder;
	hasRequiredPlaceholder = 1;
	placeholder = {};
	return placeholder;
}

var mapping = _mapping,
    fallbackHolder = requirePlaceholder();

/** Built-in value reference. */
var push = Array.prototype.push;

/**
 * Creates a function, with an arity of `n`, that invokes `func` with the
 * arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} n The arity of the new function.
 * @returns {Function} Returns the new function.
 */
function baseArity(func, n) {
  return n == 2
    ? function(a, b) { return func.apply(undefined, arguments); }
    : function(a) { return func.apply(undefined, arguments); };
}

/**
 * Creates a function that invokes `func`, with up to `n` arguments, ignoring
 * any additional arguments.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @param {number} n The arity cap.
 * @returns {Function} Returns the new function.
 */
function baseAry(func, n) {
  return n == 2
    ? function(a, b) { return func(a, b); }
    : function(a) { return func(a); };
}

/**
 * Creates a clone of `array`.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the cloned array.
 */
function cloneArray(array) {
  var length = array ? array.length : 0,
      result = Array(length);

  while (length--) {
    result[length] = array[length];
  }
  return result;
}

/**
 * Creates a function that clones a given object using the assignment `func`.
 *
 * @private
 * @param {Function} func The assignment function.
 * @returns {Function} Returns the new cloner function.
 */
function createCloner(func) {
  return function(object) {
    return func({}, object);
  };
}

/**
 * A specialized version of `_.spread` which flattens the spread array into
 * the arguments of the invoked `func`.
 *
 * @private
 * @param {Function} func The function to spread arguments over.
 * @param {number} start The start position of the spread.
 * @returns {Function} Returns the new function.
 */
function flatSpread(func, start) {
  return function() {
    var length = arguments.length,
        lastIndex = length - 1,
        args = Array(length);

    while (length--) {
      args[length] = arguments[length];
    }
    var array = args[start],
        otherArgs = args.slice(0, start);

    if (array) {
      push.apply(otherArgs, array);
    }
    if (start != lastIndex) {
      push.apply(otherArgs, args.slice(start + 1));
    }
    return func.apply(this, otherArgs);
  };
}

/**
 * Creates a function that wraps `func` and uses `cloner` to clone the first
 * argument it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} cloner The function to clone arguments.
 * @returns {Function} Returns the new immutable function.
 */
function wrapImmutable(func, cloner) {
  return function() {
    var length = arguments.length;
    if (!length) {
      return;
    }
    var args = Array(length);
    while (length--) {
      args[length] = arguments[length];
    }
    var result = args[0] = cloner.apply(undefined, args);
    func.apply(undefined, args);
    return result;
  };
}

/**
 * The base implementation of `convert` which accepts a `util` object of methods
 * required to perform conversions.
 *
 * @param {Object} util The util object.
 * @param {string} name The name of the function to convert.
 * @param {Function} func The function to convert.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.cap=true] Specify capping iteratee arguments.
 * @param {boolean} [options.curry=true] Specify currying.
 * @param {boolean} [options.fixed=true] Specify fixed arity.
 * @param {boolean} [options.immutable=true] Specify immutable operations.
 * @param {boolean} [options.rearg=true] Specify rearranging arguments.
 * @returns {Function|Object} Returns the converted function or object.
 */
function baseConvert$1(util, name, func, options) {
  var isLib = typeof name == 'function',
      isObj = name === Object(name);

  if (isObj) {
    options = func;
    func = name;
    name = undefined;
  }
  if (func == null) {
    throw new TypeError;
  }
  options || (options = {});

  var config = {
    'cap': 'cap' in options ? options.cap : true,
    'curry': 'curry' in options ? options.curry : true,
    'fixed': 'fixed' in options ? options.fixed : true,
    'immutable': 'immutable' in options ? options.immutable : true,
    'rearg': 'rearg' in options ? options.rearg : true
  };

  var defaultHolder = isLib ? func : fallbackHolder,
      forceCurry = ('curry' in options) && options.curry,
      forceFixed = ('fixed' in options) && options.fixed,
      forceRearg = ('rearg' in options) && options.rearg,
      pristine = isLib ? func.runInContext() : undefined;

  var helpers = isLib ? func : {
    'ary': util.ary,
    'assign': util.assign,
    'clone': util.clone,
    'curry': util.curry,
    'forEach': util.forEach,
    'isArray': util.isArray,
    'isError': util.isError,
    'isFunction': util.isFunction,
    'isWeakMap': util.isWeakMap,
    'iteratee': util.iteratee,
    'keys': util.keys,
    'rearg': util.rearg,
    'toInteger': util.toInteger,
    'toPath': util.toPath
  };

  var ary = helpers.ary,
      assign = helpers.assign,
      clone = helpers.clone,
      curry = helpers.curry,
      each = helpers.forEach,
      isArray = helpers.isArray,
      isError = helpers.isError,
      isFunction = helpers.isFunction,
      isWeakMap = helpers.isWeakMap,
      keys = helpers.keys,
      rearg = helpers.rearg,
      toInteger = helpers.toInteger,
      toPath = helpers.toPath;

  var aryMethodKeys = keys(mapping.aryMethod);

  var wrappers = {
    'castArray': function(castArray) {
      return function() {
        var value = arguments[0];
        return isArray(value)
          ? castArray(cloneArray(value))
          : castArray.apply(undefined, arguments);
      };
    },
    'iteratee': function(iteratee) {
      return function() {
        var func = arguments[0],
            arity = arguments[1],
            result = iteratee(func, arity),
            length = result.length;

        if (config.cap && typeof arity == 'number') {
          arity = arity > 2 ? (arity - 2) : 1;
          return (length && length <= arity) ? result : baseAry(result, arity);
        }
        return result;
      };
    },
    'mixin': function(mixin) {
      return function(source) {
        var func = this;
        if (!isFunction(func)) {
          return mixin(func, Object(source));
        }
        var pairs = [];
        each(keys(source), function(key) {
          if (isFunction(source[key])) {
            pairs.push([key, func.prototype[key]]);
          }
        });

        mixin(func, Object(source));

        each(pairs, function(pair) {
          var value = pair[1];
          if (isFunction(value)) {
            func.prototype[pair[0]] = value;
          } else {
            delete func.prototype[pair[0]];
          }
        });
        return func;
      };
    },
    'nthArg': function(nthArg) {
      return function(n) {
        var arity = n < 0 ? 1 : (toInteger(n) + 1);
        return curry(nthArg(n), arity);
      };
    },
    'rearg': function(rearg) {
      return function(func, indexes) {
        var arity = indexes ? indexes.length : 0;
        return curry(rearg(func, indexes), arity);
      };
    },
    'runInContext': function(runInContext) {
      return function(context) {
        return baseConvert$1(util, runInContext(context), options);
      };
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Casts `func` to a function with an arity capped iteratee if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @returns {Function} Returns the cast function.
   */
  function castCap(name, func) {
    if (config.cap) {
      var indexes = mapping.iterateeRearg[name];
      if (indexes) {
        return iterateeRearg(func, indexes);
      }
      var n = !isLib && mapping.iterateeAry[name];
      if (n) {
        return iterateeAry(func, n);
      }
    }
    return func;
  }

  /**
   * Casts `func` to a curried function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castCurry(name, func, n) {
    return (forceCurry || (config.curry && n > 1))
      ? curry(func, n)
      : func;
  }

  /**
   * Casts `func` to a fixed arity function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the cast function.
   */
  function castFixed(name, func, n) {
    if (config.fixed && (forceFixed || !mapping.skipFixed[name])) {
      var data = mapping.methodSpread[name],
          start = data && data.start;

      return start  === undefined ? ary(func, n) : flatSpread(func, start);
    }
    return func;
  }

  /**
   * Casts `func` to an rearged function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castRearg(name, func, n) {
    return (config.rearg && n > 1 && (forceRearg || !mapping.skipRearg[name]))
      ? rearg(func, mapping.methodRearg[name] || mapping.aryRearg[n])
      : func;
  }

  /**
   * Creates a clone of `object` by `path`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {Array|string} path The path to clone by.
   * @returns {Object} Returns the cloned object.
   */
  function cloneByPath(object, path) {
    path = toPath(path);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        result = clone(Object(object)),
        nested = result;

    while (nested != null && ++index < length) {
      var key = path[index],
          value = nested[key];

      if (value != null &&
          !(isFunction(value) || isError(value) || isWeakMap(value))) {
        nested[key] = clone(index == lastIndex ? value : Object(value));
      }
      nested = nested[key];
    }
    return result;
  }

  /**
   * Converts `lodash` to an immutable auto-curried iteratee-first data-last
   * version with conversion `options` applied.
   *
   * @param {Object} [options] The options object. See `baseConvert` for more details.
   * @returns {Function} Returns the converted `lodash`.
   */
  function convertLib(options) {
    return _.runInContext.convert(options)(undefined);
  }

  /**
   * Create a converter function for `func` of `name`.
   *
   * @param {string} name The name of the function to convert.
   * @param {Function} func The function to convert.
   * @returns {Function} Returns the new converter function.
   */
  function createConverter(name, func) {
    var realName = mapping.aliasToReal[name] || name,
        methodName = mapping.remap[realName] || realName,
        oldOptions = options;

    return function(options) {
      var newUtil = isLib ? pristine : helpers,
          newFunc = isLib ? pristine[methodName] : func,
          newOptions = assign(assign({}, oldOptions), options);

      return baseConvert$1(newUtil, realName, newFunc, newOptions);
    };
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee, with up to `n`
   * arguments, ignoring any additional arguments.
   *
   * @private
   * @param {Function} func The function to cap iteratee arguments for.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the new function.
   */
  function iterateeAry(func, n) {
    return overArg(func, function(func) {
      return typeof func == 'function' ? baseAry(func, n) : func;
    });
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee with arguments
   * arranged according to the specified `indexes` where the argument value at
   * the first index is provided as the first argument, the argument value at
   * the second index is provided as the second argument, and so on.
   *
   * @private
   * @param {Function} func The function to rearrange iteratee arguments for.
   * @param {number[]} indexes The arranged argument indexes.
   * @returns {Function} Returns the new function.
   */
  function iterateeRearg(func, indexes) {
    return overArg(func, function(func) {
      var n = indexes.length;
      return baseArity(rearg(baseAry(func, n), indexes), n);
    });
  }

  /**
   * Creates a function that invokes `func` with its first argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function() {
      var length = arguments.length;
      if (!length) {
        return func();
      }
      var args = Array(length);
      while (length--) {
        args[length] = arguments[length];
      }
      var index = config.rearg ? 0 : (length - 1);
      args[index] = transform(args[index]);
      return func.apply(undefined, args);
    };
  }

  /**
   * Creates a function that wraps `func` and applys the conversions
   * rules by `name`.
   *
   * @private
   * @param {string} name The name of the function to wrap.
   * @param {Function} func The function to wrap.
   * @returns {Function} Returns the converted function.
   */
  function wrap(name, func, placeholder) {
    var result,
        realName = mapping.aliasToReal[name] || name,
        wrapped = func,
        wrapper = wrappers[realName];

    if (wrapper) {
      wrapped = wrapper(func);
    }
    else if (config.immutable) {
      if (mapping.mutate.array[realName]) {
        wrapped = wrapImmutable(func, cloneArray);
      }
      else if (mapping.mutate.object[realName]) {
        wrapped = wrapImmutable(func, createCloner(func));
      }
      else if (mapping.mutate.set[realName]) {
        wrapped = wrapImmutable(func, cloneByPath);
      }
    }
    each(aryMethodKeys, function(aryKey) {
      each(mapping.aryMethod[aryKey], function(otherName) {
        if (realName == otherName) {
          var data = mapping.methodSpread[realName],
              afterRearg = data && data.afterRearg;

          result = afterRearg
            ? castFixed(realName, castRearg(realName, wrapped, aryKey), aryKey)
            : castRearg(realName, castFixed(realName, wrapped, aryKey), aryKey);

          result = castCap(realName, result);
          result = castCurry(realName, result, aryKey);
          return false;
        }
      });
      return !result;
    });

    result || (result = wrapped);
    if (result == func) {
      result = forceCurry ? curry(result, 1) : function() {
        return func.apply(this, arguments);
      };
    }
    result.convert = createConverter(realName, func);
    result.placeholder = func.placeholder = placeholder;

    return result;
  }

  /*--------------------------------------------------------------------------*/

  if (!isObj) {
    return wrap(name, func, defaultHolder);
  }
  var _ = func;

  // Convert methods by ary cap.
  var pairs = [];
  each(aryMethodKeys, function(aryKey) {
    each(mapping.aryMethod[aryKey], function(key) {
      var func = _[mapping.remap[key] || key];
      if (func) {
        pairs.push([key, wrap(key, func, _)]);
      }
    });
  });

  // Convert remaining methods.
  each(keys(_), function(key) {
    var func = _[key];
    if (typeof func == 'function') {
      var length = pairs.length;
      while (length--) {
        if (pairs[length][0] == key) {
          return;
        }
      }
      func.convert = createConverter(key, func);
      pairs.push([key, func]);
    }
  });

  // Assign to `_` leaving `_.prototype` unchanged to allow chaining.
  each(pairs, function(pair) {
    _[pair[0]] = pair[1];
  });

  _.convert = convertLib;
  _.placeholder = _;

  // Assign aliases.
  each(keys(_), function(key) {
    each(mapping.realToAlias[key] || [], function(alias) {
      _[alias] = _[key];
    });
  });

  return _;
}

var _baseConvert = baseConvert$1;

var getNative$2 = _getNative,
    root$6 = _root;

/* Built-in method references that are verified to be native. */
var WeakMap$2 = getNative$2(root$6, 'WeakMap');

var _WeakMap = WeakMap$2;

var _metaMap;
var hasRequired_metaMap;

function require_metaMap () {
	if (hasRequired_metaMap) return _metaMap;
	hasRequired_metaMap = 1;
	var WeakMap = _WeakMap;

	/** Used to store function metadata. */
	var metaMap = WeakMap && new WeakMap;

	_metaMap = metaMap;
	return _metaMap;
}

var identity$1 = identity_1,
    metaMap = require_metaMap();

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData$2 = !metaMap ? identity$1 : function(func, data) {
  metaMap.set(func, data);
  return func;
};

var _baseSetData = baseSetData$2;

var baseCreate = _baseCreate,
    isObject$4 = isObject_1;

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor$4(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject$4(result) ? result : thisBinding;
  };
}

var _createCtor = createCtor$4;

var createCtor$3 = _createCtor,
    root$5 = _root;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$6 = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind$1(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG$6,
      Ctor = createCtor$3(func);

  function wrapper() {
    var fn = (this && this !== root$5 && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

var _createBind = createBind$1;

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax$2 = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs$2(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax$2(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

var _composeArgs = composeArgs$2;

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax$1 = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight$2(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax$1(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

var _composeArgsRight = composeArgsRight$2;

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */

function countHolders$1(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

var _countHolders = countHolders$1;

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */

var _baseLodash;
var hasRequired_baseLodash;

function require_baseLodash () {
	if (hasRequired_baseLodash) return _baseLodash;
	hasRequired_baseLodash = 1;
	function baseLodash() {
	  // No operation performed.
	}

	_baseLodash = baseLodash;
	return _baseLodash;
}

var _LazyWrapper;
var hasRequired_LazyWrapper;

function require_LazyWrapper () {
	if (hasRequired_LazyWrapper) return _LazyWrapper;
	hasRequired_LazyWrapper = 1;
	var baseCreate = _baseCreate,
	    baseLodash = require_baseLodash();

	/** Used as references for the maximum length and index of an array. */
	var MAX_ARRAY_LENGTH = 4294967295;

	/**
	 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	 *
	 * @private
	 * @constructor
	 * @param {*} value The value to wrap.
	 */
	function LazyWrapper(value) {
	  this.__wrapped__ = value;
	  this.__actions__ = [];
	  this.__dir__ = 1;
	  this.__filtered__ = false;
	  this.__iteratees__ = [];
	  this.__takeCount__ = MAX_ARRAY_LENGTH;
	  this.__views__ = [];
	}

	// Ensure `LazyWrapper` is an instance of `baseLodash`.
	LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	LazyWrapper.prototype.constructor = LazyWrapper;

	_LazyWrapper = LazyWrapper;
	return _LazyWrapper;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */

var noop_1;
var hasRequiredNoop;

function requireNoop () {
	if (hasRequiredNoop) return noop_1;
	hasRequiredNoop = 1;
	function noop() {
	  // No operation performed.
	}

	noop_1 = noop;
	return noop_1;
}

var _getData;
var hasRequired_getData;

function require_getData () {
	if (hasRequired_getData) return _getData;
	hasRequired_getData = 1;
	var metaMap = require_metaMap(),
	    noop = requireNoop();

	/**
	 * Gets metadata for `func`.
	 *
	 * @private
	 * @param {Function} func The function to query.
	 * @returns {*} Returns the metadata for `func`.
	 */
	var getData = !metaMap ? noop : function(func) {
	  return metaMap.get(func);
	};

	_getData = getData;
	return _getData;
}

/** Used to lookup unminified function names. */

var _realNames;
var hasRequired_realNames;

function require_realNames () {
	if (hasRequired_realNames) return _realNames;
	hasRequired_realNames = 1;
	var realNames = {};

	_realNames = realNames;
	return _realNames;
}

var _getFuncName;
var hasRequired_getFuncName;

function require_getFuncName () {
	if (hasRequired_getFuncName) return _getFuncName;
	hasRequired_getFuncName = 1;
	var realNames = require_realNames();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the name of `func`.
	 *
	 * @private
	 * @param {Function} func The function to query.
	 * @returns {string} Returns the function name.
	 */
	function getFuncName(func) {
	  var result = (func.name + ''),
	      array = realNames[result],
	      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

	  while (length--) {
	    var data = array[length],
	        otherFunc = data.func;
	    if (otherFunc == null || otherFunc == func) {
	      return data.name;
	    }
	  }
	  return result;
	}

	_getFuncName = getFuncName;
	return _getFuncName;
}

var _LodashWrapper;
var hasRequired_LodashWrapper;

function require_LodashWrapper () {
	if (hasRequired_LodashWrapper) return _LodashWrapper;
	hasRequired_LodashWrapper = 1;
	var baseCreate = _baseCreate,
	    baseLodash = require_baseLodash();

	/**
	 * The base constructor for creating `lodash` wrapper objects.
	 *
	 * @private
	 * @param {*} value The value to wrap.
	 * @param {boolean} [chainAll] Enable explicit method chain sequences.
	 */
	function LodashWrapper(value, chainAll) {
	  this.__wrapped__ = value;
	  this.__actions__ = [];
	  this.__chain__ = !!chainAll;
	  this.__index__ = 0;
	  this.__values__ = undefined;
	}

	LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	LodashWrapper.prototype.constructor = LodashWrapper;

	_LodashWrapper = LodashWrapper;
	return _LodashWrapper;
}

var _wrapperClone;
var hasRequired_wrapperClone;

function require_wrapperClone () {
	if (hasRequired_wrapperClone) return _wrapperClone;
	hasRequired_wrapperClone = 1;
	var LazyWrapper = require_LazyWrapper(),
	    LodashWrapper = require_LodashWrapper(),
	    copyArray = _copyArray;

	/**
	 * Creates a clone of `wrapper`.
	 *
	 * @private
	 * @param {Object} wrapper The wrapper to clone.
	 * @returns {Object} Returns the cloned wrapper.
	 */
	function wrapperClone(wrapper) {
	  if (wrapper instanceof LazyWrapper) {
	    return wrapper.clone();
	  }
	  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	  result.__actions__ = copyArray(wrapper.__actions__);
	  result.__index__  = wrapper.__index__;
	  result.__values__ = wrapper.__values__;
	  return result;
	}

	_wrapperClone = wrapperClone;
	return _wrapperClone;
}

var wrapperLodash;
var hasRequiredWrapperLodash;

function requireWrapperLodash () {
	if (hasRequiredWrapperLodash) return wrapperLodash;
	hasRequiredWrapperLodash = 1;
	var LazyWrapper = require_LazyWrapper(),
	    LodashWrapper = require_LodashWrapper(),
	    baseLodash = require_baseLodash(),
	    isArray = isArray_1,
	    isObjectLike = isObjectLike_1,
	    wrapperClone = require_wrapperClone();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates a `lodash` object which wraps `value` to enable implicit method
	 * chain sequences. Methods that operate on and return arrays, collections,
	 * and functions can be chained together. Methods that retrieve a single value
	 * or may return a primitive value will automatically end the chain sequence
	 * and return the unwrapped value. Otherwise, the value must be unwrapped
	 * with `_#value`.
	 *
	 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
	 * enabled using `_.chain`.
	 *
	 * The execution of chained methods is lazy, that is, it's deferred until
	 * `_#value` is implicitly or explicitly called.
	 *
	 * Lazy evaluation allows several methods to support shortcut fusion.
	 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
	 * the creation of intermediate arrays and can greatly reduce the number of
	 * iteratee executions. Sections of a chain sequence qualify for shortcut
	 * fusion if the section is applied to an array and iteratees accept only
	 * one argument. The heuristic for whether a section qualifies for shortcut
	 * fusion is subject to change.
	 *
	 * Chaining is supported in custom builds as long as the `_#value` method is
	 * directly or indirectly included in the build.
	 *
	 * In addition to lodash methods, wrappers have `Array` and `String` methods.
	 *
	 * The wrapper `Array` methods are:
	 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	 *
	 * The wrapper `String` methods are:
	 * `replace` and `split`
	 *
	 * The wrapper methods that support shortcut fusion are:
	 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	 *
	 * The chainable wrapper methods are:
	 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
	 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
	 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
	 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
	 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
	 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
	 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
	 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
	 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
	 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
	 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
	 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
	 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
	 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
	 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
	 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
	 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
	 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
	 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
	 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
	 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
	 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
	 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
	 * `zipObject`, `zipObjectDeep`, and `zipWith`
	 *
	 * The wrapper methods that are **not** chainable by default are:
	 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
	 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
	 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
	 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
	 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
	 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
	 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
	 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
	 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
	 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
	 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
	 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
	 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
	 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
	 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
	 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
	 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
	 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
	 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
	 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
	 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
	 * `upperFirst`, `value`, and `words`
	 *
	 * @name _
	 * @constructor
	 * @category Seq
	 * @param {*} value The value to wrap in a `lodash` instance.
	 * @returns {Object} Returns the new `lodash` wrapper instance.
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * var wrapped = _([1, 2, 3]);
	 *
	 * // Returns an unwrapped value.
	 * wrapped.reduce(_.add);
	 * // => 6
	 *
	 * // Returns a wrapped value.
	 * var squares = wrapped.map(square);
	 *
	 * _.isArray(squares);
	 * // => false
	 *
	 * _.isArray(squares.value());
	 * // => true
	 */
	function lodash(value) {
	  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	    if (value instanceof LodashWrapper) {
	      return value;
	    }
	    if (hasOwnProperty.call(value, '__wrapped__')) {
	      return wrapperClone(value);
	    }
	  }
	  return new LodashWrapper(value);
	}

	// Ensure wrappers are instances of `baseLodash`.
	lodash.prototype = baseLodash.prototype;
	lodash.prototype.constructor = lodash;

	wrapperLodash = lodash;
	return wrapperLodash;
}

var _isLaziable;
var hasRequired_isLaziable;

function require_isLaziable () {
	if (hasRequired_isLaziable) return _isLaziable;
	hasRequired_isLaziable = 1;
	var LazyWrapper = require_LazyWrapper(),
	    getData = require_getData(),
	    getFuncName = require_getFuncName(),
	    lodash = requireWrapperLodash();

	/**
	 * Checks if `func` has a lazy counterpart.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
	 *  else `false`.
	 */
	function isLaziable(func) {
	  var funcName = getFuncName(func),
	      other = lodash[funcName];

	  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
	    return false;
	  }
	  if (func === other) {
	    return true;
	  }
	  var data = getData(other);
	  return !!data && func === data[0];
	}

	_isLaziable = isLaziable;
	return _isLaziable;
}

var baseSetData$1 = _baseSetData,
    shortOut = _shortOut;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData$2 = shortOut(baseSetData$1);

var _setData = setData$2;

/** Used to match wrap detail comments. */

var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails$1(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

var _getWrapDetails = getWrapDetails$1;

/** Used to match wrap detail comments. */

var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails$1(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

var _insertWrapDetails = insertWrapDetails$1;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

var _baseFindIndex;
var hasRequired_baseFindIndex;

function require_baseFindIndex () {
	if (hasRequired_baseFindIndex) return _baseFindIndex;
	hasRequired_baseFindIndex = 1;
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	_baseFindIndex = baseFindIndex;
	return _baseFindIndex;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */

var _baseIsNaN;
var hasRequired_baseIsNaN;

function require_baseIsNaN () {
	if (hasRequired_baseIsNaN) return _baseIsNaN;
	hasRequired_baseIsNaN = 1;
	function baseIsNaN(value) {
	  return value !== value;
	}

	_baseIsNaN = baseIsNaN;
	return _baseIsNaN;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

var _strictIndexOf;
var hasRequired_strictIndexOf;

function require_strictIndexOf () {
	if (hasRequired_strictIndexOf) return _strictIndexOf;
	hasRequired_strictIndexOf = 1;
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	_strictIndexOf = strictIndexOf;
	return _strictIndexOf;
}

var _baseIndexOf;
var hasRequired_baseIndexOf;

function require_baseIndexOf () {
	if (hasRequired_baseIndexOf) return _baseIndexOf;
	hasRequired_baseIndexOf = 1;
	var baseFindIndex = require_baseFindIndex(),
	    baseIsNaN = require_baseIsNaN(),
	    strictIndexOf = require_strictIndexOf();

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}

	_baseIndexOf = baseIndexOf;
	return _baseIndexOf;
}

var _arrayIncludes;
var hasRequired_arrayIncludes;

function require_arrayIncludes () {
	if (hasRequired_arrayIncludes) return _arrayIncludes;
	hasRequired_arrayIncludes = 1;
	var baseIndexOf = require_baseIndexOf();

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}

	_arrayIncludes = arrayIncludes;
	return _arrayIncludes;
}

var arrayEach$1 = _arrayEach,
    arrayIncludes = require_arrayIncludes();

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$5 = 1,
    WRAP_BIND_KEY_FLAG$4 = 2,
    WRAP_CURRY_FLAG$5 = 8,
    WRAP_CURRY_RIGHT_FLAG$2 = 16,
    WRAP_PARTIAL_FLAG$2 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$2 = 64,
    WRAP_ARY_FLAG$3 = 128,
    WRAP_REARG_FLAG$2 = 256,
    WRAP_FLIP_FLAG$1 = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', WRAP_ARY_FLAG$3],
  ['bind', WRAP_BIND_FLAG$5],
  ['bindKey', WRAP_BIND_KEY_FLAG$4],
  ['curry', WRAP_CURRY_FLAG$5],
  ['curryRight', WRAP_CURRY_RIGHT_FLAG$2],
  ['flip', WRAP_FLIP_FLAG$1],
  ['partial', WRAP_PARTIAL_FLAG$2],
  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG$2],
  ['rearg', WRAP_REARG_FLAG$2]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails$1(details, bitmask) {
  arrayEach$1(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

var _updateWrapDetails = updateWrapDetails$1;

var getWrapDetails = _getWrapDetails,
    insertWrapDetails = _insertWrapDetails,
    setToString = _setToString,
    updateWrapDetails = _updateWrapDetails;

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString$2(wrapper, reference, bitmask) {
  var source = (reference + '');
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}

var _setWrapToString = setWrapToString$2;

var isLaziable = require_isLaziable(),
    setData$1 = _setData,
    setWrapToString$1 = _setWrapToString;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$4 = 1,
    WRAP_BIND_KEY_FLAG$3 = 2,
    WRAP_CURRY_BOUND_FLAG$1 = 4,
    WRAP_CURRY_FLAG$4 = 8,
    WRAP_PARTIAL_FLAG$1 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$1 = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry$2(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG$4,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1);
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) {
    bitmask &= ~(WRAP_BIND_FLAG$4 | WRAP_BIND_KEY_FLAG$3);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData$1(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString$1(result, func, bitmask);
}

var _createRecurry = createRecurry$2;

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */

function getHolder$2(func) {
  var object = func;
  return object.placeholder;
}

var _getHolder = getHolder$2;

var copyArray$2 = _copyArray,
    isIndex$2 = _isIndex;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$1 = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder$1(array, indexes) {
  var arrLength = array.length,
      length = nativeMin$1(indexes.length, arrLength),
      oldArray = copyArray$2(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex$2(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

var _reorder = reorder$1;

/** Used as the internal argument placeholder. */

var PLACEHOLDER$1 = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders$3(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER$1) {
      array[index] = PLACEHOLDER$1;
      result[resIndex++] = index;
    }
  }
  return result;
}

var _replaceHolders = replaceHolders$3;

var composeArgs$1 = _composeArgs,
    composeArgsRight$1 = _composeArgsRight,
    countHolders = _countHolders,
    createCtor$2 = _createCtor,
    createRecurry$1 = _createRecurry,
    getHolder$1 = _getHolder,
    reorder = _reorder,
    replaceHolders$2 = _replaceHolders,
    root$4 = _root;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$3 = 1,
    WRAP_BIND_KEY_FLAG$2 = 2,
    WRAP_CURRY_FLAG$3 = 8,
    WRAP_CURRY_RIGHT_FLAG$1 = 16,
    WRAP_ARY_FLAG$2 = 128,
    WRAP_FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid$2(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG$2,
      isBind = bitmask & WRAP_BIND_FLAG$3,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2,
      isCurried = bitmask & (WRAP_CURRY_FLAG$3 | WRAP_CURRY_RIGHT_FLAG$1),
      isFlip = bitmask & WRAP_FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor$2(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder$1(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs$1(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight$1(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders$2(args, placeholder);
      return createRecurry$1(
        func, bitmask, createHybrid$2, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root$4 && this instanceof wrapper) {
      fn = Ctor || createCtor$2(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

var _createHybrid = createHybrid$2;

var apply$1 = _apply,
    createCtor$1 = _createCtor,
    createHybrid$1 = _createHybrid,
    createRecurry = _createRecurry,
    getHolder = _getHolder,
    replaceHolders$1 = _replaceHolders,
    root$3 = _root;

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry$1(func, bitmask, arity) {
  var Ctor = createCtor$1(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders$1(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid$1, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root$3 && this instanceof wrapper) ? Ctor : func;
    return apply$1(fn, this, args);
  }
  return wrapper;
}

var _createCurry = createCurry$1;

var apply = _apply,
    createCtor = _createCtor,
    root$2 = _root;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$2 = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial$1(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG$2,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root$2 && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

var _createPartial = createPartial$1;

var composeArgs = _composeArgs,
    composeArgsRight = _composeArgsRight,
    replaceHolders = _replaceHolders;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$1 = 1,
    WRAP_BIND_KEY_FLAG$1 = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG$2 = 8,
    WRAP_ARY_FLAG$1 = 128,
    WRAP_REARG_FLAG$1 = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData$1(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG$1 | WRAP_BIND_KEY_FLAG$1 | WRAP_ARY_FLAG$1);

  var isCombo =
    ((srcBitmask == WRAP_ARY_FLAG$1) && (bitmask == WRAP_CURRY_FLAG$2)) ||
    ((srcBitmask == WRAP_ARY_FLAG$1) && (bitmask == WRAP_REARG_FLAG$1) && (data[7].length <= source[8])) ||
    ((srcBitmask == (WRAP_ARY_FLAG$1 | WRAP_REARG_FLAG$1)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG$2));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & WRAP_BIND_FLAG$1) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & WRAP_BIND_FLAG$1 ? 0 : WRAP_CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & WRAP_ARY_FLAG$1) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

var _mergeData = mergeData$1;

/** Used to match a single whitespace character. */

var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex$1(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex$1;

var trimmedEndIndex = _trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim$1(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim$1;

var baseGetTag$2 = _baseGetTag,
    isObjectLike$5 = isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag$3 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$5(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$5(value) && baseGetTag$2(value) == symbolTag$3);
}

var isSymbol_1 = isSymbol$5;

var baseTrim = _baseTrim,
    isObject$3 = isObject_1,
    isSymbol$4 = isSymbol_1;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$4(value)) {
    return NAN;
  }
  if (isObject$3(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$3(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;

var toNumber = toNumber_1;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite$1(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite$1;

var toFinite = toFinite_1;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger$1(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger$1;

var baseSetData = _baseSetData,
    createBind = _createBind,
    createCurry = _createCurry,
    createHybrid = _createHybrid,
    createPartial = _createPartial,
    getData = require_getData(),
    mergeData = _mergeData,
    setData = _setData,
    setWrapToString = _setWrapToString,
    toInteger = toInteger_1;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG$1 = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `_.bind`
 *    2 - `_.bindKey`
 *    4 - `_.curry` or `_.curryRight` of a bound function
 *    8 - `_.curry`
 *   16 - `_.curryRight`
 *   32 - `_.partial`
 *   64 - `_.partialRight`
 *  128 - `_.rearg`
 *  256 - `_.ary`
 *  512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap$3(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG$1 | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG$1 | WRAP_CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG$1 || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

var _createWrap = createWrap$3;

var createWrap$2 = _createWrap;

/** Used to compose bitmasks for function metadata. */
var WRAP_ARY_FLAG = 128;

/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = (func && n == null) ? func.length : n;
  return createWrap$2(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}

var ary_1 = ary;

var copyObject$3 = _copyObject,
    keys$3 = keys_1;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign$1(object, source) {
  return object && copyObject$3(source, keys$3(source), object);
}

var _baseAssign = baseAssign$1;

var copyObject$2 = _copyObject,
    keysIn$2 = keysIn_1;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn$1(object, source) {
  return object && copyObject$2(source, keysIn$2(source), object);
}

var _baseAssignIn = baseAssignIn$1;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */

function arrayFilter$1(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter$1;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */

function stubArray$2() {
  return [];
}

var stubArray_1 = stubArray$2;

var arrayFilter = _arrayFilter,
    stubArray$1 = stubArray_1;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var _getSymbols = getSymbols$3;

var copyObject$1 = _copyObject,
    getSymbols$2 = _getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols$1(source, object) {
  return copyObject$1(source, getSymbols$2(source), object);
}

var _copySymbols = copySymbols$1;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */

var _arrayPush;
var hasRequired_arrayPush;

function require_arrayPush () {
	if (hasRequired_arrayPush) return _arrayPush;
	hasRequired_arrayPush = 1;
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	_arrayPush = arrayPush;
	return _arrayPush;
}

var arrayPush$1 = require_arrayPush(),
    getPrototype = _getPrototype,
    getSymbols$1 = _getSymbols,
    stubArray = stubArray_1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush$1(result, getSymbols$1(object));
    object = getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn$2;

var copyObject = _copyObject,
    getSymbolsIn$1 = _getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn$1(source, object) {
  return copyObject(source, getSymbolsIn$1(source), object);
}

var _copySymbolsIn = copySymbolsIn$1;

var arrayPush = require_arrayPush(),
    isArray$8 = isArray_1;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$8(object) ? result : arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys$2;

var baseGetAllKeys$1 = _baseGetAllKeys,
    getSymbols = _getSymbols,
    keys$2 = keys_1;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys$2(object) {
  return baseGetAllKeys$1(object, keys$2, getSymbols);
}

var _getAllKeys = getAllKeys$2;

var baseGetAllKeys = _baseGetAllKeys,
    getSymbolsIn = _getSymbolsIn,
    keysIn$1 = keysIn_1;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn$1(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn$1;

var getNative$1 = _getNative,
    root$1 = _root;

/* Built-in method references that are verified to be native. */
var DataView$1 = getNative$1(root$1, 'DataView');

var _DataView = DataView$1;

var getNative = _getNative,
    root = _root;

/* Built-in method references that are verified to be native. */
var Promise$2 = getNative(root, 'Promise');

var _Promise = Promise$2;

var _Set;
var hasRequired_Set;

function require_Set () {
	if (hasRequired_Set) return _Set;
	hasRequired_Set = 1;
	var getNative = _getNative,
	    root = _root;

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	_Set = Set;
	return _Set;
}

var DataView = _DataView,
    Map$1 = _Map,
    Promise$1 = _Promise,
    Set = require_Set(),
    WeakMap$1 = _WeakMap,
    baseGetTag$1 = _baseGetTag,
    toSource = _toSource;

/** `Object#toString` result references. */
var mapTag$4 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$4 = '[object Set]',
    weakMapTag$2 = '[object WeakMap]';

var dataViewTag$3 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map$1),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap$1);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag$5 = baseGetTag$1;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag$5(new DataView(new ArrayBuffer(1))) != dataViewTag$3) ||
    (Map$1 && getTag$5(new Map$1) != mapTag$4) ||
    (Promise$1 && getTag$5(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag$5(new Set) != setTag$4) ||
    (WeakMap$1 && getTag$5(new WeakMap$1) != weakMapTag$2)) {
  getTag$5 = function(value) {
    var result = baseGetTag$1(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$3;
        case mapCtorString: return mapTag$4;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$4;
        case weakMapCtorString: return weakMapTag$2;
      }
    }
    return result;
  };
}

var _getTag = getTag$5;

/** Used for built-in method references. */

var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray$1(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$2.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray$1;

var cloneArrayBuffer$1 = _cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView$1;

/** Used to match `RegExp` flags from their coerced string values. */

var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp$1;

var Symbol$2 = require_Symbol();

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol$1(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol$1;

var cloneArrayBuffer = _cloneArrayBuffer,
    cloneDataView = _cloneDataView,
    cloneRegExp = _cloneRegExp,
    cloneSymbol = _cloneSymbol,
    cloneTypedArray = _cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    mapTag$3 = '[object Map]',
    numberTag$2 = '[object Number]',
    regexpTag$2 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag$1(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$2:
      return cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$3:
      return new Ctor;

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return cloneRegExp(object);

    case setTag$3:
      return new Ctor;

    case symbolTag$2:
      return cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag$1;

var getTag$4 = _getTag,
    isObjectLike$4 = isObjectLike_1;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap$1(value) {
  return isObjectLike$4(value) && getTag$4(value) == mapTag$2;
}

var _baseIsMap = baseIsMap$1;

var baseIsMap = _baseIsMap,
    baseUnary$1 = require_baseUnary(),
    nodeUtil$1 = _nodeUtil.exports;

/* Node.js helper references. */
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;

var isMap_1 = isMap$1;

var getTag$3 = _getTag,
    isObjectLike$3 = isObjectLike_1;

/** `Object#toString` result references. */
var setTag$2 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet$1(value) {
  return isObjectLike$3(value) && getTag$3(value) == setTag$2;
}

var _baseIsSet = baseIsSet$1;

var baseIsSet = _baseIsSet,
    baseUnary = require_baseUnary(),
    nodeUtil = _nodeUtil.exports;

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var isSet_1 = isSet$1;

var Stack$2 = _Stack,
    arrayEach = _arrayEach,
    assignValue$1 = _assignValue,
    baseAssign = _baseAssign,
    baseAssignIn = _baseAssignIn,
    cloneBuffer = _cloneBuffer.exports,
    copyArray$1 = _copyArray,
    copySymbols = _copySymbols,
    copySymbolsIn = _copySymbolsIn,
    getAllKeys$1 = _getAllKeys,
    getAllKeysIn = _getAllKeysIn,
    getTag$2 = _getTag,
    initCloneArray = _initCloneArray,
    initCloneByTag = _initCloneByTag,
    initCloneObject = _initCloneObject,
    isArray$7 = isArray_1,
    isBuffer$1 = isBuffer$4.exports,
    isMap = isMap_1,
    isObject$2 = isObject_1,
    isSet = isSet_1,
    keys$1 = keys_1,
    keysIn = keysIn_1;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] =
cloneableTags[boolTag$1] = cloneableTags[dateTag$1] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag$1] =
cloneableTags[numberTag$1] = cloneableTags[objectTag$1] =
cloneableTags[regexpTag$1] = cloneableTags[setTag$1] =
cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag] =
cloneableTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone$2(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$1,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject$2(value)) {
    return value;
  }
  var isArr = isArray$7(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray$1(value, result);
    }
  } else {
    var tag = getTag$2(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer$1(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$1 || tag == argsTag$1 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack$2);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone$2(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone$2(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys$1)
    : (isFlat ? keysIn : keys$1);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue$1(result, key, baseClone$2(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone$2;

var baseClone$1 = _baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone$1(value, CLONE_SYMBOLS_FLAG);
}

var clone_1 = clone;

var createWrap$1 = _createWrap;

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap$1(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

var curry_1 = curry;

var baseGetTag = _baseGetTag,
    isObjectLike$2 = isObjectLike_1,
    isPlainObject = isPlainObject_1;

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag$1 = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike$2(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag$1 || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
}

var isError_1 = isError;

var getTag$1 = _getTag,
    isObjectLike$1 = isObjectLike_1;

/** `Object#toString` result references. */
var weakMapTag = '[object WeakMap]';

/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */
function isWeakMap(value) {
  return isObjectLike$1(value) && getTag$1(value) == weakMapTag;
}

var isWeakMap_1 = isWeakMap;

/** Used to stand-in for `undefined` hash values. */

var _setCacheAdd;
var hasRequired_setCacheAdd;

function require_setCacheAdd () {
	if (hasRequired_setCacheAdd) return _setCacheAdd;
	hasRequired_setCacheAdd = 1;
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	_setCacheAdd = setCacheAdd;
	return _setCacheAdd;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */

var _setCacheHas;
var hasRequired_setCacheHas;

function require_setCacheHas () {
	if (hasRequired_setCacheHas) return _setCacheHas;
	hasRequired_setCacheHas = 1;
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	_setCacheHas = setCacheHas;
	return _setCacheHas;
}

var _SetCache;
var hasRequired_SetCache;

function require_SetCache () {
	if (hasRequired_SetCache) return _SetCache;
	hasRequired_SetCache = 1;
	var MapCache = _MapCache,
	    setCacheAdd = require_setCacheAdd(),
	    setCacheHas = require_setCacheHas();

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	_SetCache = SetCache;
	return _SetCache;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */

function arraySome$1(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome$1;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

var _cacheHas;
var hasRequired_cacheHas;

function require_cacheHas () {
	if (hasRequired_cacheHas) return _cacheHas;
	hasRequired_cacheHas = 1;
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	_cacheHas = cacheHas;
	return _cacheHas;
}

var SetCache = require_SetCache(),
    arraySome = _arraySome,
    cacheHas = require_cacheHas();

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays$2;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */

function mapToArray$1(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray$1;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */

var _setToArray;
var hasRequired_setToArray;

function require_setToArray () {
	if (hasRequired_setToArray) return _setToArray;
	hasRequired_setToArray = 1;
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	_setToArray = setToArray;
	return _setToArray;
}

var Symbol$1 = require_Symbol(),
    Uint8Array$1 = _Uint8Array,
    eq = eq_1,
    equalArrays$1 = _equalArrays,
    mapToArray = _mapToArray,
    setToArray = require_setToArray();

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag$1;

var getAllKeys = _getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects$1;

var Stack$1 = _Stack,
    equalArrays = _equalArrays,
    equalByTag = _equalByTag,
    equalObjects = _equalObjects,
    getTag = _getTag,
    isArray$6 = isArray_1,
    isBuffer = isBuffer$4.exports,
    isTypedArray = isTypedArray_1;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$6(object),
      othIsArr = isArray$6(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack$1);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack$1);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack$1);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep$1;

var baseIsEqualDeep = _baseIsEqualDeep,
    isObjectLike = isObjectLike_1;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual$2(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$2, stack);
}

var _baseIsEqual = baseIsEqual$2;

var Stack = _Stack,
    baseIsEqual$1 = _baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch$1(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch$1;

var isObject$1 = isObject_1;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable$2(value) {
  return value === value && !isObject$1(value);
}

var _isStrictComparable = isStrictComparable$2;

var isStrictComparable$1 = _isStrictComparable,
    keys = keys_1;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData$1(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable$1(value)];
  }
  return result;
}

var _getMatchData = getMatchData$1;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */

function matchesStrictComparable$2(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable$2;

var baseIsMatch = _baseIsMatch,
    getMatchData = _getMatchData,
    matchesStrictComparable$1 = _matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches$1(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches$1;

var isArray$5 = isArray_1,
    isSymbol$3 = isSymbol_1;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$3(value, object) {
  if (isArray$5(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol$3(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey$3;

var MapCache = _MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = MapCache;

var memoize_1 = memoize$1;

var memoize = memoize_1;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped$1(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped$1;

var memoizeCapped = _memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$2 = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath$2;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

var _arrayMap;
var hasRequired_arrayMap;

function require_arrayMap () {
	if (hasRequired_arrayMap) return _arrayMap;
	hasRequired_arrayMap = 1;
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	_arrayMap = arrayMap;
	return _arrayMap;
}

var Symbol = require_Symbol(),
    arrayMap$1 = require_arrayMap(),
    isArray$4 = isArray_1,
    isSymbol$2 = isSymbol_1;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$4(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$1(value, baseToString$1) + '';
  }
  if (isSymbol$2(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _baseToString = baseToString$1;

var baseToString = _baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$2(value) {
  return value == null ? '' : baseToString(value);
}

var toString_1 = toString$2;

var isArray$3 = isArray_1,
    isKey$2 = _isKey,
    stringToPath$1 = _stringToPath,
    toString$1 = toString_1;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$2(value, object) {
  if (isArray$3(value)) {
    return value;
  }
  return isKey$2(value, object) ? [value] : stringToPath$1(toString$1(value));
}

var _castPath = castPath$2;

var isSymbol$1 = isSymbol_1;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$5(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _toKey = toKey$5;

var _baseGet;
var hasRequired_baseGet;

function require_baseGet () {
	if (hasRequired_baseGet) return _baseGet;
	hasRequired_baseGet = 1;
	var castPath = _castPath,
	    toKey = _toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	_baseGet = baseGet;
	return _baseGet;
}

var baseGet$1 = require_baseGet();

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$1(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */

function baseHasIn$1(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn$1;

var castPath$1 = _castPath,
    isArguments = isArguments_1,
    isArray$2 = isArray_1,
    isIndex$1 = _isIndex,
    isLength = isLength_1,
    toKey$4 = _toKey;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath$1(object, path, hasFunc) {
  path = castPath$1(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey$4(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex$1(key, length) &&
    (isArray$2(object) || isArguments(object));
}

var _hasPath = hasPath$1;

var baseHasIn = _baseHasIn,
    hasPath = _hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn$1(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

var hasIn_1 = hasIn$1;

var baseIsEqual = _baseIsEqual,
    get = get_1,
    hasIn = hasIn_1,
    isKey$1 = _isKey,
    isStrictComparable = _isStrictComparable,
    matchesStrictComparable = _matchesStrictComparable,
    toKey$3 = _toKey;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty$1(path, srcValue) {
  if (isKey$1(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey$3(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

var _baseMatchesProperty = baseMatchesProperty$1;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

function baseProperty$1(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty$1;

var baseGet = require_baseGet();

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep$1(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep$1;

var baseProperty = _baseProperty,
    basePropertyDeep = _basePropertyDeep,
    isKey = _isKey,
    toKey$2 = _toKey;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property$1(path) {
  return isKey(path) ? baseProperty(toKey$2(path)) : basePropertyDeep(path);
}

var property_1 = property$1;

var baseMatches = _baseMatches,
    baseMatchesProperty = _baseMatchesProperty,
    identity = identity_1,
    isArray$1 = isArray_1,
    property = property_1;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee$2(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray$1(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

var _baseIteratee = baseIteratee$2;

var baseClone = _baseClone,
    baseIteratee$1 = _baseIteratee;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return baseIteratee$1(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}

var iteratee_1 = iteratee;

var _isFlattenable;
var hasRequired_isFlattenable;

function require_isFlattenable () {
	if (hasRequired_isFlattenable) return _isFlattenable;
	hasRequired_isFlattenable = 1;
	var Symbol = require_Symbol(),
	    isArguments = isArguments_1,
	    isArray = isArray_1;

	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	_isFlattenable = isFlattenable;
	return _isFlattenable;
}

var _baseFlatten;
var hasRequired_baseFlatten;

function require_baseFlatten () {
	if (hasRequired_baseFlatten) return _baseFlatten;
	hasRequired_baseFlatten = 1;
	var arrayPush = require_arrayPush(),
	    isFlattenable = require_isFlattenable();

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	_baseFlatten = baseFlatten;
	return _baseFlatten;
}

var flatten_1;
var hasRequiredFlatten;

function requireFlatten () {
	if (hasRequiredFlatten) return flatten_1;
	hasRequiredFlatten = 1;
	var baseFlatten = require_baseFlatten();

	/**
	 * Flattens `array` a single level deep.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, [3, [4]], 5]]);
	 * // => [1, 2, [3, [4]], 5]
	 */
	function flatten(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? baseFlatten(array, 1) : [];
	}

	flatten_1 = flatten;
	return flatten_1;
}

var _flatRest;
var hasRequired_flatRest;

function require_flatRest () {
	if (hasRequired_flatRest) return _flatRest;
	hasRequired_flatRest = 1;
	var flatten = requireFlatten(),
	    overRest = _overRest,
	    setToString = _setToString;

	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest(func) {
	  return setToString(overRest(func, undefined, flatten), func + '');
	}

	_flatRest = flatRest;
	return _flatRest;
}

var createWrap = _createWrap,
    flatRest = require_flatRest();

/** Used to compose bitmasks for function metadata. */
var WRAP_REARG_FLAG = 256;

/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */
var rearg = flatRest(function(func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});

var rearg_1 = rearg;

var arrayMap = require_arrayMap(),
    copyArray = _copyArray,
    isArray = isArray_1,
    isSymbol = isSymbol_1,
    stringToPath = _stringToPath,
    toKey$1 = _toKey,
    toString = toString_1;

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey$1);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

var toPath_1 = toPath;

var _util = {
  'ary': ary_1,
  'assign': _baseAssign,
  'clone': clone_1,
  'curry': curry_1,
  'forEach': _arrayEach,
  'isArray': isArray_1,
  'isError': isError_1,
  'isFunction': isFunction_1,
  'isWeakMap': isWeakMap_1,
  'iteratee': iteratee_1,
  'keys': _baseKeys,
  'rearg': rearg_1,
  'toInteger': toInteger_1,
  'toPath': toPath_1
};

var baseConvert = _baseConvert,
    util = _util;

/**
 * Converts `func` of `name` to an immutable auto-curried iteratee-first data-last
 * version with conversion `options` applied. If `name` is an object its methods
 * will be converted.
 *
 * @param {string} name The name of the function to wrap.
 * @param {Function} [func] The function to wrap.
 * @param {Object} [options] The options object. See `baseConvert` for more details.
 * @returns {Function|Object} Returns the converted function or object.
 */
function convert$4(name, func, options) {
  return baseConvert(util, name, func, options);
}

var convert_1 = convert$4;

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */

var compact_1;
var hasRequiredCompact;

function requireCompact () {
	if (hasRequiredCompact) return compact_1;
	hasRequiredCompact = 1;
	function compact(array) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (value) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	compact_1 = compact;
	return compact_1;
}

var _falseOptions;
var hasRequired_falseOptions;

function require_falseOptions () {
	if (hasRequired_falseOptions) return _falseOptions;
	hasRequired_falseOptions = 1;
	_falseOptions = {
	  'cap': false,
	  'curry': false,
	  'fixed': false,
	  'immutable': false,
	  'rearg': false
	};
	return _falseOptions;
}

var convert$3 = convert_1,
    func$3 = convert$3('compact', requireCompact(), require_falseOptions());

func$3.placeholder = requirePlaceholder();
var compact = func$3;

var _createFlow;
var hasRequired_createFlow;

function require_createFlow () {
	if (hasRequired_createFlow) return _createFlow;
	hasRequired_createFlow = 1;
	var LodashWrapper = require_LodashWrapper(),
	    flatRest = require_flatRest(),
	    getData = require_getData(),
	    getFuncName = require_getFuncName(),
	    isArray = isArray_1,
	    isLaziable = require_isLaziable();

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used to compose bitmasks for function metadata. */
	var WRAP_CURRY_FLAG = 8,
	    WRAP_PARTIAL_FLAG = 32,
	    WRAP_ARY_FLAG = 128,
	    WRAP_REARG_FLAG = 256;

	/**
	 * Creates a `_.flow` or `_.flowRight` function.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new flow function.
	 */
	function createFlow(fromRight) {
	  return flatRest(function(funcs) {
	    var length = funcs.length,
	        index = length,
	        prereq = LodashWrapper.prototype.thru;

	    if (fromRight) {
	      funcs.reverse();
	    }
	    while (index--) {
	      var func = funcs[index];
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
	        var wrapper = new LodashWrapper([], true);
	      }
	    }
	    index = wrapper ? index : length;
	    while (++index < length) {
	      func = funcs[index];

	      var funcName = getFuncName(func),
	          data = funcName == 'wrapper' ? getData(func) : undefined;

	      if (data && isLaziable(data[0]) &&
	            data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
	            !data[4].length && data[9] == 1
	          ) {
	        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	      } else {
	        wrapper = (func.length == 1 && isLaziable(func))
	          ? wrapper[funcName]()
	          : wrapper.thru(func);
	      }
	    }
	    return function() {
	      var args = arguments,
	          value = args[0];

	      if (wrapper && args.length == 1 && isArray(value)) {
	        return wrapper.plant(value).value();
	      }
	      var index = 0,
	          result = length ? funcs[index].apply(this, args) : value;

	      while (++index < length) {
	        result = funcs[index].call(this, result);
	      }
	      return result;
	    };
	  });
	}

	_createFlow = createFlow;
	return _createFlow;
}

var flow_1;
var hasRequiredFlow;

function requireFlow () {
	if (hasRequiredFlow) return flow_1;
	hasRequiredFlow = 1;
	var createFlow = require_createFlow();

	/**
	 * Creates a function that returns the result of invoking the given functions
	 * with the `this` binding of the created function, where each successive
	 * invocation is supplied the return value of the previous.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Util
	 * @param {...(Function|Function[])} [funcs] The functions to invoke.
	 * @returns {Function} Returns the new composite function.
	 * @see _.flowRight
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * var addSquare = _.flow([_.add, square]);
	 * addSquare(1, 2);
	 * // => 9
	 */
	var flow = createFlow();

	flow_1 = flow;
	return flow_1;
}

var convert$2 = convert_1,
    func$2 = convert$2('flow', requireFlow());

func$2.placeholder = requirePlaceholder();
var flow = func$2;

var _baseMap;
var hasRequired_baseMap;

function require_baseMap () {
	if (hasRequired_baseMap) return _baseMap;
	hasRequired_baseMap = 1;
	var baseEach = _baseEach,
	    isArrayLike = isArrayLike_1;

	/**
	 * The base implementation of `_.map` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike(collection) ? Array(collection.length) : [];

	  baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	_baseMap = baseMap;
	return _baseMap;
}

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */

var _baseSortBy;
var hasRequired_baseSortBy;

function require_baseSortBy () {
	if (hasRequired_baseSortBy) return _baseSortBy;
	hasRequired_baseSortBy = 1;
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	_baseSortBy = baseSortBy;
	return _baseSortBy;
}

var _compareAscending;
var hasRequired_compareAscending;

function require_compareAscending () {
	if (hasRequired_compareAscending) return _compareAscending;
	hasRequired_compareAscending = 1;
	var isSymbol = isSymbol_1;

	/**
	 * Compares values to sort them in ascending order.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {number} Returns the sort order indicator for `value`.
	 */
	function compareAscending(value, other) {
	  if (value !== other) {
	    var valIsDefined = value !== undefined,
	        valIsNull = value === null,
	        valIsReflexive = value === value,
	        valIsSymbol = isSymbol(value);

	    var othIsDefined = other !== undefined,
	        othIsNull = other === null,
	        othIsReflexive = other === other,
	        othIsSymbol = isSymbol(other);

	    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
	        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
	        (valIsNull && othIsDefined && othIsReflexive) ||
	        (!valIsDefined && othIsReflexive) ||
	        !valIsReflexive) {
	      return 1;
	    }
	    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
	        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
	        (othIsNull && valIsDefined && valIsReflexive) ||
	        (!othIsDefined && valIsReflexive) ||
	        !othIsReflexive) {
	      return -1;
	    }
	  }
	  return 0;
	}

	_compareAscending = compareAscending;
	return _compareAscending;
}

var _compareMultiple;
var hasRequired_compareMultiple;

function require_compareMultiple () {
	if (hasRequired_compareMultiple) return _compareMultiple;
	hasRequired_compareMultiple = 1;
	var compareAscending = require_compareAscending();

	/**
	 * Used by `_.orderBy` to compare multiple properties of a value to another
	 * and stable sort them.
	 *
	 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
	 * specify an order of "desc" for descending or "asc" for ascending sort order
	 * of corresponding values.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {boolean[]|string[]} orders The order to sort by for each property.
	 * @returns {number} Returns the sort order indicator for `object`.
	 */
	function compareMultiple(object, other, orders) {
	  var index = -1,
	      objCriteria = object.criteria,
	      othCriteria = other.criteria,
	      length = objCriteria.length,
	      ordersLength = orders.length;

	  while (++index < length) {
	    var result = compareAscending(objCriteria[index], othCriteria[index]);
	    if (result) {
	      if (index >= ordersLength) {
	        return result;
	      }
	      var order = orders[index];
	      return result * (order == 'desc' ? -1 : 1);
	    }
	  }
	  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	  // that causes it, under certain circumstances, to provide the same value for
	  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	  // for more details.
	  //
	  // This also ensures a stable sort in V8 and other engines.
	  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
	  return object.index - other.index;
	}

	_compareMultiple = compareMultiple;
	return _compareMultiple;
}

var _baseOrderBy;
var hasRequired_baseOrderBy;

function require_baseOrderBy () {
	if (hasRequired_baseOrderBy) return _baseOrderBy;
	hasRequired_baseOrderBy = 1;
	var arrayMap = require_arrayMap(),
	    baseGet = require_baseGet(),
	    baseIteratee = _baseIteratee,
	    baseMap = require_baseMap(),
	    baseSortBy = require_baseSortBy(),
	    baseUnary = require_baseUnary(),
	    compareMultiple = require_compareMultiple(),
	    identity = identity_1,
	    isArray = isArray_1;

	/**
	 * The base implementation of `_.orderBy` without param guards.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	 * @param {string[]} orders The sort orders of `iteratees`.
	 * @returns {Array} Returns the new sorted array.
	 */
	function baseOrderBy(collection, iteratees, orders) {
	  if (iteratees.length) {
	    iteratees = arrayMap(iteratees, function(iteratee) {
	      if (isArray(iteratee)) {
	        return function(value) {
	          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
	        }
	      }
	      return iteratee;
	    });
	  } else {
	    iteratees = [identity];
	  }

	  var index = -1;
	  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

	  var result = baseMap(collection, function(value, key, collection) {
	    var criteria = arrayMap(iteratees, function(iteratee) {
	      return iteratee(value);
	    });
	    return { 'criteria': criteria, 'index': ++index, 'value': value };
	  });

	  return baseSortBy(result, function(object, other) {
	    return compareMultiple(object, other, orders);
	  });
	}

	_baseOrderBy = baseOrderBy;
	return _baseOrderBy;
}

var sortBy_1;
var hasRequiredSortBy;

function requireSortBy () {
	if (hasRequiredSortBy) return sortBy_1;
	hasRequiredSortBy = 1;
	var baseFlatten = require_baseFlatten(),
	    baseOrderBy = require_baseOrderBy(),
	    baseRest = _baseRest,
	    isIterateeCall = _isIterateeCall;

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection thru each iteratee. This method
	 * performs a stable sort, that is, it preserves the original sort order of
	 * equal elements. The iteratees are invoked with one argument: (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {...(Function|Function[])} [iteratees=[_.identity]]
	 *  The iteratees to sort by.
	 * @returns {Array} Returns the new sorted array.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'fred',   'age': 48 },
	 *   { 'user': 'barney', 'age': 36 },
	 *   { 'user': 'fred',   'age': 30 },
	 *   { 'user': 'barney', 'age': 34 }
	 * ];
	 *
	 * _.sortBy(users, [function(o) { return o.user; }]);
	 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
	 *
	 * _.sortBy(users, ['user', 'age']);
	 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
	 */
	var sortBy = baseRest(function(collection, iteratees) {
	  if (collection == null) {
	    return [];
	  }
	  var length = iteratees.length;
	  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
	    iteratees = [];
	  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	    iteratees = [iteratees[0]];
	  }
	  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
	});

	sortBy_1 = sortBy;
	return sortBy_1;
}

var convert$1 = convert_1,
    func$1 = convert$1('sortBy', requireSortBy());

func$1.placeholder = requirePlaceholder();
var sortBy = func$1;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

var _arrayIncludesWith;
var hasRequired_arrayIncludesWith;

function require_arrayIncludesWith () {
	if (hasRequired_arrayIncludesWith) return _arrayIncludesWith;
	hasRequired_arrayIncludesWith = 1;
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	_arrayIncludesWith = arrayIncludesWith;
	return _arrayIncludesWith;
}

var _createSet;
var hasRequired_createSet;

function require_createSet () {
	if (hasRequired_createSet) return _createSet;
	hasRequired_createSet = 1;
	var Set = require_Set(),
	    noop = requireNoop(),
	    setToArray = require_setToArray();

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	  return new Set(values);
	};

	_createSet = createSet;
	return _createSet;
}

var _baseUniq;
var hasRequired_baseUniq;

function require_baseUniq () {
	if (hasRequired_baseUniq) return _baseUniq;
	hasRequired_baseUniq = 1;
	var SetCache = require_SetCache(),
	    arrayIncludes = require_arrayIncludes(),
	    arrayIncludesWith = require_arrayIncludesWith(),
	    cacheHas = require_cacheHas(),
	    createSet = require_createSet(),
	    setToArray = require_setToArray();

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      length = array.length,
	      isCommon = true,
	      result = [],
	      seen = result;

	  if (comparator) {
	    isCommon = false;
	    includes = arrayIncludesWith;
	  }
	  else if (length >= LARGE_ARRAY_SIZE) {
	    var set = iteratee ? null : createSet(array);
	    if (set) {
	      return setToArray(set);
	    }
	    isCommon = false;
	    includes = cacheHas;
	    seen = new SetCache;
	  }
	  else {
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (!includes(seen, computed, comparator)) {
	      if (seen !== result) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	_baseUniq = baseUniq;
	return _baseUniq;
}

var uniqBy_1;
var hasRequiredUniqBy;

function requireUniqBy () {
	if (hasRequiredUniqBy) return uniqBy_1;
	hasRequiredUniqBy = 1;
	var baseIteratee = _baseIteratee,
	    baseUniq = require_baseUniq();

	/**
	 * This method is like `_.uniq` except that it accepts `iteratee` which is
	 * invoked for each element in `array` to generate the criterion by which
	 * uniqueness is computed. The order of result values is determined by the
	 * order they occur in the array. The iteratee is invoked with one argument:
	 * (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 * @example
	 *
	 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
	 * // => [2.1, 1.2]
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	 * // => [{ 'x': 1 }, { 'x': 2 }]
	 */
	function uniqBy(array, iteratee) {
	  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee)) : [];
	}

	uniqBy_1 = uniqBy;
	return uniqBy_1;
}

var convert = convert_1,
    func = convert('uniqBy', requireUniqBy());

func.placeholder = requirePlaceholder();
var uniqBy = func;

var baseAssignValue = _baseAssignValue,
    baseForOwn = _baseForOwn,
    baseIteratee = _baseIteratee;

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

var mapKeys_1 = mapKeys;

var assignValue = _assignValue,
    castPath = _castPath,
    isIndex = _isIndex,
    isObject = isObject_1,
    toKey = _toKey;

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet$1(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet$1;

var baseSet = _baseSet;

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

var set_1 = set;

var selectors$k = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Byly upraveny vlastnosti, jako je tón, sytost, křivky, stíny nebo světla",
			label: "Úpravy barev nebo expozice"
		},
		"c2pa.created": {
			description: "Byl vytvořen nový soubor nebo obsah",
			label: "Vytvořeno"
		},
		"c2pa.cropped": {
			description: "Byly použity nástroje pro oříznutí, zmenšení nebo rozšíření viditelné oblasti obsahu",
			label: "Úpravy oříznutí"
		},
		"c2pa.drawing": {
			description: "Byly použity nástroje, jako jsou tužky, štětce, gumy nebo nástroje tvar, cesta nebo pero",
			label: "Úpravy kresby"
		},
		"c2pa.edited": {
			description: "Byly provedeny další změny",
			label: "Další úpravy"
		},
		"c2pa.filtered": {
			description: "Byly použity nástroje, jako jsou filtry, styly nebo efekty, ke změně vzhledu",
			label: "Úpravy filtrů nebo stylů"
		},
		"c2pa.opened": {
			description: "Byl otevřen existující soubor",
			label: "Otevřeno"
		},
		"c2pa.orientation": {
			description: "Byla změněna poloha nebo orientace (otočení, převrácení atd.)",
			label: "Orientace úpravy"
		},
		"c2pa.placed": {
			description: "Do tohoto souboru byl přidán existující obsah",
			label: "Importováno"
		},
		"c2pa.resized": {
			description: "Byly změněny rozměry nebo velikost souboru",
			label: "Změny velikosti"
		},
		"c2pa.unknown": {
			description: "Byly provedeny další úpravy nebo aktivita, kterou nebylo možné rozpoznat",
			label: "Neznámé úpravy nebo aktivita"
		}
	}
};
var csCZ = {
	selectors: selectors$k
};

var selectors$j = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Justerede egenskaber såsom tone, mætning, kurver, skygger eller fremhævninger",
			label: "Farve- eller eksponeringsredigeringer"
		},
		"c2pa.created": {
			description: "Oprettede en ny fil eller nyt indhold",
			label: "Oprettede"
		},
		"c2pa.cropped": {
			description: "Brugte beskæringsværktøjer til at reducere eller udvide synligt indholdsområde",
			label: "Beskæring af redigeringer"
		},
		"c2pa.drawing": {
			description: "Brugte værktøjer såsom blyanter, pensler, viskelædere eller form-, sti- eller penneværktøjer",
			label: "Tegneredigeringer"
		},
		"c2pa.edited": {
			description: "Foretog andre ændringer",
			label: "Andre redigeringer"
		},
		"c2pa.filtered": {
			description: "Brugte værktøjer såsom filtre, formater eller effekter til at ændre udseende",
			label: "Filter- eller formatredigeringer"
		},
		"c2pa.opened": {
			description: "Åbnede en allerede eksisterende fil",
			label: "Åbnede"
		},
		"c2pa.orientation": {
			description: "Ændrede placering eller retning (roteret, vendt osv.)",
			label: "Retning redigeringer"
		},
		"c2pa.placed": {
			description: "Føjede allerede eksisterende indhold til denne fil",
			label: "Importerede"
		},
		"c2pa.resized": {
			description: "Ændrede dimensioner eller filstørrelse",
			label: "Ændring af størrelse på redigeringer"
		},
		"c2pa.unknown": {
			description: "Foretog andre redigeringer eller aktiviteter, der ikke kunne genkendes",
			label: "Ukendte redigeringer eller ukendt aktivitet"
		}
	}
};
var daDK = {
	selectors: selectors$j
};

var selectors$i = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Angepasste Eigenschaften wie Farbton, Sättigung, Kurven, Schatten oder Glanzlichter",
			label: "Änderung von Farbe oder Belichtung"
		},
		"c2pa.created": {
			description: "Neue Datei oder neuen Inhalt erstellt",
			label: "Erstellt"
		},
		"c2pa.cropped": {
			description: "Verwendete Zuschneidewerkzeuge, Verkleinerung oder Erweiterung des sichtbaren Inhaltsbereichs",
			label: "Zuschneiden von Änderungen"
		},
		"c2pa.drawing": {
			description: "Verwendete Werkzeuge wie Stifte, Pinsel, Radierer oder Form-, Pfad- oder Zeichenstift-Werkzeuge",
			label: "Zeichnungsänderungen"
		},
		"c2pa.edited": {
			description: "Vorgenommene sonstige Änderungen",
			label: "Sonstige Änderungen"
		},
		"c2pa.filtered": {
			description: "Verwendete Tools wie Filter, Stile, Formate oder Effekte, die das Erscheinungsbild ändern",
			label: "Änderungen filtern oder gestalten"
		},
		"c2pa.opened": {
			description: "Vorhandene Datei geöffnet",
			label: "Geöffnet"
		},
		"c2pa.orientation": {
			description: "Position oder Ausrichtung geändert (gedreht, gespiegelt usw.)",
			label: "Ausrichtung Änderungen"
		},
		"c2pa.placed": {
			description: "Vorhandenen Inhalt zu dieser Datei hinzugefügt",
			label: "Importiert"
		},
		"c2pa.resized": {
			description: "Geänderte Abmessungen oder Dateigröße",
			label: "Größenänderungen"
		},
		"c2pa.unknown": {
			description: "Andere Änderungen oder Aktivitäten durchgeführt, die nicht erkannt werden konnten",
			label: "Unbekannte Änderungen oder Aktivitäten"
		}
	}
};
var deDE = {
	selectors: selectors$i
};

var selectors$h = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Adjusted properties like tone, saturation, curves, shadows, or highlights",
			label: "Color or exposure edits"
		},
		"c2pa.converted": {
			description: "The format of the asset was changed",
			label: "Converted asset"
		},
		"c2pa.created": {
			description: "Created a new file or content",
			label: "Created"
		},
		"c2pa.cropped": {
			description: "Used cropping tools, reducing or expanding visible content area",
			label: "Cropping edits"
		},
		"c2pa.drawing": {
			description: "Used tools like pencils, brushes, erasers, or shape, path, or pen tools",
			label: "Drawing edits"
		},
		"c2pa.edited": {
			description: "Made other changes",
			label: "Other edits"
		},
		"c2pa.filtered": {
			description: "Used tools like filters, styles, or effects to change appearance",
			label: "Filter or style edits"
		},
		"c2pa.opened": {
			description: "Opened a pre-existing file",
			label: "Opened"
		},
		"c2pa.orientation": {
			description: "Changed position or orientation (rotated, flipped, etc.)",
			label: "Orientation edits"
		},
		"c2pa.placed": {
			description: "Added pre-existing content to this file",
			label: "Imported"
		},
		"c2pa.published": {
			description: "Received and distributed image",
			label: "Published image"
		},
		"c2pa.removed": {
			description: "One or more assets were removed from the file",
			label: "Asset removed"
		},
		"c2pa.repackaged": {
			description: "Asset was repackaged without being processed",
			label: "Repackaged asset"
		},
		"c2pa.resized": {
			description: "Changed dimensions or file size",
			label: "Resizing edits"
		},
		"c2pa.transcoded": {
			description: "Processed or compressed an asset to optimize for display",
			label: "Processed asset"
		},
		"c2pa.unknown": {
			description: "Performed other edits or activity that couldn't be recognized",
			label: "Unknown edits or activity"
		}
	}
};
var enUS = {
	selectors: selectors$h
};

var selectors$g = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Se han ajustado propiedades como el tono, la saturación, las curvas, las sombras o las luces",
			label: "Ediciones de color o exposición"
		},
		"c2pa.created": {
			description: "Se ha creado un nuevo archivo o contenido",
			label: "Fecha de creación"
		},
		"c2pa.cropped": {
			description: "Se han usado herramientas de recorte, lo que reduce o expande el área de contenido visible",
			label: "Ediciones de recorte"
		},
		"c2pa.drawing": {
			description: "Se han usado herramientas como lápices, pinceles, borradores o herramientas de formas, trazados o bolígrafos",
			label: "Ediciones de dibujo"
		},
		"c2pa.edited": {
			description: "Se han hecho otros cambios",
			label: "Otras ediciones"
		},
		"c2pa.filtered": {
			description: "Se han usado herramientas como filtros, estilos o efectos para cambiar la apariencia",
			label: "Ediciones de filtro o estilo"
		},
		"c2pa.opened": {
			description: "Se ha abierto un archivo preexistente",
			label: "Abierto"
		},
		"c2pa.orientation": {
			description: "Se ha cambiado la posición u orientación (girado, volteado, etc.)",
			label: "Ediciones de orientación"
		},
		"c2pa.placed": {
			description: "Se ha añadido contenido preexistente a este archivo",
			label: "Importado"
		},
		"c2pa.resized": {
			description: "Se han modificado las dimensiones o el tamaño del archivo",
			label: "Ediciones de cambio de tamaño"
		},
		"c2pa.unknown": {
			description: "Se han realizado otras ediciones o actividades que no se han podido reconocer",
			label: "Ediciones o actividad desconocidas"
		}
	}
};
var esES = {
	selectors: selectors$g
};

var selectors$f = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Säädetty ominaisuuksia, kuten sävyä, kylläisyyttä, käyriä, varjoja tai kohokohtia",
			label: "Väreihin tai valotukseen liittyvät muokkaukset"
		},
		"c2pa.created": {
			description: "Luotu uusi tiedosto tai uutta sisältöä",
			label: "Luotu"
		},
		"c2pa.cropped": {
			description: "Käytetty rajaustyökaluja, vähennetty tai laajennettu näkyvää sisältöaluetta",
			label: "Rajaukseen liittyvät muokkaukset"
		},
		"c2pa.drawing": {
			description: "Käytetty työkaluja, kuten kyniä, siveltimiä, pyyhekumeja tai muoto-, reitti- tai kynätyökaluja",
			label: "Piirtämiseen liittyvät muokkaukset"
		},
		"c2pa.edited": {
			description: "Tehty muita muutoksia",
			label: "Muut muokkaukset"
		},
		"c2pa.filtered": {
			description: "Käytetty työkaluja, kuten ulkoasun muuttamiseen tarkoitettuja suodattimia, tyylejä tai tehosteita",
			label: "Suodattimeen tai tyyliin liittyvät muokkaukset"
		},
		"c2pa.opened": {
			description: "Avattu olemassa oleva tiedosto",
			label: "Avattu"
		},
		"c2pa.orientation": {
			description: "Muutettu paikkaa tai suuntaa (kierretty, käännetty jne.)",
			label: "Suuntaan liittyvät muokkaukset"
		},
		"c2pa.placed": {
			description: "Lisätty olemassa olevaa sisältöä tähän tiedostoon",
			label: "Tuotu"
		},
		"c2pa.resized": {
			description: "Muutettu mittasuhteita tai tiedostokokoa",
			label: "Koon muuttamiseen liittyvät muokkaukset"
		},
		"c2pa.unknown": {
			description: "Suoritettu muita muokkauksia tai toimintoja, joita ei tunnistettu",
			label: "Tuntemattomat muokkaukset tai tuntematon toiminta"
		}
	}
};
var fiFI = {
	selectors: selectors$f
};

var selectors$e = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Ajustement des propriétés, comme la tonalité, la saturation, les courbes, les ombres ou les tons clairs",
			label: "Modifications de la couleur ou de l’exposition"
		},
		"c2pa.created": {
			description: "Création d’un nouveau fichier ou contenu",
			label: "Créé"
		},
		"c2pa.cropped": {
			description: "Utilisation d’outils de recadrage, réduisant ou élargissant la zone de contenu visible",
			label: "Modifications de recadrage"
		},
		"c2pa.drawing": {
			description: "Utilisation d’outils, comme des crayons, des pinceaux, des gommes ou des outils de forme, de tracé ou de plume",
			label: "Modifications du dessin"
		},
		"c2pa.edited": {
			description: "Réalisation d’autres modifications",
			label: "Autres modifications"
		},
		"c2pa.filtered": {
			description: "Utilisation d’outils tels que des filtres, des styles ou des effets pour modifier l’apparence",
			label: "Modifications du filtre ou du style"
		},
		"c2pa.opened": {
			description: "Ouverture d’un fichier préexistant",
			label: "Ouvert"
		},
		"c2pa.orientation": {
			description: "Changement de position ou d’orientation (rotation, renversement, etc.)",
			label: "Orientation Modifications de "
		},
		"c2pa.placed": {
			description: "Ajout du contenu préexistant à ce fichier",
			label: "Importé"
		},
		"c2pa.resized": {
			description: "Modification des dimensions ou de la taille du fichier",
			label: "Modifications du redimensionnement"
		},
		"c2pa.unknown": {
			description: "Réalisation d’autres modifications ou activités qui n’ont pas pu être reconnues",
			label: "Modifications ou activité inconnues"
		}
	}
};
var frFR = {
	selectors: selectors$e
};

var selectors$d = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Beállított olyan tulajdonságokat mint árnyalat, telítettség, görbék, árnyékok vagy csúcsfények",
			label: "Szín vagy expozíció szerkesztése"
		},
		"c2pa.created": {
			description: "Létrehozott egy új fájlt vagy tartalmat",
			label: "Létrehozva"
		},
		"c2pa.cropped": {
			description: "Használt vágóeszközöket, amelyek csökkentik vagy bővítik a tartalom látható területét",
			label: "Vágást használó szerkesztések"
		},
		"c2pa.drawing": {
			description: "Használt olyan eszközöket mint ceruzák, ecsetek, radírok vagy alakzat-, görbe- vagy tolleszközök",
			label: "Rajzolást használó szerkesztések"
		},
		"c2pa.edited": {
			description: "Egyéb módosítások végrehajtva",
			label: "Egyéb szerkesztések"
		},
		"c2pa.filtered": {
			description: "Használt olyan eszközöket mint szűrők, stílusok vagy effektusok a megjelenés megváltoztatására",
			label: "Szűrőt vagy stílust használó szerkesztések"
		},
		"c2pa.opened": {
			description: "Megnyitott egy már létező fájlt",
			label: "Megnyitva"
		},
		"c2pa.orientation": {
			description: "Módosította a pozíciót vagy tájolást (elforgatva, megfordítva stb.)",
			label: "Tájolás szerkesztések"
		},
		"c2pa.placed": {
			description: "Már létező tartalmat adott hozzá ehhez a fájlhoz",
			label: "Importálva"
		},
		"c2pa.resized": {
			description: "A méretek vagy a fájl mérete módosult",
			label: "Szerkesztések átméretezése"
		},
		"c2pa.unknown": {
			description: "Más szerkesztéseket vagy műveleteket hajtott végre, amelyeket nem lehetett felismerni",
			label: "Ismeretlen szerkesztések vagy tevékenység"
		}
	}
};
var huHU = {
	selectors: selectors$d
};

var selectors$c = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Proprietà regolate come tono, saturazione, curve, ombre o luci",
			label: "Modifiche del colore o dell'esposizione"
		},
		"c2pa.created": {
			description: "È stato creato un nuovo file o contenuto",
			label: "Creato"
		},
		"c2pa.cropped": {
			description: "Strumenti di ritaglio utilizzati, riducendo o espandendo l'area del contenuto visibile",
			label: "Modifiche di ritaglio"
		},
		"c2pa.drawing": {
			description: "Strumenti usati come matite, pennelli, gomme o strumenti forma, tracciato o penna",
			label: "Modifiche del disegno"
		},
		"c2pa.edited": {
			description: "Sono state apportate altre modifiche",
			label: "Altre modifiche"
		},
		"c2pa.filtered": {
			description: "Strumenti utilizzati come filtri, stili o effetti per modificare l'aspetto",
			label: "Modifiche di filtro o stile"
		},
		"c2pa.opened": {
			description: "È stato aperto un file preesistente",
			label: "Aperto"
		},
		"c2pa.orientation": {
			description: "Posizione o orientamento modificati (ruotati, capovolti e così via)",
			label: "Orientamento modifiche"
		},
		"c2pa.placed": {
			description: "Aggiunto contenuto preesistente a questo file",
			label: "Importato"
		},
		"c2pa.resized": {
			description: "Dimensioni o grandezza del file modificate",
			label: "Modifiche del ridimensionamento"
		},
		"c2pa.unknown": {
			description: "Sono state eseguite altre modifiche o attività che non è stato possibile riconoscere",
			label: "Modifiche o attività sconosciute"
		}
	}
};
var itIT = {
	selectors: selectors$c
};

var selectors$b = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "トーン、彩度、カーブ、シャドウ、ハイライトなどのプロパティを調整",
			label: "カラーまたは露出の編集"
		},
		"c2pa.created": {
			description: "新しいファイルまたはコンテンツを作成",
			label: "作成済み"
		},
		"c2pa.cropped": {
			description: "切り抜きツールを使用、表示されているコンテンツ領域の縮小または拡大",
			label: "切り抜きの編集"
		},
		"c2pa.drawing": {
			description: "鉛筆、ブラシ、消しゴム、シェイプ、パス、ペンツールなどのツールを使用",
			label: "描画の編集"
		},
		"c2pa.edited": {
			description: "その他の変更",
			label: "その他の編集"
		},
		"c2pa.filtered": {
			description: "フィルター、スタイル、効果などのツールを使用して外観を変更",
			label: "フィルターまたはスタイルの編集"
		},
		"c2pa.opened": {
			description: "既存のファイルを開いた",
			label: "開いた"
		},
		"c2pa.orientation": {
			description: "位置または方向を変更 (回転、反転など)",
			label: "画像方向編集"
		},
		"c2pa.placed": {
			description: "このファイルに既存のコンテンツを追加",
			label: "読み込み済み"
		},
		"c2pa.resized": {
			description: "寸法またはファイルサイズを変更",
			label: "サイズ変更の編集"
		},
		"c2pa.unknown": {
			description: "認識できない他の編集またはアクティビティを実行",
			label: "不明な編集またはアクティビティ"
		}
	}
};
var jaJP = {
	selectors: selectors$b
};

var selectors$a = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "톤, 채도, 곡선, 그림자 또는 하이라이트와 같은 조정된 속성",
			label: "색상 또는 노출 편집"
		},
		"c2pa.created": {
			description: "새 파일 또는 콘텐츠 생성됨",
			label: "생성됨"
		},
		"c2pa.cropped": {
			description: "사용된 자르기 도구, 보이는 콘텐츠 영역 축소 또는 확장",
			label: "자르기 편집"
		},
		"c2pa.drawing": {
			description: "연필, 브러시, 지우개 또는 모양, 경로 또는 펜 도구와 같은 사용된 도구",
			label: "그리기 편집"
		},
		"c2pa.edited": {
			description: "기타 변경 사항 적용됨",
			label: "기타 편집"
		},
		"c2pa.filtered": {
			description: "필터, 스타일 또는 효과와 같은 모양 변경에 사용된 도구",
			label: "필터 또는 스타일 편집"
		},
		"c2pa.opened": {
			description: "기존 파일 열림",
			label: "열림"
		},
		"c2pa.orientation": {
			description: "변경된 위치 또는 방향 (회전, 반전 등)",
			label: "방향 편집"
		},
		"c2pa.placed": {
			description: "이 파일에 기존 콘텐츠 추가됨",
			label: "가져옴"
		},
		"c2pa.resized": {
			description: "변경된 치수 또는 파일 크기",
			label: "크기 조정 편집"
		},
		"c2pa.unknown": {
			description: "수행되었으나 인식할 수 없는 기타 편집 또는 활동",
			label: "알 수 없는 편집 또는 활동"
		}
	}
};
var koKR = {
	selectors: selectors$a
};

var selectors$9 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Justerte egenskaper som tone, metning, kurver, skygger eller høylys",
			label: "Farge- eller eksponeringsredigeringer"
		},
		"c2pa.created": {
			description: "Opprettet en ny fil eller nytt innhold",
			label: "Opprettet"
		},
		"c2pa.cropped": {
			description: "Brukte beskjæringsverktøy for å redusere eller utvide synlig innholdsområde",
			label: "Beskjæringsredigeringer"
		},
		"c2pa.drawing": {
			description: "Brukte verktøy som blyanter, pensler, viskelær eller form-, bane- eller pennverktøy",
			label: "Tegneredigeringer"
		},
		"c2pa.edited": {
			description: "Gjorde andre endringer",
			label: "Andre redigeringer"
		},
		"c2pa.filtered": {
			description: "Brukte verktøy som filtre, stiler eller effekter for å endre utseende",
			label: "Filter- eller stilredigeringer"
		},
		"c2pa.opened": {
			description: "Åpnet en eksisterende fil",
			label: "Åpnet"
		},
		"c2pa.orientation": {
			description: "Endret posisjon eller retning (rotert, snudd osv.)",
			label: "Retnings- redigeringer"
		},
		"c2pa.placed": {
			description: "La til eksisterende innhold i denne filen",
			label: "Importert"
		},
		"c2pa.resized": {
			description: "Endret dimensjoner eller filstørrelse",
			label: "Størrelsesendringer"
		},
		"c2pa.unknown": {
			description: "Utførte andre redigeringer eller aktiviteter som ikke gjenkjennes",
			label: "Ukjent endring eller aktivitet"
		}
	}
};
var nbNO = {
	selectors: selectors$9
};

var selectors$8 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Eigenschappen zoals tint, verzadiging, curven, schaduwen of hooglichten aangepast",
			label: "Kleur- of belichtingsbewerkingen"
		},
		"c2pa.created": {
			description: "Een nieuw bestand of content gemaakt",
			label: "Gemaakt"
		},
		"c2pa.cropped": {
			description: "Uitsnedegereedschappen gebruikt om het zichtbare deel van de content te beperken of uit te breiden",
			label: "Uitsnedebewerkingen"
		},
		"c2pa.drawing": {
			description: "Gereedschappen gebruikt zoals potloden, penselen, gummetjes, pennen of vorm- of padgereedschappen",
			label: "Tekenbewerkingen"
		},
		"c2pa.edited": {
			description: "Andere wijzigingen aangebracht",
			label: "Andere bewerkingen"
		},
		"c2pa.filtered": {
			description: "Gereedschappen zoals filters, stijlen of effecten gebruikt om het uiterlijk te veranderen",
			label: "Filter- of stijlbewerkingen"
		},
		"c2pa.opened": {
			description: "Een bestaand bestand geopend",
			label: "Geopend"
		},
		"c2pa.orientation": {
			description: "Positie of stand gewijzigd (gedraaid, gespiegeld etc.)",
			label: "Afdrukstand bewerkingen"
		},
		"c2pa.placed": {
			description: "Bestaande content aan dit bestand toegevoegd",
			label: "Geïmporteerd"
		},
		"c2pa.resized": {
			description: "Afmetingen of bestandsgrootte gewijzigd",
			label: "Formaatbewerkingen"
		},
		"c2pa.unknown": {
			description: "Andere bewerkingen of activiteiten uitgevoerd die niet konden worden herkend",
			label: "Onbekende bewerkingen of activiteiten"
		}
	}
};
var nlNL = {
	selectors: selectors$8
};

var selectors$7 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Zmodyfikowano właściwości, takie jak tonacja, nasycenie, krzywe, cienie lub światła",
			label: "Wprowadzono zmiany kolorów lub ekspozycji"
		},
		"c2pa.created": {
			description: "Utworzono nowy plik lub zawartość",
			label: "Utworzono"
		},
		"c2pa.cropped": {
			description: "Użyto narzędzi do kadrowania w celu zmniejszenia lub rozszerzenia widocznego obszaru zawartości",
			label: "Modyfikacje polegające na kadrowaniu"
		},
		"c2pa.drawing": {
			description: "Użyto takich narzędzi, jak ołówki, pędzle i gumki albo narzędzi kształtów, ścieżek lub pióra",
			label: "Modyfikacje rysunkowe"
		},
		"c2pa.edited": {
			description: "Wprowadzono inne zmiany",
			label: "Inne modyfikacje"
		},
		"c2pa.filtered": {
			description: "Użyto narzędzi, takich jak filtry, style lub efekty, aby zmienić wygląd",
			label: "Edycje filtrów lub stylów"
		},
		"c2pa.opened": {
			description: "Otwarto wcześniej istniejący plik",
			label: "Otwarto"
		},
		"c2pa.orientation": {
			description: "Zmieniono pozycję lub orientację (obrócono, odwrócono itp.)",
			label: "Orientacja modyfikacje"
		},
		"c2pa.placed": {
			description: "Dodano wcześniej istniejącą zawartość do tego pliku",
			label: "Zaimportowano"
		},
		"c2pa.resized": {
			description: "Zmieniono wymiary lub rozmiar pliku",
			label: "Modyfikacje polegające na zmianie rozmiaru"
		},
		"c2pa.unknown": {
			description: "Dokonano innych zmian lub wykonano operacje, których nie można rozpoznać",
			label: "Nieznane zmiany lub operacje"
		}
	}
};
var plPL = {
	selectors: selectors$7
};

var selectors$6 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Propriedades como tom, saturação, curvas, sombras ou realces ajustadas",
			label: "Edições de cor ou exposição"
		},
		"c2pa.created": {
			description: "Arquivo ou conteúdo criado",
			label: "Criado"
		},
		"c2pa.cropped": {
			description: "Ferramentas de corte usadas, reduzindo ou expandindo a área de conteúdo visível",
			label: "Edições de corte"
		},
		"c2pa.drawing": {
			description: "Ferramentas como lápis, pincéis, borrachas ou ferramentas de forma, caminho ou caneta usadas",
			label: "Edições de desenho"
		},
		"c2pa.edited": {
			description: "Outras alterações feitas",
			label: "Outras edições"
		},
		"c2pa.filtered": {
			description: "Ferramentas como filtros, estilos ou efeitos usadas para alterar a aparência",
			label: "Edições de filtro ou estilo"
		},
		"c2pa.opened": {
			description: "Arquivo pré-existente aberto",
			label: "Aberto"
		},
		"c2pa.orientation": {
			description: "Posição ou orientação alterada (girado, invertido etc.)",
			label: "Edições de orientação"
		},
		"c2pa.placed": {
			description: "Conteúdo pré-existente adicionado a este arquivo",
			label: "Importado"
		},
		"c2pa.resized": {
			description: "Dimensões ou tamanho do arquivo alterados",
			label: "Edições de redimensionamento"
		},
		"c2pa.unknown": {
			description: "Não foi possível reconhecer outras edições ou atividades realizadas",
			label: "Edições ou atividades desconhecidas"
		}
	}
};
var ptBR = {
	selectors: selectors$6
};

var selectors$5 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Измененные свойства, например тон, насыщенность, кривые, тени или блики.",
			label: "Редактирование цвета или экспозиции"
		},
		"c2pa.created": {
			description: "Создан новый файл или контент",
			label: "Создано"
		},
		"c2pa.cropped": {
			description: "Используемые инструменты обрезки, уменьшение или расширение видимой области содержимого",
			label: "Редактирование обрезки"
		},
		"c2pa.drawing": {
			description: "Используемые инструменты, например карандаши, кисти, ластики или другие инструменты (форма, контур или перо)",
			label: "Редактирование чертежа"
		},
		"c2pa.edited": {
			description: "Внесены другие изменения",
			label: "Другие изменения"
		},
		"c2pa.filtered": {
			description: "Используемые инструменты для изменения внешнего вида, например фильтры, стили или эффекты",
			label: "Редактирование фильтров или стилей"
		},
		"c2pa.opened": {
			description: "Открыт ранее созданный файл",
			label: "Открыто"
		},
		"c2pa.orientation": {
			description: "Изменено положение или ориентация (повернуто, перевернуто и т. д.)",
			label: "Ориентация правки"
		},
		"c2pa.placed": {
			description: "В этот файл добавлен уже существующий контент",
			label: "Импортировано"
		},
		"c2pa.resized": {
			description: "Изменены размеры изображения или размер файла",
			label: "Изменение размеров"
		},
		"c2pa.unknown": {
			description: "Внесены другие правки или выполнены иные действия, которые не удалось распознать",
			label: "Неизвестные изменения или действия"
		}
	}
};
var ruRU = {
	selectors: selectors$5
};

var selectors$4 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Justerade egenskaper som ton, mättnad, kurvor, skuggor och högdagrar",
			label: "Redigering av färg eller exponering"
		},
		"c2pa.created": {
			description: "Skapade en ny fil eller nytt innehåll",
			label: "Skapade"
		},
		"c2pa.cropped": {
			description: "Använde beskärningsverktyg, minskade eller utökade synligt innehållsområde",
			label: "Redigering av beskärning"
		},
		"c2pa.drawing": {
			description: "Använde verktyg som pennor, penslar, suddgummin eller verktygen form, bana eller penna",
			label: "Redigering av teckning"
		},
		"c2pa.edited": {
			description: "Gjorde andra ändringar",
			label: "Annan redigering"
		},
		"c2pa.filtered": {
			description: "Använde verktyg som filter, stilar eller effekter för att ändra utseende",
			label: "Redigering av filter eller stil"
		},
		"c2pa.opened": {
			description: "Öppnade en befintlig fil",
			label: "Öppnade"
		},
		"c2pa.orientation": {
			description: "Ändrade placering eller orientering (roterad, vänd osv.)",
			label: "Orientering redigering"
		},
		"c2pa.placed": {
			description: "Lade till befintligt innehåll i den här filen",
			label: "Importerade"
		},
		"c2pa.resized": {
			description: "Ändrade mått eller filstorlek",
			label: "Redigering av storleksändring"
		},
		"c2pa.unknown": {
			description: "Utförde andra redigeringar eller aktiviteter som inte kunde identifieras",
			label: "Okänd redigering eller aktivitet"
		}
	}
};
var svSE = {
	selectors: selectors$4
};

var selectors$3 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Ton, doygunluk, eğriler, gölgeler veya vurgular gibi ayarlanmış özellikler",
			label: "Renk veya pozlama düzenlemeleri"
		},
		"c2pa.created": {
			description: "Yeni bir dosya veya içerik oluşturuldu",
			label: "Oluşturuldu"
		},
		"c2pa.cropped": {
			description: "Kırpma araçları kullanılarak görünür içerik alanı küçültüldü veya genişletildi",
			label: "Kırpma düzenlemeleri"
		},
		"c2pa.drawing": {
			description: "Kurşun kalem, fırça, silgi veya şekil, yol ya da kalem araçları gibi araçlar kullanıldı",
			label: "Çizim düzenlemeleri"
		},
		"c2pa.edited": {
			description: "Diğer değişiklikler yapıldı",
			label: "Diğer düzenlemeler"
		},
		"c2pa.filtered": {
			description: "Görünümü değiştirmek için filtre, stil veya efekt gibi araçlar kullanıldı",
			label: "Filtre veya stil düzenlemeleri"
		},
		"c2pa.opened": {
			description: "Mevcut bir dosya açıldı",
			label: "Açıldı"
		},
		"c2pa.orientation": {
			description: "Konum veya yönlendirme değiştirildi (döndürüldü, ters çevrildi vb.)",
			label: "Yönlendirme düzenlemeleri"
		},
		"c2pa.placed": {
			description: "Mevcut içerik bu dosyaya eklendi",
			label: "İçe aktarıldı"
		},
		"c2pa.resized": {
			description: "Boyutlar veya dosya boyutu değiştirildi",
			label: "Yeniden boyutlandırma düzenlemeleri"
		},
		"c2pa.unknown": {
			description: "Algılanamayan başka düzenlemeler veya etkinlikler gerçekleştirildi",
			label: "Bilinmeyen düzenlemeler veya etkinlikler"
		}
	}
};
var trTR = {
	selectors: selectors$3
};

var selectors$2 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "Скориговано властивості, як-от тон, насиченість, криві, тіні або підсвічування",
			label: "Зміни кольору або експозиції"
		},
		"c2pa.created": {
			description: "Створено новий файл або вміст",
			label: "Створено"
		},
		"c2pa.cropped": {
			description: "Використано інструменти кадрування, зменшення або розширення області видимого вмісту",
			label: "Зміни кадрування"
		},
		"c2pa.drawing": {
			description: "Використано інструменти, як-от олівці, пензлі, гумки, або інструменти для форм, контурів або пера",
			label: "Зміни малювання"
		},
		"c2pa.edited": {
			description: "Внесено інші зміни",
			label: "Інші зміни"
		},
		"c2pa.filtered": {
			description: "Використано інструменти, як-от фільтри, стилі чи ефекти для зміни вигляду",
			label: "Зміни фільтру або стилю"
		},
		"c2pa.opened": {
			description: "Відкрито вже існуючий файл",
			label: "Відкрито"
		},
		"c2pa.orientation": {
			description: "Змінено положення або орієнтація (повернуто, віддзеркалено тощо)",
			label: "Зміни орієнтації"
		},
		"c2pa.placed": {
			description: "Додано вже існуючий вміст до цього файлу",
			label: "Імпортовано"
		},
		"c2pa.resized": {
			description: "Змінено геометричні розміри або розмір файлу",
			label: "Зміни розміру"
		},
		"c2pa.unknown": {
			description: "Виконано інші зміни або дії, які не вдалося розпізнати",
			label: "Невідомі зміни чи дії"
		}
	}
};
var ukUA = {
	selectors: selectors$2
};

var selectors$1 = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "调整后的属性，如色调、饱和度、曲线、阴影或高光",
			label: "颜色或曝光度编辑"
		},
		"c2pa.created": {
			description: "已创建新文件或内容",
			label: "已创建"
		},
		"c2pa.cropped": {
			description: "已使用的裁切工具（用于减少或扩大可见内容区域）",
			label: "裁切编辑"
		},
		"c2pa.drawing": {
			description: "已使用的工具，如铅笔、画笔、橡皮擦、形状、路径或钢笔工具",
			label: "绘图编辑"
		},
		"c2pa.edited": {
			description: "已执行其他更改",
			label: "其他编辑"
		},
		"c2pa.filtered": {
			description: "已使用滤镜、样式或效果等工具来更改外观",
			label: "滤镜或样式编辑"
		},
		"c2pa.opened": {
			description: "已打开一个预先存在的文件",
			label: "已打开"
		},
		"c2pa.orientation": {
			description: "已改变位置或方向（旋转、翻转等）",
			label: "方向 编辑"
		},
		"c2pa.placed": {
			description: "已向此文件添加预先存在的内容",
			label: "已导入"
		},
		"c2pa.resized": {
			description: "已更改尺寸或文件大小",
			label: "调整编辑大小"
		},
		"c2pa.unknown": {
			description: "已执行其他无法识别的编辑或活动",
			label: "未知的编辑或活动"
		}
	}
};
var zhCN = {
	selectors: selectors$1
};

var selectors = {
	editsAndActivity: {
		"c2pa.color_adjustments": {
			description: "調整了屬性，如色調、飽和度、曲線、陰影或亮部",
			label: "顏色或曝光編輯"
		},
		"c2pa.created": {
			description: "建立了新檔案或內容",
			label: "已建立"
		},
		"c2pa.cropped": {
			description: "使用了裁切工具，縮減或擴大可見內容區域",
			label: "裁切編輯"
		},
		"c2pa.drawing": {
			description: "使用了鉛筆、筆刷、橡皮擦等工具，或是形狀、路徑或鋼筆工具",
			label: "繪圖編輯"
		},
		"c2pa.edited": {
			description: "進行了其他變更",
			label: "其他編輯"
		},
		"c2pa.filtered": {
			description: "使用了濾鏡、風格或效果等工具來變更外觀",
			label: "濾鏡或風格編輯"
		},
		"c2pa.opened": {
			description: "開啟了已存在的檔案",
			label: "已開啟"
		},
		"c2pa.orientation": {
			description: "變更了位置或方向 (旋轉、翻轉等)",
			label: "方向編輯"
		},
		"c2pa.placed": {
			description: "對此檔案新增了已存在的內容",
			label: "已讀入"
		},
		"c2pa.resized": {
			description: "變更了尺寸或檔案大小",
			label: "調整大小編輯"
		},
		"c2pa.unknown": {
			description: "執行了其他無法辨識的編輯或活動",
			label: "未知的編輯或活動"
		}
	}
};
var zhTW = {
	selectors: selectors
};

var locales = /*#__PURE__*/Object.freeze({
	__proto__: null,
	cs_CZ: csCZ,
	da_DK: daDK,
	de_DE: deDE,
	en_US: enUS,
	es_ES: esES,
	fi_FI: fiFI,
	fr_FR: frFR,
	hu_HU: huHU,
	it_IT: itIT,
	ja_JP: jaJP,
	ko_KR: koKR,
	nb_NO: nbNO,
	nl_NL: nlNL,
	pl_PL: plPL,
	pt_BR: ptBR,
	ru_RU: ruRU,
	sv_SE: svSE,
	tr_TR: trTR,
	uk_UA: ukUA,
	zh_CN: zhCN,
	zh_TW: zhTW
});

var unknown = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20AlertCircle%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M7.84555%2C12.88618a1.13418%2C1.13418%2C0%2C0%2C1%2C1.1161-1.15195q.042-.00064.08391.00178a1.116%2C1.116%2C0%2C0%2C1%2C1.2%2C1.15017%2C1.09065%2C1.09065%2C0%2C0%2C1-1.2%2C1.11661%2C1.0908%2C1.0908%2C0%2C0%2C1-1.2-1.11661ZM10.0625%2C4.39771a.20792.20792%2C0%2C0%2C1%2C.09966.183V5.62212c0%2C1.40034-.28322%2C3.98034-.33305%2C4.48067%2C0%2C.04984-.01678.09967-.11695.09967H8.379a.11069.11069%2C0%2C0%2C1-.11695-.09967c-.03305-.46678-.3-3.0305-.3-4.43084V4.6306a.1773.1773%2C0%2C0%2C1%2C.08339-.18306%2C2.88262%2C2.88262%2C0%2C0%2C1%2C1.00017-.20033A3.27435%2C3.27435%2C0%2C0%2C1%2C10.0625%2C4.39771ZM17.50005%2C9A8.50005%2C8.50005%2C0%2C1%2C1%2C9%2C.5H9A8.50008%2C8.50008%2C0%2C0%2C1%2C17.50005%2C9ZM15.67484%2C9A6.67485%2C6.67485%2C0%2C1%2C0%2C9%2C15.6748H9A6.67479%2C6.67479%2C0%2C0%2C0%2C15.67484%2C9Z%22%20%2F%3E%3C%2Fsvg%3E";

var colorAdjustements = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20ColorPalette%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M11.807%2C3.0725c-2.1855-.35-4.503%2C0-4.824%2C1.046a1.146%2C1.146%2C0%2C0%2C0%2C.647%2C1.454A1.549%2C1.549%2C0%2C0%2C1%2C8.1995%2C7.843a1.41449%2C1.41449%2C0%2C0%2C1-1.5625.563C4.763%2C7.9325%2C2.6905%2C6.965.9945%2C8.5785-.55%2C10.05.079%2C12.233%2C1.577%2C13.421a11.7%2C11.7%2C0%2C0%2C0%2C7.2565%2C2.637c4.793%2C0%2C9.0665-2.8255%2C9.0665-6.558C17.9%2C5.721%2C14.316%2C3.4715%2C11.807%2C3.0725Zm-7.46%2C10.654a1.9%2C1.9%2C0%2C1%2C1%2C1.9-1.9A1.9%2C1.9%2C0%2C0%2C1%2C4.347%2C13.7265Zm9.643-8.017a1.25%2C1.25%2C0%2C1%2C1-1.25%2C1.25A1.25%2C1.25%2C0%2C0%2C1%2C13.99%2C5.7095Zm-5.351%2C9.07a1.7805%2C1.7805%2C0%2C1%2C1%2C1.7795-1.7825V13A1.78%2C1.78%2C0%2C0%2C1%2C8.639%2C14.7795Zm3.895-.748a1.5035%2C1.5035%2C0%2C1%2C1%2C1.501-1.507v.005A1.50249%2C1.50249%2C0%2C0%2C1%2C12.534%2C14.0315ZM15%2C11.28a1.3375%2C1.3375%2C0%2C1%2C1%2C1.337-1.338v.0005A1.337%2C1.337%2C0%2C0%2C1%2C15.0005%2C11.28Z%22%20%2F%3E%3C%2Fsvg%3E";

var cropped = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Crop%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M12%2C11h2V4.5a.5.5%2C0%2C0%2C0-.5-.5H7V6h5Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M6%2C12V1.5A.5.5%2C0%2C0%2C0%2C5.5%2C1h-1a.5.5%2C0%2C0%2C0-.5.5V4H1.5a.5.5%2C0%2C0%2C0-.5.5v1a.5.5%2C0%2C0%2C0%2C.5.5H4v7.5a.5.5%2C0%2C0%2C0%2C.5.5H12v2.5a.5.5%2C0%2C0%2C0%2C.5.5h1a.5.5%2C0%2C0%2C0%2C.5-.5V14h2.5a.5.5%2C0%2C0%2C0%2C.5-.5v-1a.5.5%2C0%2C0%2C0-.5-.5Z%22%20%2F%3E%3C%2Fsvg%3E";

var drawing = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Draw%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M10.227%2C4%2C2.542%2C11.686a.496.496%2C0%2C0%2C0-.1255.2105L1.0275%2C16.55c-.057.188.2295.425.3915.425a.15587.15587%2C0%2C0%2C0%2C.031-.003c.138-.032%2C3.9335-1.172%2C4.6555-1.389a.492.492%2C0%2C0%2C0%2C.2075-.125L14%2C7.772ZM5.7%2C14.658c-1.0805.3245-2.431.7325-3.3645%2C1.011L3.34%2C12.304Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M16.7835%2C4.1%2C13.9%2C1.216a.60751.60751%2C0%2C0%2C0-.433-.1765H13.45a.686.686%2C0%2C0%2C0-.4635.2035l-2.05%2C2.05L14.708%2C7.0645l2.05-2.05a.686.686%2C0%2C0%2C0%2C.2-.4415A.612.612%2C0%2C0%2C0%2C16.7835%2C4.1Z%22%20%2F%3E%3C%2Fsvg%3E";

var edited = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20EditInLight%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M17.8225%2C8.3425%2C15.6605%2C6.181a.456.456%2C0%2C0%2C0-.325-.1325h-.014a.51748.51748%2C0%2C0%2C0-.35.15l-7.616%2C7.621a.368.368%2C0%2C0%2C0-.094.1575l-1.222%2C3.67c-.0425.141.1725.319.294.319l.023-.0025c.1035-.024%2C3.13-1.059%2C3.672-1.222a.36653.36653%2C0%2C0%2C0%2C.155-.0935L17.8%2C9.0295a.515.515%2C0%2C0%2C0%2C.15-.331A.458.458%2C0%2C0%2C0%2C17.8225%2C8.3425Zm-10.803%2C8.644.989-2.7595%2C1.77%2C1.7655C8.968%2C16.236%2C7.7195%2C16.7775%2C7.0195%2C16.9865Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M13.5%2C1H1.5a.5.5%2C0%2C0%2C0-.5.5v12a.5.5%2C0%2C0%2C0%2C.5.5H6.0385l.1125-.339a1.35%2C1.35%2C0%2C0%2C1%2C.336-.55L6.6%2C13H2V2H13V6.583l1-1V1.5A.5.5%2C0%2C0%2C0%2C13.5%2C1Z%22%20%2F%3E%3C%2Fsvg%3E";

var opened = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Import%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M16.5%2C1H5.5a.5.5%2C0%2C0%2C0-.5.5v3a.5.5%2C0%2C0%2C0%2C.5.5h1A.5.5%2C0%2C0%2C0%2C7%2C4.5V3h8V15H7V13.5a.5.5%2C0%2C0%2C0-.5-.5h-1a.5.5%2C0%2C0%2C0-.5.5v3a.5.5%2C0%2C0%2C0%2C.5.5h11a.5.5%2C0%2C0%2C0%2C.5-.5V1.5A.5.5%2C0%2C0%2C0%2C16.5%2C1Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22a%22%20d%3D%22M8%2C12.6a.4.4%2C0%2C0%2C0%2C.4.4.39352.39352%2C0%2C0%2C0%2C.2635-.1l3.762-3.7225a.25.25%2C0%2C0%2C0%2C0-.35L8.666%2C5.1A.39352.39352%2C0%2C0%2C0%2C8.4025%2C5a.4.4%2C0%2C0%2C0-.4.4V8H1.5a.5.5%2C0%2C0%2C0-.5.5v1a.5.5%2C0%2C0%2C0%2C.5.5H8Z%22%20%2F%3E%3C%2Fsvg%3E";

var combinedAssets = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Layers%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M14.144%2C9.969%2C9.2245%2C13.3825a.3945.3945%2C0%2C0%2C1-.45%2C0L3.856%2C9.969.929%2C12a.1255.1255%2C0%2C0%2C0%2C0%2C.2055l7.925%2C5.5a.2575.2575%2C0%2C0%2C0%2C.292%2C0l7.925-5.5a.1255.1255%2C0%2C0%2C0%2C0-.2055Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22a%22%20d%3D%22M8.85%2C11.494.929%2C6a.1245.1245%2C0%2C0%2C1%2C0-.205L8.85.297a.265.265%2C0%2C0%2C1%2C.3%2C0l7.921%2C5.496a.1245.1245%2C0%2C0%2C1%2C0%2C.205L9.15%2C11.494A.265.265%2C0%2C0%2C1%2C8.85%2C11.494Z%22%20%2F%3E%3C%2Fsvg%3E";

var created = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20NewItem%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M15.5%2C2H2.5a.5.5%2C0%2C0%2C0-.5.5V9H8.5a.5.5%2C0%2C0%2C1%2C.5.5V16h6.5a.5.5%2C0%2C0%2C0%2C.5-.5V2.5A.5.5%2C0%2C0%2C0%2C15.5%2C2Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M8%2C16H7.957a.5.5%2C0%2C0%2C1-.3535-.1465l-5.457-5.457A.5.5%2C0%2C0%2C1%2C2%2C10.043V10H8Z%22%20%2F%3E%3C%2Fsvg%3E";

var threed = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Orbit%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M13.8785%2C6.9355A3.9915%2C3.9915%2C0%2C0%2C0%2C6.35%2C4.374c-.331-.0255-.659-.045-.974-.045C2.6525%2C4.329.5785%2C5.2745.1%2C7c-.52%2C1.8845%2C1.019%2C4.186%2C3.678%2C5.973L2.3545%2C14.6805A.1905.1905%2C0%2C0%2C0%2C2.5%2C14.993H8.95L6.045%2C10.635a.191.191%2C0%2C0%2C0-.305-.0165L4.7555%2C11.8c-2.25-1.471-3.5-3.25-3.1855-4.3935.261-.944%2C1.756-1.554%2C3.8085-1.554.2055%2C0%2C.421.018.633.0305C6.0115%2C5.923%2C6%2C5.96%2C6%2C6a3.9925%2C3.9925%2C0%2C0%2C0%2C7.2385%2C2.332c2.2%2C1.4605%2C3.4045%2C3.214%2C3.091%2C4.345-.2605.944-1.7555%2C1.554-3.807%2C1.554-.283%2C0-.5745-.0155-.87-.041a.3805.3805%2C0%2C0%2C0-.41571.34168l-.00179.03382v.766a.386.386%2C0%2C0%2C0%2C.353.3835c.3185.025.631.0395.9345.0395%2C2.725%2C0%2C4.8-.9455%2C5.276-2.671C18.3365%2C11.1395%2C16.694%2C8.7445%2C13.8785%2C6.9355Z%22%20%2F%3E%3C%2Fsvg%3E";

var filtered = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Properties%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M16.75%2C3H7.95a2.5%2C2.5%2C0%2C0%2C0-4.9%2C0H1.25A.25.25%2C0%2C0%2C0%2C1%2C3.25v.5A.25.25%2C0%2C0%2C0%2C1.25%2C4h1.8a2.5%2C2.5%2C0%2C0%2C0%2C4.9%2C0h8.8A.25.25%2C0%2C0%2C0%2C17%2C3.75v-.5A.25.25%2C0%2C0%2C0%2C16.75%2C3ZM5.5%2C5A1.5%2C1.5%2C0%2C1%2C1%2C7%2C3.5%2C1.5%2C1.5%2C0%2C0%2C1%2C5.5%2C5Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M16.75%2C13H9.95a2.5%2C2.5%2C0%2C0%2C0-4.9%2C0H1.25a.25.25%2C0%2C0%2C0-.25.25v.5a.25.25%2C0%2C0%2C0%2C.25.25h3.8a2.5%2C2.5%2C0%2C0%2C0%2C4.9%2C0h6.8a.25.25%2C0%2C0%2C0%2C.25-.25v-.5A.25.25%2C0%2C0%2C0%2C16.75%2C13ZM7.5%2C15A1.5%2C1.5%2C0%2C1%2C1%2C9%2C13.5%2C1.5%2C1.5%2C0%2C0%2C1%2C7.5%2C15Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M1%2C8.25v.5A.25.25%2C0%2C0%2C0%2C1.25%2C9h8.8a2.5%2C2.5%2C0%2C0%2C0%2C4.9%2C0h1.8A.25.25%2C0%2C0%2C0%2C17%2C8.75v-.5A.25.25%2C0%2C0%2C0%2C16.75%2C8h-1.8a2.5%2C2.5%2C0%2C0%2C0-4.9%2C0H1.25A.25.25%2C0%2C0%2C0%2C1%2C8.25ZM11%2C8.5A1.5%2C1.5%2C0%2C1%2C1%2C12.5%2C10%2C1.5%2C1.5%2C0%2C0%2C1%2C11%2C8.5Z%22%20%2F%3E%3C%2Fsvg%3E";

var resized = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Resize%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M15.5%2C2H2.5a.5.5%2C0%2C0%2C0-.5.5v13a.5.5%2C0%2C0%2C0%2C.5.5h13a.5.5%2C0%2C0%2C0%2C.5-.5V2.5A.5.5%2C0%2C0%2C0%2C15.5%2C2ZM9%2C10.414l2.207-2.207%2C1.366%2C1.366A.25.25%2C0%2C0%2C0%2C13%2C9.3965V5H8.6035a.25.25%2C0%2C0%2C0-.177.427l1.366%2C1.366L7.586%2C9H4V4H14V14H9Z%22%20%2F%3E%3C%2Fsvg%3E";

var orientation = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20RotateLeftOutline%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M16.5%2C5H5.5a.5.5%2C0%2C0%2C0-.5.5v11a.5.5%2C0%2C0%2C0%2C.5.5h11a.5.5%2C0%2C0%2C0%2C.5-.5V5.5A.5.5%2C0%2C0%2C0%2C16.5%2C5ZM16%2C16H6V6H16Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M3.75%2C7.5h-1V6a3%2C3%2C0%2C0%2C1%2C3-3h1a.5.5%2C0%2C0%2C0%2C.5-.5V2a.5.5%2C0%2C0%2C0-.5-.5h-1A4.5%2C4.5%2C0%2C0%2C0%2C1.25%2C6V7.5h-1A.25.25%2C0%2C0%2C0%2C0%2C7.75a.245.245%2C0%2C0%2C0%2C.0735.175L1.842%2C9.9415a.25.25%2C0%2C0%2C0%2C.316%2C0L3.9265%2C7.925A.245.245%2C0%2C0%2C0%2C4%2C7.75.25.25%2C0%2C0%2C0%2C3.75%2C7.5Z%22%20%2F%3E%3C%2Fsvg%3E";

var placed = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.fill%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20SaveToLight%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22fill%22%20d%3D%22M16.5%2C4H13V5h3V15H2V5H5V4H1.5a.5.5%2C0%2C0%2C0-.5.5v11a.5.5%2C0%2C0%2C0%2C.5.5h15a.5.5%2C0%2C0%2C0%2C.5-.5V4.5A.5.5%2C0%2C0%2C0%2C16.5%2C4Z%22%20%2F%3E%20%20%3Cpath%20class%3D%22fill%22%20d%3D%22M12.3965%2C7H10V.25A.25.25%2C0%2C0%2C0%2C9.75%2C0H8.25A.25.25%2C0%2C0%2C0%2C8%2C.25V7H5.6035a.25.25%2C0%2C0%2C0-.1765.427L9%2C11l3.573-3.573A.25.25%2C0%2C0%2C0%2C12.3965%2C7Z%22%20%2F%3E%3C%2Fsvg%3E";

var text = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20Text%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M2.5%2C2a.5.5%2C0%2C0%2C0-.5.5v3a.5.5%2C0%2C0%2C0%2C.5.5h1A.5.5%2C0%2C0%2C0%2C4%2C5.5V4H8V14H6.5a.5.5%2C0%2C0%2C0-.5.5v1a.5.5%2C0%2C0%2C0%2C.5.5h5a.5.5%2C0%2C0%2C0%2C.5-.5v-1a.5.5%2C0%2C0%2C0-.5-.5H10V4h4V5.5a.5.5%2C0%2C0%2C0%2C.5.5h1a.5.5%2C0%2C0%2C0%2C.5-.5v-3a.5.5%2C0%2C0%2C0-.5-.5Z%22%20%2F%3E%3C%2Fsvg%3E";

var animationVideo = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20width%3D%2218%22%3E%20%20%3Cdefs%3E%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20.a%20%7B%20%20%20%20%20%20%20%20fill%3A%20%236E6E6E%3B%20%20%20%20%20%20%7D%20%20%20%20%3C%2Fstyle%3E%20%20%3C%2Fdefs%3E%20%20%3Ctitle%3ES%20VideoOutline%2018%20N%3C%2Ftitle%3E%20%20%3Crect%20id%3D%22Canvas%22%20fill%3D%22%23ff13dc%22%20opacity%3D%220%22%20width%3D%2218%22%20height%3D%2218%22%20%2F%3E%3Cpath%20class%3D%22a%22%20d%3D%22M15.5%2C2H2.5a.5.5%2C0%2C0%2C0-.5.5v13a.5.5%2C0%2C0%2C0%2C.5.5h13a.5.5%2C0%2C0%2C0%2C.5-.5V2.5A.5.5%2C0%2C0%2C0%2C15.5%2C2ZM5%2C14.75a.25.25%2C0%2C0%2C1-.25.25H3.25A.25.25%2C0%2C0%2C1%2C3%2C14.75v-1.5A.25.25%2C0%2C0%2C1%2C3.25%2C13h1.5a.25.25%2C0%2C0%2C1%2C.25.25Zm0-3.353a.25.25%2C0%2C0%2C1-.25.25H3.25a.25.25%2C0%2C0%2C1-.25-.25v-1.5a.25.25%2C0%2C0%2C1%2C.25-.25h1.5a.25.25%2C0%2C0%2C1%2C.25.25ZM5%2C8.103a.25.25%2C0%2C0%2C1-.25.25H3.25A.25.25%2C0%2C0%2C1%2C3%2C8.103v-1.5a.25.25%2C0%2C0%2C1%2C.25-.25h1.5a.25.25%2C0%2C0%2C1%2C.25.25ZM5%2C4.75A.25.25%2C0%2C0%2C1%2C4.75%2C5H3.25A.25.25%2C0%2C0%2C1%2C3%2C4.75V3.25A.25.25%2C0%2C0%2C1%2C3.25%2C3h1.5A.25.25%2C0%2C0%2C1%2C5%2C3.25ZM12%2C15H6V10h6Zm0-7H6V3h6Zm3%2C6.75a.25.25%2C0%2C0%2C1-.25.25h-1.5a.25.25%2C0%2C0%2C1-.25-.25v-1.5a.25.25%2C0%2C0%2C1%2C.25-.25h1.5a.25.25%2C0%2C0%2C1%2C.25.25Zm0-3.353a.25.25%2C0%2C0%2C1-.25.25h-1.5a.25.25%2C0%2C0%2C1-.25-.25v-1.5a.25.25%2C0%2C0%2C1%2C.25-.25h1.5a.25.25%2C0%2C0%2C1%2C.25.25Zm0-3.294a.25.25%2C0%2C0%2C1-.25.25h-1.5a.25.25%2C0%2C0%2C1-.25-.25v-1.5a.25.25%2C0%2C0%2C1%2C.25-.25h1.5a.25.25%2C0%2C0%2C1%2C.25.25ZM15%2C4.75a.25.25%2C0%2C0%2C1-.25.25h-1.5A.25.25%2C0%2C0%2C1%2C13%2C4.75V3.25A.25.25%2C0%2C0%2C1%2C13.25%2C3h1.5a.25.25%2C0%2C0%2C1%2C.25.25Z%22%20%2F%3E%3C%2Fsvg%3E";

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const icons = {
    'c2pa.color_adjustments': colorAdjustements,
    'c2pa.created': created,
    'c2pa.cropped': cropped,
    'c2pa.drawing': drawing,
    'c2pa.edited': edited,
    'c2pa.filtered': filtered,
    'c2pa.opened': opened,
    'c2pa.orientation': orientation,
    'c2pa.placed': placed,
    'c2pa.resized': resized,
    'c2pa.unknown': unknown,
    'com.adobe.3d': threed,
    'com.adobe.animation_video': animationVideo,
    'com.adobe.combined_asssets': combinedAssets,
    'com.adobe.text': text,
};

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const dbg = debug('c2pa:selector:editsAndActivity');
// Make sure we update the keys to conform to BCP 47 tags
const bcp47Mapping = mapKeys_1(locales, (_, key) => key.replace('_', '-'));
const DEFAULT_LOCALE = 'en-US';
const UNCATEGORIZED_ID = 'UNCATEGORIZED';
/**
 * Gets a list of translations for the requested locale from the packaged translation maps.
 * Any missing translations in other locales will be filled in with entries from the DEFAULT_LOCALE.
 *
 * @param locale - BCP-47 locale code (e.g. `en-US`, `fr-FR`) to request localized strings, if available
 */
function getPackagedTranslationsForLocale(locale = DEFAULT_LOCALE) {
    const defaultSet = (bcp47Mapping[DEFAULT_LOCALE]?.selectors
        ?.editsAndActivity ?? {});
    const requestedSet = (bcp47Mapping[locale]?.selectors?.editsAndActivity ??
        {});
    if (locale === DEFAULT_LOCALE) {
        return defaultSet;
    }
    return merge_1({}, defaultSet, requestedSet);
}
/**
 * Gets a list of categorized actions, derived from the provided manifest's `c2pa.action` assertion
 * and a dictionary assertion, if available. If a dictionary is incuded, this function will initiate
 * an HTTP request to fetch the dictionary data.
 *
 * @param manifest - Manifest to derive data from
 * @param locale - BCP-47 locale code (e.g. `en-US`, `fr-FR`) to request localized strings, if available
 * @param iconVariant - Requests icon variant (e.g. `light`, `dark`), if available
 * @returns List of translated action categories
 */
async function selectEditsAndActivity(manifest, locale = DEFAULT_LOCALE, iconVariant = 'dark') {
    const dictionaryAssertion = manifest.assertions.get('com.adobe.dictionary')[0] ??
        manifest.assertions.get('adobe.dictionary')[0];
    const [actionAssertion] = manifest.assertions.get('c2pa.actions');
    if (!actionAssertion) {
        return null;
    }
    if (dictionaryAssertion) {
        return getPhotoshopCategorizedActions(actionAssertion.data.actions, dictionaryAssertion.data.url, locale, iconVariant);
    }
    return getC2paCategorizedActions(actionAssertion, locale);
}
async function getPhotoshopCategorizedActions(actions, dictionaryUrl, locale = DEFAULT_LOCALE, iconVariant = 'dark') {
    const dictionary = await Downloader.cachedGetJson(dictionaryUrl);
    const categories = processCategories(actions.map((action) => translateActionName(dictionary, 
    // TODO: This should be resolved once we reconcile dictionary definitions
    action.parameters?.name ?? action.action, locale, iconVariant)));
    return categories;
}
/**
 * Gets a list of action categories, derived from the provided manifest's `c2pa.action` assertion.
 * This will also handle translations by providing a locale. This works for standard C2PA action assertion
 * data only.
 *
 * @param actionsAssertion - Action assertion data
 * @param locale - BCP-47 locale code (e.g. `en-US`, `fr-FR`) to request localized strings, if available
 * @returns List of translated action categories
 */
function getC2paCategorizedActions(actionsAssertion, locale = DEFAULT_LOCALE) {
    const actions = actionsAssertion.data.actions;
    const translations = getPackagedTranslationsForLocale(locale);
    const overrides = (actionsAssertion.data.metadata?.localizations ??
        []);
    const overrideObj = { actions: [] };
    // The spec has an array of objects, and each object can have multiple entries
    // of path keys to overrides, which is why we have to have a nested each.
    each(overrides, (override) => {
        each(override, (translationMap, path) => {
            const val = translationMap[locale] ?? translationMap[DEFAULT_LOCALE];
            if (val) {
                set_1(overrideObj, path, val);
            }
        });
    });
    const translatedActions = actions.map((action, idx) => {
        const actionOverrides = overrideObj.actions[idx] ?? {};
        const actionTranslations = translations[action.action];
        const iconId = action.action;
        return {
            // Include original ID
            id: action.action,
            // Get icon from parameters if they exist
            icon: action.parameters?.['com.adobe.icon'] ??
                icons[iconId],
            // Use override if available, if not, then fall back to translation
            label: actionOverrides.action ?? actionTranslations.label,
            // Use override if available, if not, then fall back to translation
            description: actionOverrides?.description ??
                actionTranslations?.description ??
                action.parameters.description,
        };
    });
    return processCategories(translatedActions);
}
/**
 * Pipeline to convert categories from the dictionary into a structure suitable for the
 * edits and activity web component. This also makes sure the categories are unique and sorted.
 */
const processCategories = flow(compact, uniqBy((category) => category.id), sortBy((category) => category.label));
/**
 * Uses the dictionary to translate an action name into category information
 */
function translateActionName(dictionary, actionId, locale, iconVariant) {
    const categoryId = dictionary.actions[actionId]?.category ?? UNCATEGORIZED_ID;
    if (categoryId === UNCATEGORIZED_ID) {
        dbg('Could not find category for actionId', actionId);
    }
    const category = dictionary.categories[categoryId];
    if (category) {
        return {
            id: categoryId,
            icon: category.icon?.replace('{variant}', iconVariant) ?? null,
            label: category.labels[locale],
            description: category.descriptions[locale],
        };
    }
    return null;
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Gets any social accounts associated with the producer of this manifest, derived from its
 * `stds.schema-org.CreativeWork` assertion, if available
 *
 * @param manifest - Manifest to derive data from
 */
function selectSocialAccounts(manifest) {
    const [cwAssertion] = manifest.assertions.get('stds.schema-org.CreativeWork');
    if (!cwAssertion) {
        return null;
    }
    const socialAccounts = cwAssertion.data.author?.filter((x) => x.hasOwnProperty('@id'));
    return socialAccounts;
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const OTGP_ERROR_CODE = 'assertion.dataHash.mismatch';
/**
 * Determines if a validation status list contains an OTGP (`assertion.dataHash.mismatch`)
 * status
 *
 * @param validationStatus
 * @returns `true` if we find an OTGP status
 */
function hasOtgpStatus(validationStatus = []) {
    return validationStatus.some((err) => err.code === OTGP_ERROR_CODE);
}
/**
 * Determines if a validation status list contains an error (anything not in the c2pa-rs
 * `C2PA_STATUS_VALID_SET` list _and_ not an OTGP status)
 *
 * @param validationStatus
 * @returns `true` if we find an error
 */
function hasErrorStatus(validationStatus = []) {
    return validationStatus.length > 0 && !hasOtgpStatus(validationStatus);
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Parses a generator string into a human-readable format
 *
 * @param value The claim generator/software agent string
 * @returns The formatted generator string
 */
function parseGenerator(value) {
    // We are stripping parenthesis so that any version matches in there don't influence the test
    const withoutParens = value.replace(/\([^)]*\)/g, '');
    // Old-style (XMP Agent) string (match space + version)
    if (/\s+\d+\.\d(\.\d)*\s+/.test(withoutParens)) {
        return value.split('(')[0]?.trim();
    }
    // User-Agent string
    // Split by space (the RFC uses the space as a separator)
    const firstItem = withoutParens.split(/\s+/)?.[0] ?? '';
    // Parse product name from version
    // Adobe_Photoshop/23.3.1 -> [Adobe_Photoshop, 23.3.1]
    const [product, version] = firstItem.split('/');
    // Replace underscores with spaces
    // Adobe_Photoshop -> Adobe Photoshop
    const formattedProduct = product.replace(/_/g, ' ');
    if (version) {
        return `${formattedProduct} ${version}`;
    }
    return formattedProduct;
}
function selectFormattedGenerator(manifest) {
    return parseGenerator(manifest.claimGenerator);
}

/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const genAiDigitalSourceTypes = [
    'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
    'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
    'http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia',
    'https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia',
];
function formatGenAiDigitalSourceTypes(type) {
    return type.substring(type.lastIndexOf('/') + 1);
}
/**
 * Gets any generative AI information from the manifest.
 *
 * @param manifest - Manifest to derive data from
 */
function selectGenerativeInfo(manifest) {
    const data = manifest.assertions.data.reduce((acc, assertion) => {
        // Check for legacy assertion
        if (assertion.label === 'com.adobe.generative-ai') {
            const { description, version } = assertion.data;
            const softwareAgent = [description, version]
                .map((x) => x?.trim() ?? '')
                .join(' ');
            return [
                ...acc,
                {
                    assertion,
                    type: 'legacy',
                    softwareAgent: softwareAgent,
                },
            ];
        }
        // Check for actions v1 assertion
        if (assertion.label === 'c2pa.actions') {
            const { actions } = assertion.data;
            const genAiActions = actions.reduce((actionAcc, action) => {
                const { digitalSourceType } = action;
                if (digitalSourceType &&
                    genAiDigitalSourceTypes.includes(digitalSourceType)) {
                    actionAcc.push({
                        assertion,
                        action: action,
                        type: formatGenAiDigitalSourceTypes(digitalSourceType),
                        softwareAgent: action.softwareAgent,
                    });
                }
                return actionAcc;
            }, []);
            return [...acc, ...genAiActions];
        }
        return acc;
    }, []);
    return data.length ? data : null;
}

/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Creates a manifest store representation suitable for use with c2pa-wc.
 *
 * @param manifestStore - c2pa manifest store object
 */
async function createL2ManifestStore(manifestStore) {
    const disposers = [];
    const activeManifest = manifestStore.activeManifest;
    const ingredients = activeManifest.ingredients.map((ingredient) => {
        const thumbnail = ingredient.thumbnail?.getUrl();
        if (thumbnail) {
            disposers.push(thumbnail.dispose);
        }
        return {
            title: ingredient.title,
            format: ingredient.format,
            thumbnail: thumbnail?.url ?? null,
            hasManifest: !!ingredient.manifest,
            error: getErrorStatus(ingredient.validationStatus),
            validationStatus: ingredient.validationStatus,
            documentId: ingredient.documentId,
        };
    });
    const producer = selectProducer(activeManifest);
    const editsAndActivity = await selectEditsAndActivity(activeManifest);
    const socialAccounts = selectSocialAccounts(activeManifest)?.map((socialAccount) => ({
        '@type': socialAccount['@type'],
        '@id': socialAccount['@id'],
        name: socialAccount.name,
        identifier: socialAccount.identifier,
    })) ?? null;
    const thumbnail = activeManifest.thumbnail?.getUrl();
    if (thumbnail) {
        disposers.push(thumbnail.dispose);
    }
    return {
        manifestStore: {
            ingredients,
            format: activeManifest.format,
            title: activeManifest.title,
            signature: activeManifest.signatureInfo
                ? {
                    issuer: activeManifest.signatureInfo.issuer ?? null,
                    isoDateString: activeManifest.signatureInfo.time ?? null,
                }
                : null,
            claimGenerator: {
                value: activeManifest.claimGenerator,
                product: selectFormattedGenerator(activeManifest),
            },
            producer: producer
                ? {
                    '@type': producer['@type'],
                    name: producer.name,
                    identifier: producer.identifier,
                }
                : null,
            socialAccounts,
            editsAndActivity,
            thumbnail: thumbnail?.url ?? null,
            isBeta: !!activeManifest.assertions.get('adobe.beta')?.[0]?.data.version,
            generativeInfo: selectGenerativeInfo(activeManifest),
            error: getErrorStatus(manifestStore.validationStatus),
            validationStatus: manifestStore.validationStatus,
        },
        dispose: () => {
            disposers.forEach((dispose) => dispose());
        },
    };
}
function getErrorStatus(validationStatus) {
    return hasOtgpStatus(validationStatus)
        ? 'otgp'
        : hasErrorStatus(validationStatus)
            ? 'error'
            : null;
}

export { createC2pa, createL2ManifestStore, generateVerifyUrl, getC2paCategorizedActions, parseGenerator, selectEditsAndActivity, selectFormattedGenerator, selectGenerativeInfo, selectProducer, selectSocialAccounts };
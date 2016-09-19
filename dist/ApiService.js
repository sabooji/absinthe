"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Request = require("./Request");

var _Request2 = _interopRequireDefault(_Request);

var _Response = require("./Response");

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INFO_LEVEL = "INFO";
var DEBUG_LEVEL = "DEBUG";

var DEFAULT_OPTIONS = {
	logging: {
		level: INFO_LEVEL
	},
	suppress: {
		emptyMeta: false,
		undefinedMetaItems: true,
		undefinedDataItems: true,
		emptyMetaItems: true,
		emptyDataItems: false
	}
};

exports.default = function (userOptions) {

	var passedInOptions = userOptions !== undefined ? userOptions : {};
	var options = Object.assign(DEFAULT_OPTIONS, userOptions);

	var requestMappings = {
		"POST": {},
		"GET": {},
		"DELETE": {}
	};

	function mapRequest(method, uri, handler) {
		debugLog("Adding request mapping for " + method.toUpperCase() + " " + uri.toUpperCase());
		requestMappings[method.toUpperCase()][uri.toUpperCase()] = handler;
	}

	function isDebugLog() {
		return options.logging.level === DEBUG_LEVEL;
	}
	function isInfoLog() {
		return options.logging.level === INFO_LEVEL;
	}
	function debugLog(message) {
		if (isDebugLog) {
			console.log(message);
		}
	}
	function infoLog(message) {
		if (isInfoLog || isDebugLog) {
			// TODO: should turn log levels into numbers to make this easier?
			console.log(message);
		}
	}

	function getHandlerByMethodAndUri(method, uri) {
		debugLog("Retreiving handler for " + method.toUpperCase() + " " + uri.toUpperCase());

		if (method !== undefined && uri !== undefined) {
			debugLog("Finding existing handler for " + method.toUpperCase() + " " + uri.toUpperCase());

			return requestMappings[method.toUpperCase()][uri.toUpperCase()];
		} else {
			debugLog("Missing parameters");
		}
		return undefined;
	}

	return {
		options: options,
		get: function get(uri, handler) {
			debugLog("Configuring GET " + uri);
			mapRequest("GET", uri, handler);
		},
		post: function post(uri, handler) {
			debugLog("Configuring POST " + uri);
			mapRequest("POST", uri, handler);
		},
		delete: function _delete(uri, handler) {
			debugLog("Configuring DELETE " + uri);
			mapRequest("DELETE", uri, handler);
		},
		router: function router(event, context, callback) {

			console.log(event);
			console.log(context);

			var request = new _Request2.default(event, context);
			var response = new _Response2.default(callback, options);

			var requestHandler = getHandlerByMethodAndUri(request.method, request.uri);

			if (requestHandler === undefined) {
				return callback("Failed to find a request mapping");
			} else {
				requestHandler(request, response);
			}
		}
	};
};
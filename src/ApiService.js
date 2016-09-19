"use strict";

import Request from "./Request";
import Response from "./Response";

const INFO_LEVEL = "INFO";
const DEBUG_LEVEL = "DEBUG";

const DEFAULT_OPTIONS = {
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



export default (function(userOptions) {

	const passedInOptions = userOptions !== undefined ? userOptions : {};
	const options = Object.assign(DEFAULT_OPTIONS, userOptions);

	const requestMappings = {
		"POST": {},
		"GET": {},
		"DELETE": {}
	};

	function mapRequest(method, uri, handler) {
		debugLog(`Adding request mapping for ${method.toUpperCase()} ${uri.toUpperCase()}`);
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
		if (isInfoLog || isDebugLog) { // TODO: should turn log levels into numbers to make this easier?
			console.log(message);
		}
	}

	function getHandlerByMethodAndUri (method, uri) {
		debugLog(`Retreiving handler for ${method.toUpperCase()} ${uri.toUpperCase()}`);

		if (method !== undefined && uri !== undefined) {
			debugLog(`Finding existing handler for ${method.toUpperCase()} ${uri.toUpperCase()}`);

			return requestMappings[method.toUpperCase()][uri.toUpperCase()];
		}
		else {
			debugLog("Missing parameters");
		}
		return undefined;
	}

	return {
		options: options,
		get: (uri, handler) => {
			debugLog(`Configuring GET ${uri}`);
			mapRequest("GET", uri, handler);
		},
		post: (uri, handler) => {
			debugLog(`Configuring POST ${uri}`);
			mapRequest("POST", uri, handler);
		},
		delete: (uri, handler) => {
			debugLog(`Configuring DELETE ${uri}`);
			mapRequest("DELETE", uri, handler);
		},
		router: (event, context, callback) => {

			console.log(event);
			console.log(context);

			const request = new Request(event, context);
			const response = new Response(callback, options);

			const requestHandler = getHandlerByMethodAndUri(request.method, request.uri);

			if (requestHandler === undefined) {
				return callback("Failed to find a request mapping");
			}
			else {
				requestHandler(request, response);
			}
		}
	};
});

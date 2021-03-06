"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (event, context) {
	return {
		method: event.context.method,
		uri: event.context.path,
		body: event.body,
		post: event.post,
		params: event.pathParams,
		headers: event.headers,
		query: event.queryString
	};
};
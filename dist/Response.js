"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require("./utils");

exports.default = function (callback, options) {
	var _this = this;

	if (options === undefined) {
		throw new Error("Missing options into the Response object.");
	}

	var _isRaw = false;
	var _body = {
		meta: {
			status: 200,
			apiRequestId: undefined,
			clientRequestId: undefined,
			dataAge: undefined,
			warnings: [],
			pagination: {},
			retryability: {
				isRetryable: undefined
			}
		},
		data: {},
		errors: []
	};
	var _headers = {};

	function removeItemsUsingRules(items, removeEmptyItems, removeUndefinedItems) {
		if (removeEmptyItems || removeUndefinedItems) {
			var objectKeys = Object.keys(items);

			for (var x = 0; x < objectKeys.length; x++) {

				console.log("Evaluating [" + objectKeys[x] + "] for removal");

				var valueToEvaluate = items[objectKeys[x]];

				if ((0, _utils._isObject)(valueToEvaluate)) {
					removeItemsUsingRules(valueToEvaluate, removeEmptyItems, removeUndefinedItems);
				}

				if (removeUndefinedItems && valueToEvaluate === undefined || removeEmptyItems && (0, _utils._isEmpty)(valueToEvaluate)) {

					console.log("Removing [" + objectKeys[x] + "]");
					delete items[objectKeys[x]];
				}
			}
		}
	}
	function send() {
		// send the response via Lambda's context

		var bodyToSerialise = _isRaw ? _body : Object.assign({}, _body);

		if (!_isRaw) {
			if (options.suppress) {
				var suppression = options.suppress;

				removeItemsUsingRules(bodyToSerialise.meta, suppression.emptyMetaItems, suppression.undefinedMetaItems);
				removeItemsUsingRules(bodyToSerialise.data, suppression.emptyDataItems, suppression.undefinedDataItems);

				if (suppression.emptyMeta) {
					if ((0, _utils._isEmpty)(bodyToSerialise.meta)) {
						delete bodyToSerialise.meta;
					}
				}

				switch (bodyToSerialise.meta.status) {
					case 200:
						delete bodyToSerialise.errors;
						break;
					case 422:
						delete bodyToSerialise.data;
						break;
				}
			}

			console.log(bodyToSerialise);
			callback(bodyToSerialise);
		} else {
			console.log(bodyToSerialise);
			callback(null, bodyToSerialise);
		}
	}

	function type(contentType) {
		_headers["Content-Type"] = contentType;
	}

	return {
		status: function status() {
			return _body.meta.status;
		},
		headers: _headers,
		type: type,
		body: _body,
		addWarning: function addWarning(type, message) {
			_body.warnings.push({
				type: type,
				message: message
			});
		},
		addHeader: function addHeader(name, value) {
			_headers[name] = value;
		},
		success: function success(data) {
			_body.meta.status = 200;
			_body.data = data;
		},
		raw: function raw(data) {
			_isRaw = true;
			_this.body = _body = data;
		},
		validationFailure: function validationFailure(errors) {
			_body.meta.status = 422;
			_body.meta.isRetryable = false;
			_body.errors = errors;
		},
		send: send
	};
};
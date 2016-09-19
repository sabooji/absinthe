"use strict";

import { _isArray, _isObject, _isEmpty } from "./utils";

export default (function (callback, options) {

	if (options === undefined) {
		throw new Error("Missing options into the Response object.");
	}

	let _isRaw = false;
	let _body = {
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
	const _headers = {};

	function removeItemsUsingRules(items, removeEmptyItems, removeUndefinedItems) {
		if (removeEmptyItems || removeUndefinedItems) {
			const objectKeys = Object.keys(items);

			for (let x = 0; x < objectKeys.length; x++) {

				console.log(`Evaluating [${objectKeys[x]}] for removal`);

				const valueToEvaluate = items[objectKeys[x]];

				if (_isObject(valueToEvaluate)) {
					removeItemsUsingRules(valueToEvaluate, removeEmptyItems, removeUndefinedItems);
				}

				if ((removeUndefinedItems && valueToEvaluate === undefined)
							|| (removeEmptyItems && _isEmpty(valueToEvaluate))) {

					console.log(`Removing [${objectKeys[x]}]`);
					delete items[objectKeys[x]];
				}
			}
		}
	}
	function send() {
		// send the response via Lambda's context

		const bodyToSerialise = (_isRaw) ? _body : Object.assign({}, _body);

		if (!_isRaw) {
			if (options.suppress) {
				const suppression = options.suppress;

				removeItemsUsingRules(bodyToSerialise.meta, suppression.emptyMetaItems, suppression.undefinedMetaItems);
				removeItemsUsingRules(bodyToSerialise.data, suppression.emptyDataItems, suppression.undefinedDataItems);

				if (suppression.emptyMeta) {
					if (_isEmpty(bodyToSerialise.meta)) {
						delete bodyToSerialise.meta;
					}
				}

				switch(bodyToSerialise.meta.status) {
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
		}
		else {
			console.log(bodyToSerialise);
			callback(null, bodyToSerialise);
		}
	}

	function type(contentType) {
		_headers["Content-Type"] = contentType;
	}

	return {
		status: () => {
			return _body.meta.status;
		},
		headers: _headers,
		type: type,
		body: _body,
		addWarning: (type, message) => {
			_body.warnings.push({
				type: type,
				message: message
			});
		},
		addHeader: (name, value) => {
			_headers[name] = value;
		},
		success: (data) => {
			_body.meta.status = 200;
			_body.data = data;
		},
		raw: (data) => {
			_isRaw = true;
			this.body = _body = data;
		},
		validationFailure: (errors) => {
			_body.meta.status = 422;
			_body.meta.isRetryable = false;
			_body.errors = errors;
		},
		send: send
	};
});

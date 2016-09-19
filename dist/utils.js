"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports._isArray = _isArray;
exports._isObject = _isObject;
exports._isEmpty = _isEmpty;
function _isArray(candidate) {
	return candidate !== undefined && candidate.constructor === Array;
}

function _isObject(candidate) {
	return candidate !== undefined && candidate.constructor === Object;
}

function _isEmpty(candidate) {
	if (_isArray(candidate)) {
		return candidate.length === 0;
	} else if (_isObject(candidate)) {
		return Object.keys(candidate).length === 0;
	}

	return false;
}
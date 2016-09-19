"use strict";

export function _isArray(candidate) {
	return (candidate !== undefined) && candidate.constructor === Array;
}

export function _isObject(candidate) {
	return (candidate !== undefined) && candidate.constructor === Object;
}

export function _isEmpty(candidate) {
	if (_isArray(candidate)) {
		return (candidate.length === 0);
	}
	else if (_isObject(candidate)) {
		return (Object.keys(candidate).length === 0);
	}

	return false;
}

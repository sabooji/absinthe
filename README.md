# Absinthe

Absinthe is an small, opinionated framework for developing an API on AWS Lambda. It has been designed to sit behind [woodhouse] whilst the API Gateway in AWS lacks a number of features. It has a similar API to express.js but removes a number of features not required for the specific use case it was created for. You're always welcome to fork and send me a pull request.

The API response structure is pre-defined and is described by the RAML file [here]. However, an example is included below:

```javascript
{
	meta: {
		status: 200,
		apiRequestId: "xyz123",
		clientRequestId: "abc098",
		dataAge: 10,
		warnings: [],
		pagination: {}
	},
	data: {
		id: "1",
		name: "Joe Bloggs"
	}
}
```

## Getting Started
An example of a simple hello world echo service is shown below in ES6.

```javascript
"use strict";

import Absinthe from "@syntaxa/absinthe";

const app = new Absinthe.ApiService();

app.post("/hello/{echo}", (request, response) => {
	console.log(`Received request to ${request.method} ${request.uri}`);

	response.success({
		"pong": request.params.echo
	});

	response.send();
});

module.exports = app;
```

## To Do

1. All the tests!

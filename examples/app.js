"use strict";

import ApiService from "../src/ApiService";
import Request from "../src/Request";
import Response from "../src/Response";

const usersNumbers = ["+441460455043"];

const app = new ApiService();

app.post("/hello/{echo}", (request, response) => {
	console.log(`Received request to ${request.method} ${request.uri}`);

	response._success({
		"pong": request.params.echo
	});

	response.send();
});

'use strict';

var MongoClient = require('mongodb').MongoClient;
var winston = require('winston');
var url = require('url');
var _ = require('lodash');

winston.add(winston.transports.File, { filename: 'userbroker.log', level: 'debug', json: false, prettyPrint: true });

winston.info('starting...');	
winston.error("Errors will be logged here");
winston.warn("Warns will be logged here");
winston.info("Info will be logged here");
winston.debug("Debug will be logged here");

process.on('uncaughtException', function(err) {
  winston.error('Caught exception: ' + err);
});


var mongoUrl = process.env.EVENTDBURI;
winston.info('using ' + url.parse(mongoUrl).host);

MongoClient.connect(mongoUrl, function(err, db) {

	winston.info('connected to db');
	if(err){
		console.log(err);
	}

	var events = db.collection('oneself');
	var condition = {
		"payload.objectTags": {$in: ['active-window']}
	};

	events.find(condition).toArray(function(error, docs){
		winston.log('found events');
		var groupedEvents = {};
		_.map(docs, function(event){
			var date = event.payload.eventLocalDateTime.toDateString();
			if(groupedEvents[date] === undefined){
				groupedEvents[date] = [];
			}

			groupedEvents[date].push(event.payload);
		});

		var requestBody = {};
		requestBody.userId = 'user1';
		requestBody.streamid = 'LQCLHIMFIIESRHEI';
		requestBody.writeToken = '641fafa180a4236807bba592d5f589d25204af7d3b62';
		_.forOwn(groupedEvents, function(value){
			requestBody.events = value;

			var options = {
			  method: 'post',
			  body: requestBody,
			  json: true,
			  url: 'http://devflow.azurewebsites.net/api/events'
			};

			winston.info('rb', requestBody);
			winston.info(JSON.stringify(requestBody));
			winston.info(options);
			// request.post(options, function(error, response){
			// 	logger.info('message brokered', {response: response.statusCode, body: response.body});
			// });
		});

		process.exit();
	});

	
});


// Expose app
//exports = module.exports = app;

module.exports = {};
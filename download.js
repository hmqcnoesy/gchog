var request = require('request');
var fileWriter = require('./fileWriter.js');
var cheerio = require('cheerio');
var urlParser = require('url');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var yearMonth = process.argv[2];
if (!yearMonth || !/20[0-9]{4}/.test(yearMonth)) {
	console.log('Specify the and month as 1st argument, e.g. 201504');
	process.exit();
}

var year = yearMonth.substr(0, 4);
var month = yearMonth.substr(4);

var language = process.argv[3];
if (!language) {
	console.log('Specify the "language" as 3rd argument');
	process.exit();
}

var url = 'https://www.lds.org/general-conference/sessions/' + year + '/' + month + '?lang=' + language;

var useProxy = process.argv[5] && process.argv[5] == '-proxy';

request(createRequest(url), function (error, response, body) {
  if (!error && response.statusCode == 200) {
	var $ = cheerio.load(body);
	var $talks = $('span.talk');
	
	console.log('Found ' + $talks.length + ' talks in ' + language);
	
	$talks.each(function(idx, talk) {
		var link = $(talk).find('a');
		
		if (link.attr('href')) {
			getTalk($(link).attr('href'));
		}
	});
	
  } else {
	  console.log(error, response ? response.statusCode : '');
	  process.exit();
  }
});


function createRequest(url) {
	return {
    	method: "GET",
    	uri: url,
    	proxy: useProxy ? "http://127.0.0.1:8888" : undefined
	};
}


function getTalk(url) {
	var segments = urlParser.parse(url, true).path.split('/');
	var talkName = segments[segments.length-1];
	talkName = talkName.substr(0, talkName.indexOf('?'));
	
	request(createRequest(url), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			fileWriter('html', yearMonth, language, talkName + '.html', body);
		} else {
			console.log(error, response ? response.statusCode : '');
		}
	});
}
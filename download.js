var request = require('request');
var fileWriter = require('./fileWriter.js');
var cheerio = require('cheerio');

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

console.log('Requesting toc');
request(createRequest(url), function (error, response, body) {
  if (!error && response.statusCode == 200) {
	console.log('Got toc data');
	var $ = cheerio.load(body);
	var $talks = $('span.talk');
	
	for (var i = 0; i < $talks.length; i++) {
		var link = $($talks[i]).find('a');
		
		if (link) {
			getTalk(i, $(link).attr('href'));
		} else {
			stubTalk(i);
		}
	}
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


function getTalk(number, url) {
	console.log('Getting talk ' + number);
	request(createRequest(url), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot talk data');
			fileWriter('html', yearMonth, language, number + '.html', body);
		} else {
			console.log(error, response ? response.statusCode : '');
		}
	});
}


function stubTalk(number) {
	console.log('Stubbing talk ' + number);
	fileWriter('html', yearMonth, language, number + '.html', '');
}
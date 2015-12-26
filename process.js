var cheerio = require('cheerio');
var fileWriter = require('./fileWriter');
var fs = require('fs');
var path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var yearAndMonth = process.argv[2];
if (!yearAndMonth) {
	console.log('Specify year and month as 1st argument, e.g. 201510');
	process.exit();
}

var language = process.argv[3];
if (!language) {
	console.log('Specify language as 2nd argument');
	process.exit();
}

var dirToProcess = path.join(__dirname, 'html', yearAndMonth, language);

var files = fs.readdirSync(dirToProcess);
var fileContents, $;

for (var i = 0; i < files.length; i++) {
	fileContents = fs.readFileSync(path.join(dirToProcess, files[i]), { encoding: 'utf-8' });
	$ = cheerio.load(fileContents);
	$('#references, .noteMarker').remove();
	
	var talk = {
		title : $('#details h1').html().replace(/\s+/g, ' ').trim(),
		kicker : $('.kicker').text(),
		speaker: $('#p2').text(),
		paragraphs : []	
	};
	
	$('#primary p, #primary h2').each(function() {
		talk.paragraphs.push($(this).text());
	});
	
	fileWriter('json', yearAndMonth, language, files[i].replace('html', 'json'), JSON.stringify(talk));
}
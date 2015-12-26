var bomUrls = require('./bomUrls.js');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	process.exit();
}

function logError(error) {
	console.log(chalk.bgRed('----------------------------------------------------------------------------------------'));
	console.log(chalk.bgRed(language + ' ' + error));
	console.log(chalk.bgRed('----------------------------------------------------------------------------------------'));
}

function logSuccess(message) {
	//console.log(chalk.bgGreen(message));
}

var readDir = path.join(__dirname, 'json', language);
var json = null;

console.log(chalk.bgBlue('Verifying ' + language));

fs.readFile(path.join(readDir, 'nav.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (!json.languageName) logError('Expected languageName in nav.json, found nothing');
		if (json.books.length != 19) logError('Expected 19 objects in nav.json books, found ' + json.length);
		logSuccess('Verified nav.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'welcome', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in welcome.json, found ' + json.heading);
		if (json.prevAbbr != 'welcome') logError('Expected welcome as prevAbbr in welcome.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'bofm-title') logError('Expected bofm-title as nextAbbr in welcome.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in welcome.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in welcome.json, found ' + json.nextNo);
		if (!json.verses || json.verses.length != 4) logError('Expected 4 verses in welcome.json, found ' + (json.verses ? json.verses.length : '?'));
		logSuccess('Verified welcome/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'bofm-title', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in bofm-title/1.json, found ' + json.heading);
		if (json.prevAbbr != 'welcome') logError('Expected welcome as prevAbbr in bofm-title/1.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'introduction') logError('Expected introduction as nextAbbr in bofm-title/1.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in bofm-title/1.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in bofm-title/1.json, found ' + json.nextNo);
		if (!json.chapterTitle) logError('Expected chapterTitle in bofm-title/1.json, found nothing');
		if (!json.verses || (json.verses.length != 5 && json.verses.length != 4)) logError('Expected 4 or 5 verses in bofm-title/1.json, found ' + (json.verses ? json.verses.length : '?'));
		
		if (!json.verses[0].isHeader) logError('Expected first verse of bofm-title/1.json to be isHeader, found otherwise');
				
		logSuccess('Verified bofm-title/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'introduction', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in introduction/1.json, found ' + json.heading);
		if (json.prevAbbr != 'bofm-title') logError('Expected bofm-title as prevAbbr in introduction/1.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'explanation') logError('Expected explanation as nextAbbr in introduction/1.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in introduction/1.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in introduction/1.json, found ' + json.nextNo);
		if (!json.chapterTitle) logError('Expected chapterTitle in introduction/1.json, found nothing');
		if (!json.verses || json.verses.length != 50) logError('Expected 50 verses in introduction/1.json, found ' + (json.verses ? json.verses.length : '?'));
		
		if (json.verses.length > 10) {
			if (json.verses[10].length < 500) logError('Expected eleventh verse of introduction/1.json to be long (testimony of 3 witnesses), found length ' + json.verses[10].length);
			if (json.verses[11].length > 20) logError('Expected twelfth verse of introduction/1.json to be short (Oliver Cowdery), found length ' + json.verses[11].length);
			if (json.verses[15].length < 500) logError('Expected sixteenth verse of introduction/1.json to be long (testimony of 8 witnesses), found length ' + json.verses[15].length);
			if (json.verses[16].length > 20) logError('Expected seventeenth verse of introduction/1.json to be short (Christian Whitmer), found length ' + json.verses[16].length);
			if (json.verses[24].length > 40) logError('Expected twenty-fifth verse of introduction/1.json to be short ("Testimony of the prophet..."), found length ' + json.verses[24].length);
		}
		logSuccess('Verified introduction/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'explanation', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in explanation/1.json, found ' + json.heading);
		if (json.prevAbbr != 'introduction') logError('Expected introduction as prevAbbr in explanation/1.json, found ' + json.prevAbbr);
		if (json.nextAbbr != '1-ne') logError('Expected 1-ne as nextAbbr in explanation/1.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in explanation/1.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in explanation/1.json, found ' + json.nextNo);
		if (!json.chapterTitle) logError('Expected chapterTitle in explanation/1.json, found nothing');
		if (!json.verses || json.verses.length > 10 || json.verses.length < 8) logError('Expected 8 to 10 verses in explanation/1.json, found ' + (json.verses ? json.verses.length : '?'));

		logSuccess('Verified explanation/1.json');
	} else {
		logError(error);
	}
});


bomUrls.chapters.forEach(function(element, index) {
	fs.readFile(path.join(readDir, element.book, element.chapter + '.json'), function(error, data) {
		if (!error) {
			json = JSON.parse(data);
			if (!json.verses) logError('Expected verses in ' + element.book + ' ' + element.chapter + '.json, found nothing');
			if (json.verses && json.verses.length !== element.verses) logError('Expected ' + element.verses + ' verses in ' + element.book + ' ' + element.chapter + '.json, found ' + json.verses.length);
			logSuccess('Verified ' + element.book + '/' + element.chapter + '.json');
		} else {
			logError(error);
		}
	});
});

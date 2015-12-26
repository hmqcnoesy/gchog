var fs = require('fs');
var path = require('path');

module.exports = function(root, yearMonth, language, fileName, fileContents) {
	var rootDir = path.join(__dirname, root);
	var yearMonthDir = path.join(rootDir, yearMonth);
	var langDir = path.join(yearMonthDir, language);
	
	if (!fs.existsSync(rootDir)) {
		fs.mkdirSync(rootDir);
	}
	
	if (!fs.existsSync(yearMonthDir)) {
		fs.mkdirSync(yearMonthDir);
	}
	
	if (!fs.existsSync(langDir)) {
		fs.mkdirSync(langDir);
	}
	
	var fileName = path.join(langDir, fileName);
	
	fs.writeFile(fileName, fileContents, function (err) {
		if (err) throw err;
		console.log('\tSaved ' + fileName);
	});
}
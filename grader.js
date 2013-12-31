#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var checksfile_current = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var loadHtmlUrl = function(url) {
    rest.get(url).on('complete', function(response) {
	var cheerioedHtmlFile = cheerioHtmlFile(response);
	console.log(cheerioedHtmlFile);
	checkCheerioHtml(cheerioedHtmlFile);
    });
};

var cheerioHtmlFile = function(html) {
    return cheerio.load(html);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile, url) {
    checksfile_current = checksfile;
    if (url) {
	loadHtmlUrl(url);
    } else {
	console.log(htmlfile);
	var cheerioedHtmlFile = cheerioHtmlFile(fs.readFileSync(htmlfile));
	checkCheerioHtml(cheerioedHtmlFile);
    }
};

var checkCheerioHtml = function(cheerioedHtmlFile) {
    $ = cheerioedHtmlFile;
    var checks = loadChecks(checksfile_current).sort();
    var out = {};
    for (var ii in checks) {
	console.log(ii);
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
};

var clone = function(fn) {
    return fn.bind({});
};

if (require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'URL of index.html')
	.parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks, program.url);
} else {
    exports.checkHtmlfile = checkHtmlFile;
}

#! /usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var cliselect = require('list-selector-cli');
var util = require('util');

//var requestUrl = 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8';

var requestUrl = 'http://www.google.com/search';

var options = {
  url: requestUrl,
  method: 'GET'
};

var userArgs = process.argv.slice(2);



request(options, function(err, resp, body) {
  var responseString;
  if ((err === null) && resp.statusCode === 200) {
    var $ = cheerio.load(body);
    console.log(resp);
  } else {
    new Error('Error on response' + (resp ? ' (' + resp.statusCode + ')' : '') + ':' + err + ' : ' + body);
  }
});


/* List selection

var keywordChoices = new cliselect(userArgs);

var promise = keywordChoices.prompt();

promise.done(function (selection) {
  console.log(selection);
});
*/

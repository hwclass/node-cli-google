#! /usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var cliselect = require('list-selector-cli');
var util = require('util');

var itemSel = 'li.g';

//var requestUrl = 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8';

var requestUrl = 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8';

var options = {
  url: requestUrl,
  resultsPerPage : 10,
  tld : 'com',
  lang : 'en',
  method: 'GET'
};

var userArgs = process.argv.slice(2);



request(options, function(err, resp, body) {
  var responseString;
  console.log(111);
  if ((err === null) && resp.statusCode === 200) {
    console.log(222);
    var $ = cheerio.load(body);
    console.log(body);
    /*
    $(itemSel).each(function (i, elem) {
      console.log(elem);
    });
    */
  } else if (!!err) {
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

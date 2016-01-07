#! /usr/bin/env node

var request = require('request');
var querystring = require('querystring');
var cheerio = require('cheerio');
var cliselect = require('list-selector-cli');
var util = require('util');
var windowOpen = require('open');

var userArgs = process.argv.slice(2);

var requestUrl = 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8';

var searchObj = searchObj || {};
    searchObj.tld = 'com';
    searchObj.lang = 'en';
    searchObj.requestOptions = {};

requestUrl = util.format(requestUrl, searchObj.tld, searchObj.lang, querystring.escape(userArgs), 0, searchObj.resultsPerPage);

var options = { uri: requestUrl, method: 'GET'},
    itemList = [];

request(options, function(err, resp, body) {
  var responseString;
  if ((err === null) && resp.statusCode === 200) {
    var $ = cheerio.load(body);
    var list = $('body .g');
    $(list).each(function (ind, item) {
      if (ind !== list.length) {
        if (typeof item.children[0] !== 'undefined' && typeof item.children[0].children[0].attribs.href !== 'undefined') {
          itemList.push(unescape(item.children['0'].children['0'].attribs.href.split('/url?q=')[1].split('&sa=')[0]));
        }
      }
    });
  } else {
    new Error('Error: ' + err);
  }

  var keywordChoices = new cliselect(itemList);

  var promise = keywordChoices.prompt();

  promise.done(function (selection) {
    for (var selectionIndex = 0, len = selection.length; selectionIndex < len; selectionIndex++) {
      windowOpen(selection[selectionIndex]);
    }
  });

});

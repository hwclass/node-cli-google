#! /usr/bin/env node

var request = require('request')
var querystring = require('querystring')
var cheerio = require('cheerio')
var cliselect = require('list-selector-cli')
var util = require('util')
var windowOpen = require('open')
var _ = require('lodash')

var userArgs = process.argv.slice(2),
    langParameterPrefix = '--lang-',
    totalResultSetPrefix = '--resultset-'

var lang = querystring.escape(userArgs).split(langParameterPrefix)[1],
    totalResultSetNum = querystring.escape(userArgs).split(totalResultSetPrefix)[1];

var requestUrl = 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8'

var searchObj = {
  tld : 'com',
  lang : lang,
  totalResultSetNum : totalResultSetNum
 }

requestUrl = util.format(requestUrl, searchObj.tld, searchObj.lang, querystring.escape(userArgs), 0, searchObj.totalResultSetNum)

var defaultStatusCodeOK = 200,
    options = { headers: {'Content-Type': 'application/x-www-form-urlencoded'}, uri : requestUrl, method : 'GET'},
    itemList = []

request(options, function(err, resp, body) {
  if (_.isNull(err) && resp.statusCode === defaultStatusCodeOK) {
    var $ = cheerio.load(body);
    var list = $('body .g');
    $(list).each(function (ind, item) {
      if (ind !== list.length) {
        if ((!_.isUndefined(item.children[0])) && (!_.isUndefined(item.children[0].children[0].attribs.href)) && (!_.contains(item.children[0].children[0].attribs.href.split('/url?q=')[0], '/search?'))) {
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

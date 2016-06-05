#! /usr/bin/env node

//Dependencies
var request = require('request'),
    querystring = require('querystring'),
    cheerio = require('cheerio'),
    cliselect = require('list-selector-cli'),
    util = require('util'),
    windowOpen = require('open'),
    _ = require('lodash'),
    
    //The default variables
    defaultStatusCodeOK = 200,
    itemList = [],
    
    //The user arguments to get
    userArgs = process.argv.slice(2),
    langParameterPrefix = '--lang-',
    totalResultSetPrefix = '--resultset-',

    //language and total result set number
    lang = querystring.escape(userArgs).split(langParameterPrefix)[1],
    totalResultSetNum = querystring.escape(userArgs).split(totalResultSetPrefix)[1];

var NodeCliGoogleBuilder = (function () {
  return {
    //URL Builder for request
    RequestUrlBuilder : {
      getBuiltUrl : function (rawUrl, tld, lang, totalResultSetNum) {
        var proto = new Object(); 
        proto.rawUrl = rawUrl;
        proto.tld = tld;
        proto.lang = lang;
        proto.totalResultSetNum = totalResultSetNum;
        return util.format(proto.rawUrl, proto.tld, proto.lang, 0, proto.totalResultSetNum); 
      }
    },
    //Request Builder for request
    RequestBuilder : {
      makeRequest : function () {
        request(options, function (err, resp, body) {
          if (_.isNull(err) && resp.statusCode === defaultStatusCodeOK) {
            var $ = cheerio.load(body);
            var list = $('body .g');
            $(list).each(function () {
              if (ind !== list.length) {
                if ((!_.isUndefined(item.children[0])) && (_.isUndefined(item.children[0].children[0].attribs.href)) && (!_.contains(item.children[0].children[0].attribs.href.split('/url?q=')[0], '/search?'))) {
                  itemList.push(unescape(item.chilren[0].children[0].attribs.href.split('/url?q=')[1].split('&sa=')[0]));
                }       
              }
            })
          }
        })
      }
    } 
  }
})();

//The search literal
var searchObj = {
  rawUrl : 'http://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8',
  tld : 'com',
  lang : lang,
  totalResultSetNum : totalResultSetNum
 }

//Formatted request URL
requestUrl = NodeCliGoogleBuilder.RequestUrlBuilder.getBuiltUrl(searchObj.rawUrl, searchObj.tld, searchObj.lang, querystring.escape(userArgs), 0, searchObj.totalResultSetNum);

//Options container
var options = { 
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }, 
  uri : requestUrl, 
  method : 'GET'
};

//The point that we fetched the data
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

  //create the list for selection
  var keywordChoices = new cliselect(itemList);

  //chain it into a promise
  var promise = keywordChoices.prompt();

  //when the promise is completed, do the following as opening the browser
  promise.done(function (selection) {
    for (var selectionIndex = 0, len = selection.length; selectionIndex < len; selectionIndex++) {
      windowOpen(selection[selectionIndex]);
    }
  });

});

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _tsheetsSdk = require('tsheets-sdk');

var TSheets = _interopRequireWildcard(_tsheetsSdk);

var _firebase = require('../utils/firebase');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function index(req, res) {
  // const { start_date, end_date} = req.body
  callUntilLastPage({ resource: 'timesheets', method: 'get', params: { modified_since: '2016-06-29T15:19:21+00:00', per_page: 2 } }).then(function (results) {
    console.log('do until completion results:', results);
    (0, _firebase.getFirebase)().ref('tsheets/timesheets').update(results).then(function (fireRes) {
      console.log('Firebase Response:', fireRes);
      res.json(results);
    }).catch(function (error) {
      console.log('error setting ref:', error);
      res.status(500).json(error);
    });
  }).catch(function (error) {
    console.log('error with do until completion:', error);
    res.status(error.code || 500).json(error);
  });
}

var pageCount = 0;
var allowedCallCount = 3;
// Calls TSheets API mutiple times in a row until
function callUntilLastPage(_ref) {
  var resource = _ref.resource;
  var method = _ref.method;
  var params = _ref.params;
  var results = _ref.results;

  if (!params.page) params.page = 0;
  params.page++;
  pageCount++;
  console.log('\n\ncallcount: ' + pageCount + '\n\n');
  if (pageCount >= allowedCallCount) {
    console.log('page count limit was reached', pageCount);
    return results;
  }
  return TSheets[resource][method](params).then(function (res) {
    if (!res.more || !res.results || !res.results[resource]) {
      console.log('-------- noooooo moreeeeee', results);
      return results;
    }
    results = Object.assign({}, results || {}, res.results[resource]);
    return callUntilLastPage({ resource: resource, method: method, params: params, results: results });
  }).catch(function (error) {
    console.error('error gettting resource:', error);
    return Promise.reject(error);
  });
}

function crawlFromToNow() {}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _tsheetsSdk = require('tsheets-sdk');

var TSheets = _interopRequireWildcard(_tsheetsSdk);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function index(req, res) {
  // const { start_date, end_date} = req.body
  doUntilCompletion({ resource: 'timesheets', method: 'get', params: { modified_since: '2016-06-28T15:19:21+00:00' } }).then(function (results) {
    console.log('do until completion results:', results);
    res.json(results);
  }).catch(function (error) {
    console.log('error with do until completion:', error);
    res.status(error.code || 500).json(error);
  });
}
var callCount = 0;
function doUntilCompletion(_ref) {
  var resource = _ref.resource;
  var method = _ref.method;
  var params = _ref.params;
  var results = _ref.results;

  console.log('do until complete', { resource: resource, method: method, params: params, results: results });
  if (!params.page) params.page = 0;
  params.page++;
  callCount++;
  console.log('\n\ncallcount: ' + callCount + '\n\n');
  console.log('TSheets', TSheets.timesheets);
  if (callCount >= 5) {
    console.log('it was called more than would be good', callCount);
    return results;
  }
  return TSheets[resource][method](params).then(function (res) {
    if (!res.more || !res.results || !res.results[resource]) {
      console.log('-------- noooooo moreeeeee', results);
      return results;
    }
    if (!results) results = Object.assign({}, res.results[resource]);
    results = Object.assign({}, results, res.results[resource]);
    return doUntilCompletion({ resource: resource, method: method, params: params, results: results });
  }).catch(function (error) {
    console.error('error gettting resource:', error);
    return Promise.reject(error);
  });
}

function crawlFromToNow() {}
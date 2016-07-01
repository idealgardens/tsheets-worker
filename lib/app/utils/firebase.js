'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirebase = undefined;

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFirebase = exports.getFirebase = function getFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyBZhtrbo4O1preOARIAoSsUXDepZW13k6g',
    authDomain: 'idealgardens-codeword.firebaseapp.com',
    databaseURL: 'https://idealgardens-codeword.firebaseio.com',
    storageBucket: 'idealgardens-codeword.appspot.com'
  };

  _firebase2.default.initializeApp(config);
  return _firebase2.default.database();
};
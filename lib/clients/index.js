"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assocPath2 = require("ramda/src/assocPath");

var _assocPath3 = _interopRequireDefault(_assocPath2);

var _has2 = require("ramda/src/has");

var _has3 = _interopRequireDefault(_has2);

var _toPairs2 = require("ramda/src/toPairs");

var _toPairs3 = _interopRequireDefault(_toPairs2);

var _prop2 = require("ramda/src/prop");

var _prop3 = _interopRequireDefault(_prop2);

var _map2 = require("ramda/src/map");

var _map3 = _interopRequireDefault(_map2);

var _fromPairs2 = require("ramda/src/fromPairs");

var _fromPairs3 = _interopRequireDefault(_fromPairs2);

var _compose2 = require("ramda/src/compose");

var _compose3 = _interopRequireDefault(_compose2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _test = require("../records/test");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Splitster client class abstraction
 * containing all the common methods
 */
var SplitsterClient =

// Live data

// Config
function SplitsterClient(_ref, copy) {
  var _this = this;

  var config = _ref.config,
      user = _ref.user,
      userId = _ref.userId,
      _ref$override = _ref.override,
      override = _ref$override === undefined ? {} : _ref$override;

  _classCallCheck(this, SplitsterClient);

  this.tests = {};
  this.options = {};
  this.user = "";
  this.userId = "";

  this.getSaveResults = function () {
    var includeVersions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return (0, _compose3.default)(_fromPairs3.default, (0, _map3.default)(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          testId = _ref3[0],
          test = _ref3[1];

      return [includeVersions ? testId + "_" + test.version : testId, (0, _prop3.default)("winningVariant", test)];
    }), _toPairs3.default)(_this.tests);
  };

  this.get = function (testId) {
    if (!(0, _has3.default)(testId, _this.tests)) {
      console.warn("Splitster: Trying to access not existing test: " + testId + ", your value will be null.");
      return { value: null };
    }
    return { value: _this.tests[testId].winningVariant };
  };

  this.set = function (testId, variantId) {
    console.log("parent set");
    return new _this.constructor({}, {
      tests: _this.tests,
      options: _this.options,
      user: _this.user,
      results: (0, _assocPath3.default)([testId, "winningVariant"], variantId, _this.tests)
    });
  };

  if (!config && !user && !userId && copy) {
    // Create new one from copy
    console.log("copy", copy);
    this.tests = copy.tests;
    this.options = copy.options;
    this.user = copy.user;
    this.results = copy.results;
    return;
  }

  // Initialize splitster

  // Set user
  this.user = user;
  this.userId = userId;
  // Set options
  this.options = config.options;

  this.tests = (0, _test.getTestsFromConfig)(config.tests, { override: override, user: user, userId: userId });
};

exports.default = SplitsterClient;
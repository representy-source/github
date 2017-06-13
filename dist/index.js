'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Source = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _sources = require('./sources');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Github {
  constructor(options) {
    this.options = options || {};
    if (!_lodash2.default.get(this.options, 'user') && !_lodash2.default.get(this.options, 'org')) {
      throw new Error('options must have `user` or `org` param');
    }
    this.options.isUser = this.isUser();
    this.options.name = this.options.isUser ? this.options.user : this.options.org;
  }

  getBase() {
    return {
      name: 'Github',
      home: `https://github.com/${this.options.name}`,
      logo: {
        svg: _sources.svgLogo,
        base64: _sources.logoBase64
      }
    };
  }

  isUser() {
    return !!this.options.user;
  }

  getUserProfile() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const options = _this.options;
      const url = `https://api.github.com/users/${options.name}`;
      const headers = {
        'User-Agent': 'representy-source-github'
      };
      if (options.token && options.token.length) {
        headers.Authorization = `token ${options.token}`;
      }
      return (0, _requestPromiseNative2.default)({
        url,
        json: true,
        headers
      });
    })();
  }

  load() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const result = _this2.getBase();
      const profile = yield _this2.getUserProfile();
      result.stats = [{
        title: 'repos',
        count: profile.public_repos
      }, {
        title: 'gists',
        count: profile.public_gists
      }, {
        title: 'followers',
        count: profile.followers
      }];
      result.profile = profile;
      return result;
    })();
  }
}

exports.default = Github;
exports.Source = Github;
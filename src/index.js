import _ from 'lodash';
import request from 'request-promise-native';
import { logoBase64, svgLogo } from './sources';

class Github {
  constructor(options) {
    this.options = options || {};
    if (!_.get(this.options, 'user') && !_.get(this.options, 'org')) {
      throw new Error('options must have `user` or `org` param');
    }
    this.options.isUser = this.isUser();
    this.options.name = this.options.isUser
      ? this.options.user
      : this.options.org;
  }

  getBase() {
    return {
      name: 'Github',
      home: `https://github.com/${this.options.name}`,
      logo: {
        svg: svgLogo,
        base64: logoBase64,
      },
    };
  }

  isUser() {
    return !!this.options.user;
  }

  async getUserProfile() {
    const options = this.options;
    const url = `https://api.github.com/users/${options.name}`;
    const headers = {
      'User-Agent': 'representy-source-github',
    };
    if (options.token && options.token.length) {
      headers.Authorization = `token ${options.token}`;
    }
    return request({
      url,
      json: true,
      headers,
    });
  }

  async load() {
    const result = this.getBase();
    const profile = await this.getUserProfile();
    result.stats = [
      {
        title: 'repos',
        count: profile.public_repos,
      },
      {
        title: 'gists',
        count: profile.public_gists,
      },
      {
        title: 'followers',
        count: profile.followers,
      },
    ];
    result.profile = profile;
    return result;
  }
}

export default Github;
export { Github as Source };

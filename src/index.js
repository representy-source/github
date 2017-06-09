import { logoBase64, svgLogo } from './sources';

class Github {
  constructor(options, request) {
    this.options = options || {};
    if (!this.options.user && !this.options.org) {
      throw new Error('options must have `user` or `org` param');
    }
    this.request = request;
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
      'User-Agent': 'representation-source-github',
    };
    if (options.token && options.token.length) {
      headers.Authorization = `token ${options.token}`;
    }
    return this.request({
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

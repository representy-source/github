import request from 'request-promise-native';
import Github from '../src/index';

const token = process.env.GITHUB_TOKEN;

describe('Github', () => {
  test('constructor', () => {
    let user = null;
    expect.assertions(3);
    try {
      user = new Github();
      expect(user).not.toBeNull();
    } catch (e) {
      expect(user).toBeNull();
      expect(e).not.toBeNull();
      expect(e).toBeInstanceOf(Error);
    }
  });
  test('isUser', () => {
    const user = new Github({
      user: 'user',
    });
    const org = new Github({
      org: 'org',
    });
    expect(user.isUser()).toBe(true);
    expect(org.isUser()).toBe(false);
  });
  test('load', async () => {
    const github = new Github(
      {
        user: 'salimkayabasi',
        token,
      },
      request,
    );
    const result = await github.load();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('home');
    expect(result).toHaveProperty('stats');
    expect(result).toHaveProperty('logo');
    expect(result.logo).toHaveProperty('base64');
    expect(result.logo).toHaveProperty('svg');
    expect(result.stats).toBeInstanceOf(Array);
    expect(result.stats).toHaveLength(3);
    result.stats.forEach((stat) => {
      expect(stat).toHaveProperty('title');
      expect(stat.title.length).toBeGreaterThan(1);
      expect(stat).toHaveProperty('count');
      expect(typeof stat.count).toBe('number');
    });
  });
});

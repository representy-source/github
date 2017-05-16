import request from 'request-promise-native';
import Github from '../src/index';

describe('Github', () => {
  test('load', async () => {
    const github = new Github(
      {
        user: 'salimkayabasi',
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

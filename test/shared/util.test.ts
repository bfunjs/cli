import { afterEach, describe, expect, it, vi } from 'vitest';

import { compile, toCamel } from '../../src/shared/util.js';

describe('compile', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces built-in date placeholders and provided data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-12T03:04:05.000Z'));

    expect(compile('{{YYYY}}-{{MM}}-{{DD}}/{{name}}', { name: 'bfun' })).toBe(
      '2026-07-12/bfun',
    );
  });

  it('replaces missing placeholders with an empty string', () => {
    expect(compile('hello {{ missing }}')).toBe('hello ');
  });

  it('provides random hexadecimal hash6 and hash8 placeholders', () => {
    const result = compile('{{hash6}}/{{hash8}}');
    const [hash6, hash8] = result.split('/');

    expect(hash6).toMatch(/^[\da-f]{6}$/);
    expect(hash8).toMatch(/^[\da-f]{8}$/);
  });
});

describe('toCamel', () => {
  it('converts separated names to camel case', () => {
    expect(toCamel('hello-world_name')).toBe('helloWorldName');
  });

  it('throws when name is empty', () => {
    expect(() => toCamel('')).toThrow('name is required');
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({ default: axiosMock }));

const readBfunConfigMock = vi.hoisted(() => vi.fn());

vi.mock('../../src/shared/config.js', () => ({
  readBfunConfig: readBfunConfigMock,
}));

vi.mock('../../src/shared/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn() },
}));

const { fetchConfig } = await import('../../src/shared/request.js');

describe('fetchConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readBfunConfigMock.mockReturnValue({
      accessKey: 'request-ak',
      apiUrl: 'https://api.example.com',
      secretKey: 'request-sk',
    });
  });

  it('returns deployment credentials from the application data payload', async () => {
    const deploymentConfig = {
      provider: {
        accessKey: 'deploy-ak',
        bucket: 'bucket',
        provider: 'AliYun',
        region: 'oss-cn-hangzhou',
        secretKey: 'deploy-sk',
      },
      sourceDir: '/name/{{appId}}/{{version}}/',
      sourceUrl: 'https://src.example.com',
    };
    axiosMock.get.mockResolvedValue({
      data: { code: 0, data: deploymentConfig },
    });

    await expect(fetchConfig({ appId: 'A1', token: 'token' })).resolves.toEqual(
      deploymentConfig,
    );
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://api.example.com/open/v1/application/data',
      {
        headers: { ak: 'request-ak', sk: 'request-sk' },
        params: { appId: 'A1', token: 'token' },
      },
    );
  });

  it('rejects the removed deployment fields without source fields', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        code: 0,
        data: {
          cloudDir: 'release',
          localDir: 'dist',
          provider: {},
          publicPath: '/',
        },
      },
    });

    await expect(fetchConfig({ appId: 'A1', token: 'token' })).rejects.toThrow(
      'sourceDir, sourceUrl, provider',
    );
  });
});

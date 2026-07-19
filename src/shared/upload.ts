import { Uploader } from '@bfun/utils';

import { IUploadConfig } from '../typings/index.js';

const { AliYun, QiNiu } = Uploader;

export async function uploadDir(options: IUploadConfig) {
  const {
    accessKey,
    bucket,
    distDir,
    region,
    secretKey,
    sourceDir,
    provider = '',
  } = options;
  const debug = process.env.DEBUG === 'true';

  switch (provider) {
    case 'AliYun': {
      const uploader = new AliYun({
        ACCESS_KEY: accessKey,
        bucket: bucket || '',
        debug,
        region: region || '',
        SECRET_KEY: secretKey,
      });
      await uploader.uploadDir(distDir, sourceDir);
      return uploader;
    }

    // case 'QCloud': {
    //     const uploader = new QCloud({});
    //     await uploader.uploadDir(distDir, sourceDir);
    //     break;
    // }
    case 'QiNiu': {
      const uploader = new QiNiu({
        ACCESS_KEY: accessKey,
        bucket: bucket || '',
        debug,
        region: region || '',
        SECRET_KEY: secretKey,
      });
      await uploader.uploadDir(distDir, sourceDir);
      return uploader;
    }

    default: {
      throw new Error('platform 设置错误，当前仅支持阿里云、腾讯云、七牛云');
    }
  }
}
